"use client"
import {useEffect, useState} from "react";
import {TicketIcon, SearchIcon, UsersIcon} from "lucide-react"
import {Menu} from "@headlessui/react"
import {StarIcon as SolidStarIcon} from '@heroicons/react/24/solid'
import {StarIcon as OutlineStarIcon} from "@heroicons/react/24/outline";
import axios from "axios";
import {useNavigate} from "react-router-dom";

export default function SearchPage() {
    const apiUrl = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    const [destination, setDestination] = useState("")
    const [eventDate, setEventDate] = useState("")
    const [guests, setGuests] = useState("2")
    const [priceRange, setPriceRange] = useState([50, 500])
    const [limit, setLimit] = useState(10)
    const [amenitiesFilter, setAmenitiesFilter] = useState({
        wifi: false,
        restaurant: false,
        pool: false,
        parking: false,
        gym: false
    })
    const [events, setEvents] = useState([]);


    const handleSearch = (e) => {
        e.preventDefault()
        fetchEvents();
    }

    const fetchEvents = () => {
        const params = {};
        if (destination !== "") {
            params.destination = destination;
        }
        if (eventDate !== "") {
            params.eventDate = eventDate;
        }

        if (guests !== "") {
            params.guests = guests;
        }
        if (priceRange[1] !== 500) {
            params.price = priceRange[1];
        }
        if (limit !== 10) {
            params.limit = limit;
        }
        if (Object.values(amenitiesFilter).some(Boolean)) {
            params.amenities = JSON.stringify(Object.keys(amenitiesFilter).filter((key) => amenitiesFilter[key]));
        }


        axios
            .get(`${apiUrl}/events/search`, {params})
            .then((response) => {
                const eventData = response.data;
                setEvents(eventData);
            })
            .catch((error) => {
                console.error(error);
            })
    }

    const clearSearch = () => {
        setDestination("")
        setEventDate("")
        setGuests("2")
        setPriceRange([50, 500])
        setAmenitiesFilter({wifi: false, restaurant: false, pool: false, parking: false, gym: false})
    }

    const handleReservation = (eventId) => {
        navigate(`/booking/${eventId}`)
    }

    useEffect(() => {
        fetchEvents();
    }, [])
    return (
        <div className="min-h-screen bg-gray-100 pb-12">
            {/* Search Form */}
            <div className="bg-white shadow-md py-6 mb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative">
                            <label htmlFor="destination" className="sr-only">
                                Destination
                            </label>
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <TicketIcon className="h-5 w-5 text-gray-400" aria-hidden="true"/>
                            </div>
                            <input
                                id="destination"
                                name="destination"
                                type="text"
                                required
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Entrez un événement"
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                            />
                        </div>

                        <div className="relative">
                            <label htmlFor="event-date" className="sr-only">
                                Date de l'évènement
                            </label>
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <input
                                id="event-date"
                                name="event-date"
                                type="date"
                                /*required*/
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={eventDate}
                                onChange={(e) => setEventDate(e.target.value)}
                            />
                        </div>


                        <div className="relative">
                            <Menu as="div" className="relative inline-block text-left w-full">
                                <div>
                                    <Menu.Button
                                        className="inline-flex justify-between w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
                                        {guests} personne{guests > 1 ? "s" : ""}
                                        <UsersIcon className="ml-2 -mr-1 h-5 w-5 text-gray-400" aria-hidden="true"/>
                                    </Menu.Button>
                                </div>

                                <Menu.Items
                                    className="origin-top-right absolute z-10 right-0 mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                                >
                                    <div className="py-1">
                                        {[1, 2, 3, 4, 5].map((number) => (
                                            <Menu.Item key={number}>
                                                {(active) => (
                                                    <button
                                                        onClick={() => setGuests(number.toString())}
                                                        className={`${
                                                            active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                                                        } block px-4 py-2 text-sm w-full text-left`}
                                                    >
                                                        {number} personne{number > 1 ? "s" : ""}
                                                    </button>
                                                )}
                                            </Menu.Item>
                                        ))}
                                    </div>
                                </Menu.Items>
                            </Menu>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
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
                    {/* Filters */}
                    <div className="lg:w-1/4">
                        <div className="bg-white shadow rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-medium text-gray-900 ">Filtres</h2>
                                <button className="text-indigo-600 hover:text-indigo-700 cursor-pointer "
                                        onClick={clearSearch}>Effacer la recherche
                                </button>
                            </div>
                            <div className="mb-6">
                                <h3 className="font-medium text-gray-900 mb-2">Budget</h3>
                                <div className="flex items-center space-x-4">
                                    <input
                                        type="range"
                                        min="0"
                                        max="1000"
                                        value={priceRange[1]}
                                        onChange={(e) => {
                                            setPriceRange([priceRange[0], Number.parseInt(e.target.value)]);
                                        }}
                                        onMouseUp={() => fetchEvents()}
                                        className="w-full"
                                    />
                                    <span className="text-sm text-gray-500">{priceRange[1]}€</span>
                                </div>
                            </div>


                        </div>
                    </div>

                    {/* Results */}
                    {Array.isArray(events) && events.length > 0 ? (
                        <div className="lg:w-3/4">
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
                                        <option value="10">10 résultats</option>
                                        <option value="20">20 résultats</option>
                                        <option value="50">50 résultats</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {events.map((event) => (
                                    <div key={event.id} className="bg-white shadow rounded-lg overflow-hidden">
                                        <div className="relative h-48">
                                            <img src={event.picture || "/placeholder.svg"} alt={event.name}
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
                                                    {[...Array(5)].map((_, index) => (
                                                        index < event.rating ? (
                                                            <SolidStarIcon
                                                                key={index}
                                                                className={`h-4 w-4 mr-1 text-yellow-500`}
                                                            />
                                                        ) : (
                                                            <OutlineStarIcon
                                                                key={index}
                                                                className={`h-4 w-4 mr-1 text-yellow-500`}
                                                            />
                                                        )
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="mt-4 text-sm text-gray-600">{event.description}</p>

                                            <div className="mt-6 flex items-center justify-between">
                                                <div>
                                                    <span
                                                        className="text-2xl font-bold text-gray-900">{event.price}€</span>
                                                    <span className="text-gray-600 text-sm"> / nuit</span>
                                                </div>
                                                <button
                                                    onClick={() => handleReservation(event.id)}
                                                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
}