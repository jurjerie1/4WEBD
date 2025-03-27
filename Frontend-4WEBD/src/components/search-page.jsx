"use client"
import {useEffect, useState} from "react";
import {CalendarIcon, MapPinIcon, SearchIcon, TicketIcon} from "lucide-react"
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../hooks/useAuth.js";

export default function SearchPage() {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001/api";
    const {token, user} = useAuth();
    const navigate = useNavigate();
    //Paramètres de recherche
    const [eventTitle, setEventTitle] = useState("")
    const [eventLocation, setEventLocation] = useState("")
    const [eventDate, setEventDate] = useState("")


    const [limit, setLimit] = useState(10)
    const [events, setEvents] = useState([]);


    const handleSearch = (e) => {
        e.preventDefault()
        fetchEvents();
    }

    const fetchEvents = () => {
        const params = {};
        if (eventTitle !== "") {
            params.title = eventTitle;
        }
        if (eventLocation !== "") {
            params.location = eventLocation;
        }
        if (eventDate !== "") {
            params.date = eventDate;
        }

        if (limit !== 20) {
            params.pageSize = limit;
        }

        axios
            .get(`${apiUrl}/EventService/Events/getall`, {
                params,
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            .then((response) => {
                const eventData = response.data;
                setEvents(eventData);
            })
            .catch((error) => {
                console.error(error);
            })
    }


    const handleReservation = (eventId) => {
        navigate(`/booking/${eventId}`)
    }

    useEffect(() => {
        if (user) {
            fetchEvents();
        }
    }, [])
    if (user)
        return (
            <div className="min-h-screen bg-gray-100 pb-12">
                {/* Search Form */}
                <div className="bg-white shadow-md py-6 mb-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <form onSubmit={handleSearch}
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
                                    id="eventTitle"
                                    name="eventTitle"
                                    type="text"
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="Nom de l'évènement"
                                    value={eventTitle}
                                    onChange={(e) => setEventTitle(e.target.value)}
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
                                    value={eventLocation}
                                    onChange={(e) => setEventLocation(e.target.value)}
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
                                    value={eventDate}
                                    onChange={(e) => setEventDate(e.target.value)}
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

                {/* Main Content */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-8">

                        {/* Results */}
                        {Array.isArray(events) && events.length > 0 ? (
                            <div className="w-full">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center space-x-4">
                                        <h2 className="text-2xl font-bold text-gray-900">Résultats de recherche</h2>
                                        <span className="text-sm text-gray-500">
                                        {events.length} évènement{events.length > 1 ? "s" : ""} trouvé{events.length > 1 ? "s" : ""}
                                    </span>
                                    </div>
                                    <div className="ml-auto">
                                        <label htmlFor="limit" className="sr-only">
                                            Limite de résultats
                                        </label>
                                        <select
                                            id="limit"
                                            name="limit"
                                            className="rounded-md border border-gray-300 shadow-sm px-2 py-1 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
                                            value={limit}
                                            onChange={(e) => {
                                                setLimit(Number.parseInt(e.target.value));
                                                fetchEvents();
                                            }}
                                        >

                                            <option value="20">20 résultats</option>
                                            <option value="30">30 résultats</option>
                                            <option value="50">50 résultats</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {events.map((event) => (
                                        <div key={event.id} className="bg-white shadow rounded-lg overflow-hidden">
                                            <div className="relative h-48">
                                                <img src={`${apiUrl}/EventService${event.image}`}
                                                     alt={event.name}
                                                     className="object-cover w-full h-full"/>
                                            </div>
                                            <div className="p-6">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="text-lg font-medium text-gray-900">{event.name}</h3>
                                                        <p className="text-sm text-gray-500 flex items-center mt-1">
                                                            <TicketIcon className="h-4 w-4 mr-1"/>
                                                            {event.location}
                                                        </p>
                                                    </div>
                                                    <div
                                                        className="flex items-center bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                                                        <span>{event.numberOfPlaces} places disponibles</span>
                                                    </div>
                                                </div>
                                                <p className="mt-4 text-sm text-gray-600">{event.description}</p>

                                                <div className="mt-6 flex items-center justify-between">
                                                    <div>
                                                        <span
                                                            className="text-2xl font-bold text-gray-900">{new Date(event.date).toLocaleDateString()}</span>
                                                        <span
                                                            className="block text-sm text-gray-500">à {new Date(event.date).toLocaleTimeString([], {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}</span>
                                                    </div>
                                                    <button
                                                        onClick={() => handleReservation(event.id)}
                                                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
                                                    >
                                                        Réserver
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>) : (
                            <div className="lg:w-3/4">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Résultats de recherche</h2>
                                <p className="text-lg text-gray-500">Aucun évènement trouvé</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        )

    else

        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-center text-2xl text-gray-700">Connectez-vous pour accéder à cette page.</p>
            </div>
        )


}