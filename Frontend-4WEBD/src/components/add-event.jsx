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
export default function AddEvent() {

    const {token} = useAuth();
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
    const formatDate = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
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

    return(
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
    )
}