import {useNavigate, useParams} from "react-router-dom";
import {CheckCircleIcon, LoaderCircleIcon, MapPinIcon} from "lucide-react";
import {useState} from "react";
import axios from "axios";
import {useAuth} from "../hooks/useAuth.js";

const apiUrl = import.meta.env.VITE_API_URL;

export default function BookingTicketPage() {
    const {user, token} = useAuth();
    const navigate = useNavigate();
    /*const [event, setEvent] = useState(null);*/
    const [event, setEvent] = useState({
        id: 1,
        name: "Event name",
        date: "31/12/2026",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.",
        picture: "https://picsum.photos/500/300",
        price: 10,
    });
    const [loading, setLoading] = useState(false);
    const {id} = useParams();

    const [eventDate, setEventDate] = useState("");
    const [people, setPeople] = useState(1);
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [totalPrice, setTotalPrice] = useState(null);


    const handleBooking = () => {

        // Calculer le prix total
        setTotalPrice(event.price * people);

        axios.post(apiUrl + "/reservations/create", {
            user_id: user.id,
            event_id: event.id,
            people,
            total_price: totalPrice,
            status: "waiting"
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then((response) => {
                setSuccessMessage("Réservation effectuée avec succès.");
                //ajouter /success a l'url
                window.history.pushState({}, null, window.location.href + "/success");
            })
            .catch((error) => {
                console.error(error);
                setErrorMessage("Une erreur est survenue lors de la réservation.");
                setTimeout(() => setErrorMessage(null), 2000);
            });
    }
    /* useEffect(() => {
         setTotalPrice(event.price * people);
     }, [people]);*/


    /*useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }
        // Récupérer les données de l'évènement
        axios.get(`${apiUrl}/event/search`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {id}
        })
            .then((response) => {
                const eventData = response.data[0];

                setEvent(eventData);
                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setLoading(false);
            });
    }, [id]);*/

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <LoaderCircleIcon className={"animate-spin h-10 w-10 mx-auto"}/>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="flex items-center justify-center h-96">
                <p className="text-center text-2xl">Évènement non trouvé.</p>
            </div>
        )
    }

    return (<>
            {successMessage && window.location.pathname.includes("/success") && (
                <div className="flex flex-col items-center justify-center h-screen bg-green-100">
                    <CheckCircleIcon className="h-16 w-16 text-green-500 mb-4"/>
                    <div className="bg-white border border-green-400 text-green-700 px-8 py-6 rounded shadow-lg">
                        <span className="block sm:inline text-2xl font-bold mb-4">{successMessage}</span>
                        <p className="text-gray-700 mb-4">Votre réservation a été effectuée avec succès !</p>
                        <p className="text-gray-700 mb-4">Détails de la réservation :</p>
                        <ul className="list-disc list-inside text-gray-700 mb-4">
                            <li>Hôtel : {event.name}</li>
                            <li>Date de l'évènement : {eventDate}</li>
                            <li>Nombre de personnes : {people}</li>
                            <li>Prix total : {totalPrice}€</li>
                        </ul>
                        <button
                            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
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
                        <div>
                            <img src={event.picture} alt={event.name} className="w-full h-96 object-cover rounded-lg shadow-md"/>
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h1 className="text-3xl font-bold text-indigo-600">{event.name}</h1>
                                {totalPrice && (
                                    <p className="text-gray-500">Prix total: <span className="font-semibold text-gray-900">{totalPrice}€</span></p>
                                )}
                            </div>
                            <p className="text-gray-700 mb-4">{event.description}</p>
                            <p className="text-gray-700 mb-4">Prix par personne: <span className="font-semibold text-gray-900">{event.price}€</span></p>
                            <label className="block text-gray-700 mb-4">Date: <span className="font-semibold text-gray-900">{event.date}</span></label>
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
                            <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:scale-105"
                                    onClick={handleBooking}>Réserver {eventDate && (`pour ${totalPrice}€`)}</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
