"use client"
import {useEffect, useState} from "react";
import {
    CalendarIcon,
    FileTextIcon,
    ImageIcon,
    LoaderCircleIcon,
    MapPinIcon,
    PersonStandingIcon,
    SearchIcon,
    TicketIcon
} from "lucide-react"
import axios from "axios";
import {useAuth} from "../hooks/useAuth.js";
import {useNavigate} from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

export default function AdminPage() {
    const {user, token} = useAuth();
    const navigate = useNavigate();
    const currentRole = user?.role;
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("users");
    //Fields search events
    const [title, setTitle] = useState("")
    const [location, setLocation] = useState("")
    const [date, setDate] = useState("")

    const [users, setUsers] = useState([]);
    const [events, setEvents] = useState([]);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [eventForm, setEventForm] = useState({
        Title: "",
        Description: "",
        Date: "",
        Location: "",
        Image: "",
        NumberOfPlaces: 0,
    })


    const handleSearchEvents = (e) => {
        e.preventDefault()
        //Construire la requête avec seulement les champs remplis
        let params = {}
        if (title) {
            params.title = title
        }
        if (location) {
            params.location = location
        }
        if (date) {
            //Traduire en ISO
            params.date = new Date(date).toISOString()
        }
        axios.get(`${apiUrl}/EventService/Events/getall`, {params, headers: {Authorization: `Bearer ${token}`}})
            .then((response) => {
                setEvents(response.data)
            })
            .catch((error) => {
                console.error(error);
                console.log("error.response.status", error.response.status)
                setErrorMessage("Erreur lors de la recherche des évènements.");
            });
    }


    const saveEventChanges = (eventId) => {

        let updatedEvent = events.find(event => event.id === eventId);
        //Supprimer l'id
        delete updatedEvent.id;
        console.log(updatedEvent);

        if (updatedEvent) {
            axios.put(`${apiUrl}/EventService/Events/${eventId}`, updatedEvent, {headers: {Authorization: `Bearer ${token}`}})
                .then(() => {
                    setEvents(events.map(event => event.id === eventId ? updatedEvent : event));
                    setSuccessMessage("Evènement mis à jour avec succès.");
                    setTimeout(() => setSuccessMessage(""), 3000);
                })
                .catch((error) => {
                    console.error(error);
                    setErrorMessage("Erreur lors de la mise à jour de l'évènement");
                });
        }
    }
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setEventForm({...eventForm, Image: file});
        }
    };
    const handleNumberOfPlacesChange = (event) => {
        const value = parseInt(event.target.value, 10);
        if (!isNaN(value)) {
            setEventForm({...eventForm, NumberOfPlaces: value});
        }
    };


    const createEvent = (eventForm) => {
        setErrorMessage("");
        const formData = new FormData();
        formData.append('Title', eventForm.Title);
        formData.append('Description', eventForm.Description);
        formData.append('Date', formatDate(eventForm.Date));
        formData.append('Location', eventForm.Location);
        formData.append('Image', eventForm.Image);
        formData.append('NumberOfPlaces', eventForm.NumberOfPlaces);

        axios.post(`${apiUrl}/EventService/Events/create`, formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(() => {
                setEvents([...events, eventForm]);
                setEventForm({
                    Title: "",
                    Description: "",
                    Date: "",
                    Location: "",
                    Image: "",
                    NumberOfPlaces: 0,
                });
                setSuccessMessage("Événement ajouté avec succès.");
                setTimeout(() => setSuccessMessage(""), 3000);
            })
            .catch((error) => {
                if (error.response && error.response.data) {
                    setErrorMessage(error.response.data);
                } else {
                    setErrorMessage("Erreur lors de la création de l'événement.");
                }
                console.log(error);
            });
    };
    const formatDate = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };


    useEffect(() => {
        if (activeTab === "users") {
            setLoading(true);
            setEvents([]);
            axios.get(`${apiUrl}/UserService/Users/GetAll`, {headers: {Authorization: `Bearer ${token}`}})
                .then((response) => {
                    setUsers(response.data)
                    setLoading(false);

                })
                .catch((error) => {
                    if (error.response.status === 401) {
                        navigate("/login");
                    }
                    console.error(error);
                    setLoading(false);
                    setErrorMessage("Erreur lors du chargement des utilisateurs.");
                });
        } else if (activeTab === "events") {
            setLoading(true);
            setEvents([]);
            axios.get(`${apiUrl}/EventService/Events/getall`, {headers: {Authorization: `Bearer ${token}`}})
                .then((response) => {
                    setEvents(response.data)
                    setLoading(false);
                })
                .catch((error) => {
                    console.error(error);
                    setLoading(false);
                    setErrorMessage("Erreur lors du chargement des évènements.");
                });
        }
    }, [activeTab]);

    return (
        <div className="min-h-screen bg-gray-100 pb-12">
            {/* Tabs */}
            <div className="bg-white shadow-md py-6 mb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex space-between items-center justify-between">
                        <div className="flex space-x-4">
                            <button
                                onClick={() => setActiveTab("users")}
                                className={`px-4 py-2 rounded-md ${activeTab === "users" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700 cursor-pointer"}`}
                            >
                                Utilisateurs
                            </button>
                            <button
                                onClick={() => setActiveTab("events")}
                                className={`px-4 py-2 rounded-md ${activeTab === "events" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700 cursor-pointer"}`}
                            >
                                Évènements
                            </button>
                        </div>
                        <button
                            onClick={() => setActiveTab("add-event")}
                            className={`px-4 py-2 rounded-md ${activeTab === "add-event" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700 cursor-pointer"}`}
                        >
                            Ajouter un évènement
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {activeTab === "users" && !loading && (
                        <div className="lg:w-full">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Utilisateurs</h2>
                                {currentRole !== 'administrator' && (
                                    <p className="text-sm text-gray-500">
                                        Seuls les utilisateurs ont le droit de modifier leurs informations.
                                    </p>
                                )}
                            </div>
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                {users.map((user) => (
                                    <div key={user.id}
                                         className="bg-white shadow-md rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-105">
                                        <div className="p-6">
                                            <div className="flex flex-col space-y-2">
                                                <h2 className="text-xl font-semibold text-gray-800">
                                                    {user.userName}
                                                </h2>
                                                <p className="text-gray-600">
                                                    <strong>Email:</strong> {user.email}
                                                </p>
                                                <p className="text-gray-600">
                                                    <strong>Prénom:</strong> {user.firstName}
                                                </p>
                                                <p className="text-gray-600">
                                                    <strong>Nom:</strong> {user.lastName}
                                                </p>
                                                <p className="text-gray-600">
                                                    <strong>Numéro:</strong> {user.phoneNumber || 'Non renseigné'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                        </div>
                    )}
                    {activeTab === "events" && (
                        <div className="lg:w-full">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Résultats de recherche</h2>
                                {currentRole !== 'admin' && (
                                    <p className="text-sm text-gray-500">
                                        Seuls les administrateurs ont le droit de modifier les évènements
                                    </p>
                                )}
                            </div>
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
                            <div className="bg-white shadow-md py-6 mb-8">
                                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                    <form onSubmit={handleSearchEvents}
                                          className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div className="relative">
                                            <label htmlFor="eventName" className="sr-only">
                                                Nom de l'évènement
                                            </label>
                                            <div
                                                className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <TicketIcon className="h-5 w-5 text-gray-400" aria-hidden="true"/>
                                            </div>
                                            <input
                                                id="eventName"
                                                name="eventName"
                                                type="text"
                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                placeholder="Nom de l'évènement"
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                            />
                                        </div>

                                        <div className="relative">
                                            <label htmlFor="eventLocation" className="sr-only">
                                                Localisation
                                            </label>
                                            <div
                                                className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <MapPinIcon className="h-5 w-5 text-gray-400" aria-hidden="true"/>
                                            </div>
                                            <input
                                                id="eventLocation"
                                                name="eventLocation"
                                                type="text"
                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                placeholder="Localisation"
                                                value={location}
                                                onChange={(e) => setLocation(e.target.value)}
                                            />
                                        </div>
                                        <div className="relative">
                                            <label htmlFor="eventDate" className="sr-only">
                                                Date
                                            </label>
                                            <div
                                                className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <CalendarIcon className="h-5 w-5 text-gray-400" aria-hidden="true"/>
                                            </div>
                                            <input
                                                id="eventLocation"
                                                name="eventLocation"
                                                type="date"
                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                placeholder="Date"
                                                value={date}
                                                onChange={(e) => setDate(e.target.value)}
                                            />
                                        </div>

                                        <div>
                                            <button
                                                type="submit"
                                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            >
                                                <SearchIcon className="mr-2 h-5 w-5" aria-hidden="true"/>
                                                Rechercher
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                {!loading && events.map((event) => (
                                    <div key={event.id} className="bg-white shadow rounded-lg overflow-hidden">
                                        <div className="p-6">
                                            <div className="flex flex-col items-start justify-between">
                                                <label className="text-gray-700">Titre:</label>
                                                <input
                                                    type="text"
                                                    className={`text-lg font-medium text-gray-900 w-full border rounded-md px-3 py-2`}
                                                    value={event.title}
                                                    onChange={(e) => setEvents(events.map(ev => ev.id === event.id ? {
                                                        ...ev,
                                                        title: e.target.value
                                                    } : ev))}
                                                />
                                                <label className="text-gray-700 mt-2">Description:</label>
                                                <input
                                                    type="text"
                                                    className={`text-lg font-medium text-gray-900 w-full border rounded-md px-3 py-2 mt-2`}
                                                    value={event.description}
                                                    onChange={(e) => setEvents(events.map(ev => ev.id === event.id ? {
                                                        ...ev,
                                                        description: e.target.value
                                                    } : ev))}
                                                />
                                                <label className="text-gray-700 mt-2">Date:</label>
                                                <input
                                                    type="datetime-local"
                                                    className={`text-lg font-medium text-gray-900 w-full border rounded-md px-3 py-2 mt-2`}
                                                    value={new Date(event.date).toISOString().slice(0, 16)}
                                                    onChange={(e) => setEvents(events.map(ev => ev.id === event.id ? {
                                                        ...ev,
                                                        date: e.target.value
                                                    } : ev))}
                                                />
                                                <label className="text-gray-700 mt-2">Localisation:</label>
                                                <input
                                                    type="text"
                                                    className={`text-lg font-medium text-gray-900 w-full border rounded-md px-3 py-2 mt-2`}
                                                    value={event.location}
                                                    onChange={(e) => setEvents(events.map(ev => ev.id === event.id ? {
                                                        ...ev,
                                                        location: e.target.value
                                                    } : ev))}

                                                />
                                                <label className="text-gray-700 mt-2">Image:</label>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className={`text-lg font-medium text-gray-900 w-full border rounded-md px-3 py-2 mt-2`}

                                                    onChange={(e) => setEvents(events.map(ev => ev.id === event.id ? {
                                                        ...ev,
                                                        image: e.target.files[0]
                                                    } : ev))}
                                                />
                                                <label className="text-gray-700 mt-2">Nombre de places:</label>
                                                <input
                                                    type="number"
                                                    className={`text-lg font-medium text-gray-900 w-full border rounded-md px-3 py-2 mt-2`}
                                                    value={event.numberOfPlaces}
                                                    onChange={(e) => setEvents(events.map(ev => ev.id === event.id ? {
                                                        ...ev,
                                                        numberOfPlaces: e.target.value
                                                    } : ev))}
                                                />
                                            </div>
                                            {currentRole === 'admin' && (
                                                <div className="mt-6 flex items-center justify-between">
                                                    <button
                                                        onClick={() => saveEventChanges(event.id)}
                                                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                    >
                                                        Enregistrer
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {activeTab === "add-event" && (
                        <div className="lg:w-full">
                            <div className="flex items-center justify-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Ajouter un évènement</h2>
                            </div>
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
                            <div className="bg-white shadow-md py-6 mb-8 rounded-lg">
                                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                    <form onSubmit={(e) => {
                                        e.preventDefault();
                                        createEvent(eventForm);
                                    }}
                                          className=" grid grid-cols-1 gap-4 max-w-lg mx-auto">
                                        <div className="relative">
                                            <label htmlFor="eventTitle" className="sr-only">
                                                Titre de l'évènement
                                            </label>
                                            <div
                                                className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <TicketIcon className="h-5 w-5 text-gray-400" aria-hidden="true"/>
                                            </div>
                                            <input
                                                id="eventTitle"
                                                name="eventTitle"
                                                type="text"
                                                required={true}
                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                placeholder="Titre de l'évènement"
                                                value={eventForm.Title}
                                                onChange={(e) => setEventForm({...eventForm, Title: e.target.value})}
                                            />
                                        </div>

                                        <div className="relative">
                                            <label htmlFor="eventDescription" className="sr-only">
                                                Description
                                            </label>
                                            <div
                                                className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FileTextIcon className="h-5 w-5 text-gray-400" aria-hidden="true"/>
                                            </div>
                                            <input
                                                id="eventDescription"
                                                name="eventDescription"
                                                type="text"
                                                required={true}
                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                placeholder="Description"
                                                value={eventForm.Description}
                                                onChange={(e) => setEventForm({
                                                    ...eventForm,
                                                    Description: e.target.value
                                                })}
                                            />
                                        </div>

                                        <div className="relative">
                                            <label htmlFor="eventDate" className="sr-only">
                                                Date
                                            </label>
                                            <div
                                                className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <CalendarIcon className="h-5 w-5 text-gray-400" aria-hidden="true"/>
                                            </div>
                                            <input
                                                id="eventDate"
                                                name="eventDate"
                                                type="datetime-local"
                                                required={true}
                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                placeholder="Date"
                                                value={eventForm.Date}
                                                onChange={(e) => setEventForm({...eventForm, Date: e.target.value})}
                                            />
                                        </div>

                                        <div className="relative">
                                            <label htmlFor="eventLocation" className="sr-only">
                                                Localisation
                                            </label>
                                            <div
                                                className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <MapPinIcon className="h-5 w-5 text-gray-400" aria-hidden="true"/>
                                            </div>
                                            <input
                                                id="eventLocation"
                                                name="eventLocation"
                                                type="text"
                                                required={true}
                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                placeholder="Localisation"
                                                value={eventForm.Location}
                                                onChange={(e) => setEventForm({...eventForm, Location: e.target.value})}
                                            />
                                        </div>

                                        <div className="relative">
                                            <label htmlFor="eventImage" className="sr-only">
                                                Image
                                            </label>
                                            <div
                                                className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <ImageIcon className="h-5 w-5 text-gray-400" aria-hidden="true"/>
                                            </div>
                                            <input
                                                id="eventImage"
                                                name="eventImage"
                                                type="file"
                                                accept="image/*"
                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                onChange={handleImageChange}
                                            />
                                        </div>

                                        <div className="relative">
                                            <label htmlFor="eventNumberOfPlaces" className="sr-only">
                                                Nombre de places
                                            </label>
                                            <div
                                                className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <PersonStandingIcon className="h-5 w-5 text-gray-400"
                                                                    aria-hidden="true"/>
                                            </div>
                                            <input
                                                id="eventNumberOfPlaces"
                                                name="eventNumberOfPlaces"
                                                type="number"
                                                min="0"
                                                required={true}
                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                placeholder="Nombre de places"
                                                value={eventForm.NumberOfPlaces}
                                                onChange={handleNumberOfPlacesChange}
                                            />
                                        </div>
                                        <div>
                                            <button
                                                type="submit"
                                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
                                            >
                                                Ajouter
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
                {loading && (
                    <div className="flex items-center justify-center h-screen">
                        <LoaderCircleIcon className={"animate-spin h-10 w-10"}/>
                    </div>
                )}
            </main>
        </div>
    )
}
