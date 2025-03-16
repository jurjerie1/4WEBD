"use client"
import {useEffect, useState} from "react";
import {
    EuroIcon,
    FileTextIcon,
    HotelIcon,
    ImageIcon,
    MapPinIcon,
    SearchIcon,
    SettingsIcon,
    StarIcon,
    UsersIcon,
    PersonStandingIcon,
} from "lucide-react"
import axios from "axios";
import {useAuth} from "../hooks/useAuth.js";
import {useNavigate} from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL;

export default function AdminPage() {
    const {user, token} = useAuth();
    const navigate = useNavigate();
    const currentRole = user?.role;
    const [activeTab, setActiveTab] = useState("users");
    const [pseudo, setPseudo] = useState("")
    const [email, setEmail] = useState("")
    const [users, setUsers] = useState([]);
    const [editedUsers, setEditedUsers] = useState({});
    const [hotels, setHotels] = useState([]);
    const [editedHotels, setEditedHotels] = useState({});
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [hotelForm, setHotelForm] = useState({
        name: "",
        location: "",
        price: 0,
        description: "",
        rating: 3,
        picture: "",
        amenities: [],
        capacity: 1,
    })

    const handleSearchUsers = (e) => {
        e.preventDefault()
        console.log("Searching users with:", {pseudo, email})
        axios.get(`${apiUrl}/users/search`, {params: {pseudo, email}})
            .then((response) => {
                if (response.data.redirect) {
                    navigate(response.data.redirect);
                }
                setUsers(response.data)
            })
            .catch((error) => {
                console.error(error);
                setErrorMessage("Erreur lors de la recherche des utilisateurs.");
            });
    }

    const handleSearchHotels = (e) => {
        e.preventDefault()
        console.log("Searching hotels with:", {name: pseudo})
        axios.get(`${apiUrl}/hotels/search`, {params: {name: pseudo}})
            .then((response) => {
                setHotels(response.data)
            })
            .catch((error) => {
                console.error(error);
                console.log("error.response.status", error.response.status)
                setErrorMessage("Erreur lors de la recherche des hôtels.");
            });
    }

    const handleRoleChange = (userId, role) => {
        setEditedUsers(prev => ({...prev, [userId]: {...prev[userId], role}}));
    }

    const handleFieldChange = (userId, field, value) => {
        setEditedUsers(prev => ({...prev, [userId]: {...prev[userId], [field]: value}}));
    }

    const handleHotelFieldChange = (hotelId, field, value) => {
        setEditedHotels(prev => ({...prev, [hotelId]: {...prev[hotelId], [field]: value}}));
    }

    const handleDeleteUser = (userId) => {
        console.log("Deleting user:", userId)
        axios.delete(`${apiUrl}/users/${userId}`, {headers: {Authorization: `Bearer ${token}`}})
            .then(() => {
                setUsers(users.filter(user => user.id !== userId))
                setSuccessMessage("Utilisateur supprimé avec succès.");
                setTimeout(() => setSuccessMessage(""), 3000);
            })
            .catch((error) => {
                console.error(error);
                setErrorMessage("Erreur lors de la suppression de l'utilisateur.");
            });
    }

    const handleDeleteHotel = (hotelId) => {
        console.log("Deleting hotel:", hotelId)
        axios.delete(`${apiUrl}/hotels/${hotelId}`, {headers: {Authorization: `Bearer ${token}`}})
            .then(() => {
                setHotels(hotels.filter(hotel => hotel.id !== hotelId))
                setSuccessMessage("Hôtel supprimé avec succès.");
                setTimeout(() => setSuccessMessage(""), 3000);
            })
            .catch((error) => {
                console.error(error);
                setErrorMessage("Erreur lors de la suppression de l'hôtel.");
            });
    }

    const saveUserChanges = (userId) => {
        const updatedUser = editedUsers[userId];
        if (updatedUser) {
            axios.put(`${apiUrl}/users/${userId}`, updatedUser, {headers: {Authorization: `Bearer ${token}`}})
                .then(() => {
                    setUsers(users.map(user => user.id === userId ? {...user, ...updatedUser} : user));
                    setEditedUsers(prev => {
                        const {[userId]: _, ...rest} = prev;
                        return rest;
                    });
                    setSuccessMessage("Utilisateur mis à jour avec succès.");
                    setTimeout(() => setSuccessMessage(""), 3000);
                })
                .catch((error) => {
                    console.error(error);
                    setErrorMessage("Erreur lors de la mise à jour de l'utilisateur.");
                });
        }
    }

    const saveHotelChanges = (hotelId) => {
        const updatedHotel = editedHotels[hotelId];
        if (updatedHotel) {
            axios.put(`${apiUrl}/hotels/${hotelId}`, updatedHotel, {headers: {Authorization: `Bearer ${token}`}})
                .then(() => {
                    setHotels(hotels.map(hotel => hotel.id === hotelId ? {...hotel, ...updatedHotel} : hotel));
                    setEditedHotels(prev => {
                        const {[hotelId]: _, ...rest} = prev;
                        return rest;
                    });
                    setSuccessMessage("Hôtel mis à jour avec succès.");
                    setTimeout(() => setSuccessMessage(""), 3000);
                })
                .catch((error) => {
                    console.error(error);
                    setErrorMessage("Erreur lors de la mise à jour de l'hôtel.");
                });
        }
    }

    const createHotel = (hotel) => {
        setErrorMessage("");
        axios.post(`${apiUrl}/hotels/create`, hotel, {headers: {Authorization: `Bearer ${token}`}})
            .then(() => {
                setHotels([...hotels, hotel]);
                setHotelForm({
                    name: "",
                    location: "",
                    description: "",
                    price: 0,
                    rating: 3,
                    picture: "",
                    amenities: []
                });
                setSuccessMessage("Hôtel ajouté avec succès.");
                setTimeout(() => setSuccessMessage(""), 3000);
            })
            .catch((error) => {
                if (error.response.data.error) {
                    setErrorMessage(error.response.data.error);
                }
            });
    }

    useEffect(() => {
        if (activeTab === "users") {
            axios.get(`${apiUrl}/users/search`, {headers: {Authorization: `Bearer ${token}`}})
                .then((response) => {
                    setUsers(response.data)
                })
                .catch((error) => {
                    if (error.response.status === 401) {
                        navigate("/login");
                    }
                    console.error(error);
                    setErrorMessage("Erreur lors du chargement des utilisateurs.");
                });
        } else if (activeTab === "hotels") {
            axios.get(`${apiUrl}/hotels/search`, {headers: {Authorization: `Bearer ${token}`}})
                .then((response) => {
                    setHotels(response.data)
                })
                .catch((error) => {
                    console.error(error);
                    setErrorMessage("Erreur lors du chargement des hôtels.");
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
                                className={`px-4 py-2 rounded-md ${activeTab === "users" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700"}`}
                            >
                                Utilisateurs
                            </button>
                            <button
                                onClick={() => setActiveTab("hotels")}
                                className={`px-4 py-2 rounded-md ${activeTab === "hotels" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700"}`}
                            >
                                Hôtels
                            </button>
                        </div>
                        <button
                            onClick={() => setActiveTab("add-hotel")}
                            className={`px-4 py-2 rounded-md ${activeTab === "add-hotel" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700"}`}
                        >
                            Ajouter un hôtel
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {activeTab === "users" && (
                        <div className="lg:w-full">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Résultats de recherche</h2>
                                {currentRole !== 'administrator' && (
                                    <p className="text-sm text-gray-500">
                                        Seuls les administrateurs ont le droit de modifier les informations.
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
                                    <form onSubmit={handleSearchUsers}
                                          className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="relative">
                                            <label htmlFor="pseudo" className="sr-only">
                                                Pseudo
                                            </label>
                                            <div
                                                className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <UsersIcon className="h-5 w-5 text-gray-400" aria-hidden="true"/>
                                            </div>
                                            <input
                                                id="pseudo"
                                                name="pseudo"
                                                type="text"
                                                required
                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                placeholder="Pseudo"
                                                value={pseudo}
                                                onChange={(e) => setPseudo(e.target.value)}
                                            />
                                        </div>

                                        <div className="relative">
                                            <label htmlFor="email" className="sr-only">
                                                Email
                                            </label>
                                            <div
                                                className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="h-5 w-5 text-gray-400" fill="currentColor"
                                                     viewBox="0 0 20 20">
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </div>
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                required
                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                placeholder="Email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
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
                                {users.map((user) => (
                                    <div key={user.id} className="bg-white shadow rounded-lg overflow-hidden">
                                        <div className="p-6">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <input
                                                        type="text"
                                                        className={`text-lg font-medium text-gray-900 ${currentRole === 'employee' ? 'bg-gray-100' : ''} w-full border rounded-md px-3 py-2`}
                                                        value={editedUsers[user.id]?.pseudo ?? user.pseudo}
                                                        readOnly={currentRole === 'employee'}
                                                        onChange={(e) => handleFieldChange(user.id, 'pseudo', e.target.value)}
                                                    />
                                                    <input
                                                        type="email"
                                                        className={`text-sm text-gray-500 mt-1 ${currentRole === 'employee' ? 'bg-gray-100' : ''} w-full border rounded-md px-3 py-2`}
                                                        value={editedUsers[user.id]?.email ?? user.email}
                                                        readOnly={currentRole === 'employee'}
                                                        onChange={(e) => handleFieldChange(user.id, 'email', e.target.value)}
                                                    />
                                                </div>
                                                <div
                                                    className="flex items-center  px-2 py-1 rounded-full text-sm font-medium">
                                                    <select
                                                        value={editedUsers[user.id]?.role ?? user.role}
                                                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                        className={`${currentRole === 'employee' ? 'bg-gray-100' : ''} border rounded-md px-3 py-2`}
                                                        disabled={currentRole === 'employee'}
                                                    >
                                                        <option value="normal">Utilisateur</option>
                                                        <option value="employee">Employée</option>
                                                        <option value="administrator">Administrateur</option>
                                                    </select>
                                                </div>
                                            </div>
                                            {currentRole === 'administrator' && (
                                                <div className="mt-6 flex items-center justify-between">
                                                    <button
                                                        onClick={() => saveUserChanges(user.id)}
                                                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                    >
                                                        Enregistrer
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteUser(user.id)}
                                                        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                    >
                                                        Supprimer
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {activeTab === "hotels" && (
                        <div className="lg:w-full">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Résultats de recherche</h2>
                                {currentRole !== 'administrator' && (
                                    <p className="text-sm text-gray-500">
                                        Seuls les administrateurs ont le droit de modifier les informations.
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
                                    <form onSubmit={handleSearchHotels}
                                          className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="relative">
                                            <label htmlFor="hotelName" className="sr-only">
                                                Nom de l'hôtel
                                            </label>
                                            <div
                                                className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <HotelIcon className="h-5 w-5 text-gray-400" aria-hidden="true"/>
                                            </div>
                                            <input
                                                id="hotelName"
                                                name="hotelName"
                                                type="text"
                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                placeholder="Nom de l'hôtel"
                                                value={pseudo}
                                                onChange={(e) => setPseudo(e.target.value)}
                                            />
                                        </div>

                                        <div className="relative">
                                            <label htmlFor="hotelLocation" className="sr-only">
                                                Localisation
                                            </label>
                                            <div
                                                className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <MapPinIcon className="h-5 w-5 text-gray-400" aria-hidden="true"/>
                                            </div>
                                            <input
                                                id="hotelLocation"
                                                name="hotelLocation"
                                                type="text"
                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                placeholder="Localisation"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
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
                                {hotels.map((hotel) => (
                                    <div key={hotel.id} className="bg-white shadow rounded-lg overflow-hidden">
                                        <div className="p-6">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <input
                                                        type="text"
                                                        className={`text-lg font-medium text-gray-900 ${currentRole === 'employee' ? 'bg-gray-100' : ''} w-full border rounded-md px-3 py-2`}
                                                        value={editedHotels[hotel.id]?.name ?? hotel.name}
                                                        readOnly={currentRole === 'employee'}
                                                        onChange={(e) => handleHotelFieldChange(hotel.id, 'name', e.target.value)}
                                                    />
                                                    <input
                                                        type="text"
                                                        className={`text-sm text-gray-500 mt-1 ${currentRole === 'employee' ? 'bg-gray-100' : ''} w-full border rounded-md px-3 py-2`}
                                                        value={editedHotels[hotel.id]?.location ?? hotel.location}
                                                        readOnly={currentRole === 'employee'}
                                                        onChange={(e) => handleHotelFieldChange(hotel.id, 'location', e.target.value)}
                                                    />
                                                </div>
                                                <div
                                                    className="flex items-center  px-2 py-1 rounded-full text-sm font-medium">
                                                    <select
                                                        value={editedHotels[hotel.id]?.rating ?? hotel.rating}
                                                        onChange={(e) => handleHotelFieldChange(hotel.id, 'rating', e.target.value)}
                                                        className={`${currentRole === 'employee' ? 'bg-gray-100' : ''} border rounded-md px-3 py-2`}
                                                        disabled={currentRole === 'employee'}
                                                    >
                                                        <option value="1">1 Étoile</option>
                                                        <option value="2">2 Étoiles</option>
                                                        <option value="3">3 Étoiles</option>
                                                        <option value="4">4 Étoiles</option>
                                                        <option value="5">5 Étoiles</option>
                                                    </select>
                                                </div>
                                            </div>
                                            {currentRole === 'administrator' && (
                                                <div className="mt-6 flex items-center justify-between">
                                                    <button
                                                        onClick={() => saveHotelChanges(hotel.id)}
                                                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                    >
                                                        Enregistrer
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteHotel(hotel.id)}
                                                        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                    >
                                                        Supprimer
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {activeTab === "add-hotel" && (
                        <div className="lg:w-full">
                            <div className="flex items-center justify-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Ajouter un hôtel</h2>
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
                                        createHotel(hotelForm);
                                    }}
                                          className=" grid grid-cols-1 gap-4 max-w-lg mx-auto">
                                        <div className="relative">
                                            <label htmlFor="hotelName" className="sr-only">
                                                Nom de l'hôtel
                                            </label>
                                            <div
                                                className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <HotelIcon className="h-5 w-5 text-gray-400" aria-hidden="true"/>
                                            </div>
                                            <input
                                                id="hotelName"
                                                name="hotelName"
                                                type="text"
                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                placeholder="Nom de l'hôtel"
                                                value={hotelForm.name}
                                                onChange={(e) => setHotelForm({...hotelForm, name: e.target.value})}
                                            />
                                        </div>

                                        <div className="relative">
                                            <label htmlFor="hotelLocation" className="sr-only">
                                                Localisation
                                            </label>
                                            <div
                                                className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <MapPinIcon className="h-5 w-5 text-gray-400" aria-hidden="true"/>
                                            </div>
                                            <input
                                                id="hotelLocation"
                                                name="hotelLocation"
                                                type="text"
                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                placeholder="Localisation"
                                                value={hotelForm.location}
                                                onChange={(e) => setHotelForm({...hotelForm, location: e.target.value})}
                                            />
                                        </div>
                                        <div className="relative">
                                            <label htmlFor="hotelPrice" className="sr-only">
                                                Prix
                                            </label>
                                            <div
                                                className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <EuroIcon className="h-5 w-5 text-gray-400" aria-hidden="true"/>
                                            </div>
                                            <input
                                                id="hotelPrice"
                                                name="hotelPrice"
                                                type="number"
                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                placeholder="Prix"
                                                value={hotelForm.price}
                                                onChange={(e) => setHotelForm({...hotelForm, price: e.target.value})}
                                            />
                                        </div>
                                        <div className="relative">
                                            <label htmlFor="hotelDescription" className="sr-only">
                                                Description
                                            </label>
                                            <div
                                                className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FileTextIcon className="h-5 w-5 text-gray-400" aria-hidden="true"/>
                                            </div>
                                            <input
                                                id="hotelDescription"
                                                name="hotelDescription"
                                                type="text"
                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                placeholder="Description"
                                                value={hotelForm.description}
                                                onChange={(e) => setHotelForm({
                                                    ...hotelForm,
                                                    description: e.target.value
                                                })}
                                            />
                                        </div>
                                        <div className="relative">
                                            <label htmlFor="hotelRating" className="sr-only">
                                                Note
                                            </label>
                                            <div
                                                className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <StarIcon className="h-5 w-5 text-gray-400" aria-hidden="true"/>
                                            </div>
                                            <input
                                                id="hotelRating"
                                                name="hotelRating"
                                                type="number" min="1" max="5"
                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                placeholder="Note"
                                                value={hotelForm.rating}
                                                onChange={(e) => setHotelForm({...hotelForm, rating: e.target.value})}
                                            />
                                        </div>
                                        <div className="relative">
                                            <label htmlFor="hotelPicture" className="sr-only">
                                                Image
                                            </label>
                                            <div
                                                className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <ImageIcon className="h-5 w-5 text-gray-400" aria-hidden="true"/>
                                            </div>
                                            <input
                                                id="hotelPicture"
                                                name="hotelPicture"
                                                type="text"
                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                placeholder="Image"
                                                value={hotelForm.picture}
                                                onChange={(e) => setHotelForm({...hotelForm, picture: e.target.value})}
                                            />
                                        </div>
                                        <div className="relative">
                                            <label htmlFor="hotelAmenities" className="sr-only">
                                                Équipements
                                            </label>
                                            <div
                                                className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <SettingsIcon className="h-5 w-5 text-gray-400" aria-hidden="true"/>
                                            </div>
                                            <select
                                                id="hotelAmenities"
                                                name="hotelAmenities"
                                                multiple
                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                value={hotelForm.amenities}
                                                onChange={(e) => {
                                                    const options = Array.from(e.target.selectedOptions, option => option.value);
                                                    setHotelForm({...hotelForm, amenities: options});
                                                }}
                                            >
                                                <option value="wifi">Wifi</option>
                                                <option value="parking">Parking</option>
                                                <option value="pet-friendly">Animaux acceptés</option>
                                                <option value="pool">Piscine</option>
                                            </select>
                                        </div>
                                        <div className="relative">
                                            <label htmlFor="hotelCapacity" className="sr-only">
                                                Capacité
                                            </label>
                                            <div
                                                className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <PersonStandingIcon className="h-5 w-5 text-gray-400" aria-hidden="true"/>
                                            </div>
                                            <input
                                                id="hotelCapacity"
                                                name="hotelCapacity"
                                                type="number"
                                                min="1"
                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                placeholder="Capacité"
                                                value={hotelForm.capacity}
                                                onChange={(e) => setHotelForm({...hotelForm, capacity: e.target.value})}
                                            />

                                        </div>
                                        <div>
                                            <button
                                                type="submit"
                                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
            </main>
        </div>
    )
}
