import {useEffect, useState} from 'react';
import {Trash} from 'lucide-react';
import {useAuth} from '../hooks/useAuth.js';
import axios from 'axios';
import {Link, useNavigate} from "react-router-dom";


const apiUrl = import.meta.env.VITE_API_URL;
export default function AccountReservationInfo() {
    const {user, token} = useAuth();
    const navigate = useNavigate();
    const [reservations, setReservations] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');


    const handleCancelReservation = (id) => {
        axios.delete(`${apiUrl}/TicketService/api/Ticket/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then((response) => {
                setSuccessMessage(response.data.message);
                handleSearchReservations();
            })
            .catch((error) => {
                setErrorMessage(error.response.data.error);
                console.error('Erreur lors de l\'annulation de la réservation', error);
            });
    };

    const handleSearchReservations = () => {
        axios.get(`${apiUrl}/TicketService/api/Ticket/user`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then((response) => {
                const reservationsData = response.data;
                setReservations(reservationsData);
            })
            .catch((error) => {
                console.error(error);
            });
    }


    useEffect(() => {
        if (user) {
            handleSearchReservations();
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
            {reservations && (
                <div>
                    <h2 className="text-2xl font-bold mb-6">Mes Réservations</h2>
                    {reservations.map(reservation => (
                        <div key={reservation.id} className="bg-white shadow-md rounded-lg p-6 mb-6">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center space-x-2">
                                    <h3 className="text-xl font-bold">Réservation pour {reservation.event.title}</h3>
                                    <p className="text-gray-600">(Réservé
                                        le {new Date(reservation.event.date).toLocaleDateString('fr-FR')})</p>
                                </div>
                                {reservation.status === 'Confirmed' && (
                                <div className="flex items-center">
                                    <button
                                        onClick={() => handleCancelReservation(reservation.id)}
                                        className="text-red-500 hover:text-red-700 flex items-center cursor-pointer"
                                    >
                                        <Trash className="h-5 w-5 mr-2"/>
                                        Annuler
                                    </button>
                                </div>
                                    )}
                            </div>
                            <div className="grid grid-cols-4 gap-4">
                                <div className="col-span-1 hidden md:block">
                                    <img src={`${apiUrl}/EventService${reservation.event.image}`} alt={reservation.event.title} />
                                </div>
                                <div className="col-span-4 md:col-span-3">
                                    <div className="flex items-center mb-4">
                                        <p className="block w-1/4 text-gray-700">Date:</p>
                                        <span className="font-bold">{new Date(reservation.date).toLocaleDateString('fr-FR')} à {new Date(reservation.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>

                                    <div className="flex items-center mb-4">
                                        <label className="block w-1/4 text-gray-700">Nombre de places réservées:</label>
                                        <span className="font-bold">{reservation.numberOfPlaces}</span>
                                    </div>
                                    <div className="flex items-center mb-4">
                                        <label className="block w-1/4 text-gray-700">Statut:</label>
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${reservation.status === "Pending" ? "bg-yellow-100 text-yellow-800" : reservation.status === "Confirmed" ? "bg-green-100 text-green-800" : reservation.status === "Cancelled" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"}`}
                                        >
                {reservation.status === "Pending" ? "En attente" : reservation.status === "Confirmed" ? "Confirmée" : reservation.status === "Cancelled" ? "Annulée" : "Inconnue"}
            </span>{reservation.status === "Pending" && ( <p className="text-center text-sm text-gray-600">
                                       Pour confirmer la réservation, cliquer{" "}
                                        <Link to="http://localhost:8025/"  target="_blank" className="font-medium text-indigo-600 hover:text-indigo-500">
                                            ici
                                        </Link>.
                                    </p>)}
                                    </div>
                                    <div className="flex items-center">
                                        <label className="block w-1/4 text-gray-700">Lieu:</label>
                                        <span className="font-bold">{reservation.event.location}</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            )}
            {reservations.length === 0 && (
                <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                    <p>Vous n'avez pas de réservations en cours.</p>
                </div>
            )}
        </>
    );
};
