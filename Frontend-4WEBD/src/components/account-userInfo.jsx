import { useEffect, useState } from 'react';
import { Trash } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

export default function AccountUserInfo() {
    const { user, token, logout } = useAuth();
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState({
        firstName: '',
        lastName: '',
        userName: '',
        email: '',
        phoneNumber: ''
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleUpdateInfo = (field, value) => {
        setUserInfo({ ...userInfo, [field]: value });
    };

    const handleUpdateAccount = () => {
        axios.put(`${apiUrl}/UserService/Users`, userInfo, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then((response) => {
                setSuccessMessage(response.data.message);
            })
            .catch((error) => {
                const errorMessages = Object.values(error.response.data.errors).flat();
                setErrorMessage(errorMessages.join(' ') || "Une erreur est survenue lors de la mise à jour des informations.");
            });
    }

    const handleDeleteAccount = () => {
        axios.delete(`${apiUrl}/UserService/Users`, {
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
                const errorMessages = Object.values(error.response.data.errors).flat();
                setErrorMessage(errorMessages.join(' ') || "Une erreur est survenue lors de la suppression du compte.");
            });
    };

    const handleSearchInfos = () => {
        axios.get(`${apiUrl}/UserService/Users`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then((response) => {
                const userData = response.data;
                setUserInfo({
                    firstName: userData.firstName || "Non renseigné",
                    lastName: userData.lastName || "Non renseigné",
                    userName: userData.userName || "Non renseigné",
                    email: userData.email || "Non renseigné",
                    phoneNumber: userData.phoneNumber || "Non renseigné"
                });
            })
            .catch((error) => {
                console.error(error);
            });
    };


    useEffect(() => {
        if (user) {
            handleSearchInfos();
        } else {
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
                            <label className="block w-1/4 text-gray-700">Prénom:</label>
                            <input type="text"
                                   name="firstName"
                                   value={userInfo.firstName}
                                   onChange={(e) => handleUpdateInfo("firstName", e.target.value)}
                                   className="border p-2 rounded w-3/4"
                            />
                        </div>
                        <div className="flex items-center mb-4">
                            <label className="block w-1/4 text-gray-700">Nom:</label>
                            <input type="text"
                                   name="lastName"
                                   value={userInfo.lastName}
                                   onChange={(e) => handleUpdateInfo("lastName", e.target.value)}
                                   className="border p-2 rounded w-3/4"
                            />
                        </div>
                        <div className="flex items-center mb-4">
                            <label className="block w-1/4 text-gray-700">Pseudo:</label>
                            <input
                                type="text"
                                name="userName"
                                value={userInfo.userName}
                                onChange={(e) => handleUpdateInfo("userName", e.target.value)}
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
                        <div className="flex items-center mb-4">
                            <label className="block w-1/4 text-gray-700">Numéro de téléphone:</label>
                            <input type="text"
                                   name="phoneNumber"
                                   value={userInfo.phoneNumber}
                                   onChange={(e) => handleUpdateInfo("phoneNumber", e.target.value)}
                                   className="border p-2 rounded w-3/4"
                            />
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <button
                            onClick={handleUpdateAccount}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 cursor-pointer"
                        >
                            Enregistrer
                        </button>
                        <button
                            onClick={handleDeleteAccount}
                            className="flex items-center text-red-500 hover:text-red-700 cursor-pointer"
                        >
                            <Trash className="h-5 w-5 mr-2" />
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
