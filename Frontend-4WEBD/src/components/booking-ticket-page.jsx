import { useNavigate, useParams } from "react-router-dom";
import { CheckCircleIcon, LoaderCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../hooks/useAuth.js";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

export default function BookingTicketPage() {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const [event, setEvent] = useState({ id: 0, name: "", description: "", location: "", date: "", image: "" });
    const [loading, setLoading] = useState(true);
    const { id } = useParams();

    const [people, setPeople] = useState(1);
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [totalPrice, setTotalPrice] = useState(null);

    const handleBooking = () => {
        axios.post(`${apiUrl}/TicketService/api/Ticket`, {
            eventId: event.id,
            numberOfPlaces: people,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then((response) => {
                setSuccessMessage("Réservation effectuée avec succès.");
                window.history.pushState({}, null, `${window.location.href}/success`);
            })
            .catch((error) => {
                console.error(error);
                setErrorMessage("Une erreur est survenue lors de la réservation.");
                setTimeout(() => setErrorMessage(null), 2000);
            });
    }

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }

        axios.get(`${apiUrl}/EventService/Events/get/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                const eventData = response.data;
                setEvent(eventData);
                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setLoading(false);
            });
    }, [id, user, token, navigate]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <LoaderCircleIcon className="animate-spin h-10 w-10 mx-auto text-indigo-600" />
            </div>
        );
    }

    if (!event.id) {
        return (
            <div className="flex items-center justify-center h-96">
                <p className="text-center text-2xl text-gray-700">Évènement non trouvé.</p>
            </div>
        );
    }

    return (
        <>
            {successMessage && window.location.pathname.includes("/success") && (
                <div className="flex flex-col items-center justify-center h-screen bg-green-100">
                    <CheckCircleIcon className="h-16 w-16 text-green-500 mb-4" />
                    <div className="bg-white border border-green-400 text-green-700 px-8 py-6 rounded shadow-lg">
                        <span className="block sm:inline text-2xl font-bold mb-4">{successMessage}</span>
                        <p className="text-gray-700 mb-4">Détails de la réservation :</p>
                        <ul className="list-disc list-inside text-gray-700 mb-4">
                            <li>Nom : {event.title}</li>
                            <li>Date de l'évènement : {new Date(event.date).toLocaleDateString('fr-FR')}</li>
                            <li>Nombre de personnes : {people}</li>
                        </ul>
                        <button
                            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-300 ease-in-out"
                            onClick={() => navigate("/")}
                        >
                            Retour
                        </button>
                    </div>
                </div>
            )}
            {!successMessage && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {errorMessage && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                            <strong className="font-bold">Erreur : </strong>
                            <span className="block sm:inline">{errorMessage}</span>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="rounded-lg overflow-hidden shadow-lg">
                            <img src={`${apiUrl}/EventService${event.image}`}
                                 alt={event.name} className="w-full h-96 object-cover" />
                        </div>
                        <div className="flex flex-col justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-indigo-600 mb-4">{event.name}</h1>
                                <p className="text-gray-700 mb-4">{event.description}</p>
                                <p className="text-gray-700 mb-2">Localisation: <span className="font-semibold text-gray-900">{event.location}</span></p>
                                <p className="text-gray-700 mb-4">Le <span className="font-semibold text-gray-900">{new Date(event.date).toLocaleDateString('fr-FR')}</span> à <span className="font-semibold text-gray-900">{new Date(event.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span></p>
                            </div>
                            <div>
                                <div className="flex items-center mb-4">
                                    <label className="block w-1/4 text-gray-700">Nombre de personnes:</label>
                                    <input
                                        type="number"
                                        className="border p-2 rounded w-3/4"
                                        min={1}
                                        value={people}
                                        onChange={(e) => setPeople(e.target.value)}
                                    />
                                </div>
                                {totalPrice && (
                                    <p className="text-gray-500 mb-4">Prix total: <span className="font-semibold text-gray-900">{totalPrice}€</span></p>
                                )}
                                <button
                                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                                    onClick={handleBooking}
                                >
                                    Réserver
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
