import {useEffect, useState} from 'react';
import {Trash} from 'lucide-react';
import {useAuth} from '../hooks/useAuth.js';
import axios from 'axios';
import {useNavigate} from "react-router-dom";


const apiUrl = import.meta.env.VITE_API_URL;
export default function AccountUserInfo() {
    const {user, token, logout} = useAuth();
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState({});
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');


    const handleUpdateInfo = (field, value) => {
        setUserInfo({...userInfo, [field]: value});
    };
    const handleUpdateAccount = () => {
        const userId = user.id;
        axios.put(`${apiUrl}/users/${userId}`, userInfo, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then((response) => {
                setSuccessMessage(response.data.message);
            })
            .catch((error) => {
                setErrorMessage(error.response.data.error);
                console.error('Erreur lors de la mise à jour des informations', error);
            });
    }

    const handleDeleteAccount = () => {
        const userId = user.id;
        axios.delete(`${apiUrl}/users/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then((response) => {
                setSuccessMessage(response.data.message);
                setTimeout(() => {
                    navigate('/');
                }, 2000);
                logout();
            })
            .catch((error) => {
                setErrorMessage(error.response.data.error);
                console.error('Erreur lors de la suppression du compte', error);
            });
    };

    const handleSearchInfos = () => {
        const userId = user.id;
        axios.get(`${apiUrl}/users/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then((response) => {
                const userData = response.data;
                setUserInfo(userData);
            })
            .catch((error) => {
                console.error(error);
            });
    };


    useEffect(() => {
        if ( user) {
            handleSearchInfos();
        }
        else {
            navigate('/login');
        }
    }, []);

    return (
        <>
            {successMessage && (
                <div
                    className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
                    role="alert">
                    <strong className="font-bold">Succès! </strong>
                    <span className="block sm:inline">{successMessage}</span>
                </div>
            )}
            {errorMessage && (
                <div
                    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                    role="alert">
                    <strong className="font-bold">Erreur! </strong>
                    <span className="block sm:inline">{errorMessage}</span>
                </div>
            )}

                {userInfo && (
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Mes Informations</h2>
                        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                            <div className="flex items-center mb-4">
                                <label className="block w-1/4 text-gray-700">Pseudo:</label>
                                <input
                                    type="text"
                                    name="pseudo"
                                    value={userInfo.pseudo}
                                    onChange={(e) => handleUpdateInfo("pseudo", e.target.value)}
                                    className="border p-2 rounded w-3/4"
                                />
                            </div>
                            <div className="flex items-center mb-4">
                                <label className="block w-1/4 text-gray-700">Email:</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={userInfo.email}
                                    onChange={(e) => handleUpdateInfo("email", e.target.value)}
                                    className="border p-2 rounded w-3/4"
                                />
                            </div>
                            <div className="flex items-center">
                                <label className="block w-1/4 text-gray-700">Date d'inscription:</label>
                                <span>{userInfo.created_at ? new Date(userInfo.created_at).toLocaleDateString('fr-FR') : "N/A"}</span>
                            </div>

                        </div>
                        <div className="flex justify-between">
                            <button
                                onClick={handleUpdateAccount}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                            >
                                Enregistrer
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                className="flex items-center text-red-500 hover:text-red-700"
                            >
                                <Trash className="h-5 w-5 mr-2"/>
                                Supprimer mon compte
                            </button>
                        </div>
                    </div>
                )}
                {!userInfo && (
                    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                        <p>Vos informations ne sont pas disponibles pour le moment.</p>
                    </div>

                )}
        </>

    );
};
