import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

export default function ConfirmEmail() {
    const [confirmSuccessMessage, setConfirmSuccessMessage] = useState(null);
    const [errors, setErrors] = useState(null);  // Ajout de l'état errors
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const url = `${apiUrl}/AuthentificationService/Authentifications/confirmEmail?${queryParams}`;


        axios.get(url)
            .then(() => {
                setConfirmSuccessMessage("Votre compte a été confirmé avec succès.");
            })
            .catch((error) => {
                console.error(error);
                setErrors("Une erreur est survenue lors de la confirmation de votre compte.");
            });
    }, [location.search]);  // Ajouter location.search comme dépendance

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
                {confirmSuccessMessage && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                        <strong className="font-bold">Bravo! </strong>
                        <span className="block sm:inline">{confirmSuccessMessage}</span>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Vous pouvez maintenant vous connecter{" "}
                            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                                ici
                            </Link>.
                        </p>
                    </div>
                )}
                {errors && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <strong className="font-bold">Erreur! </strong>
                        <span className="block sm:inline">{errors}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
