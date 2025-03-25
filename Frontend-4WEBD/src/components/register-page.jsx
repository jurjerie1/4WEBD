import {useState} from "react";
import {Link} from "react-router-dom";
import {LockIcon, MailIcon, UserIcon, CakeIcon, IdCardIcon} from "lucide-react";
import axios from "axios";
import {useAuth} from "../hooks/useAuth.js";

export default function RegisterPage() {
    const {login} = useAuth();
    const [successMessage, setSuccessMessage] = useState(null);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        dateOfBirth: "2000-01-01",
        email: "",
        userName: "",
        password: "",
        confirmPassword: ""
    });

    const [errors, setErrors] = useState(null);
    const apiUrl = import.meta.env.VITE_API_URL  || "http://localhost:5001/api"

    const handleChange = (e) => {
        const {name, value,} = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]:value,
        }));
    };




    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors(null);


        if (formData.password !== formData.confirmPassword) {
            setErrors("Les mots de passe ne correspondent pas.");
            return;
        }
        const {confirmPassword, ...dataToSend} = formData;
        console.log("url:", `${apiUrl}/AuthentificationService/Authentifications/register`);
        axios
            .post(`${apiUrl}/AuthentificationService/Authentifications/register`, dataToSend)
            .then((response) => {
                // Redirection vers la page d'accueil
                setSuccessMessage("Votre compte a été créé avec succès. Un email de confirmation vous a été envoyé.");
                window.history.pushState({}, null, window.location.href + "/success");

            })
            .catch((error) => {
                console.error(error);
                if (error.response && error.response.data.errors) {
                    const errorMessages = Object.values(error.response.data.errors).flat();
                    setErrors(errorMessages.join(' ') || "Une erreur est survenue.");
                } else {
                    setErrors("Une erreur est survenue. Veuillez réessayer.");
                }
            });
    };

    if (successMessage &&  window.location.href.includes("/success")) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
                         role="alert">
                        <strong className="font-bold">Bravo! </strong>
                        <span className="block sm:inline">{successMessage}</span>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Veuillez vérifier votre boîte de réception ou cliquer{" "}
                            <Link to="http://localhost:8025/"  target="_blank" className="font-medium text-indigo-600 hover:text-indigo-500">
                                ici
                            </Link>.
                        </p>
                    </div>

                </div>
            </div>
        )
    }
    else return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
                <div>
                    <h2 className="text-center text-3xl font-extrabold text-gray-900">Créer un compte</h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Ou{" "}
                        <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                            connectez-vous à votre compte
                        </Link>
                    </p>
                </div>
                {errors && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                         role="alert">
                        <strong className="font-bold">Erreur : </strong>
                        <span className="block sm:inline">{errors}</span>
                    </div>
                )}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md space-y-4">
                        <div className="relative">
                            <label htmlFor="firstName" className="sr-only">
                                Prénom
                            </label>
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                                <IdCardIcon className="h-5 w-5 text-gray-400" aria-hidden="true"/>
                            </div>
                            <input
                                id="firstName"
                                name="firstName"
                                type="text"
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Prénom"
                                value={formData.firstName}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="relative">
                            <label htmlFor="lastName" className="sr-only">
                                Nom
                            </label>
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                                <IdCardIcon className="h-5 w-5 text-gray-400" aria-hidden="true"/>
                            </div>
                            <input
                                id="lastName"
                                name="lastName"
                                type="text"
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Nom"
                                value={formData.lastName}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="relative">
                            <label htmlFor="dateOfBirth" className="sr-only">
                                Date de naissance
                            </label>
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                                <CakeIcon className="h-5 w-5 text-gray-400" aria-hidden="true"/>
                            </div>
                            <input
                                id="dateOfBirth"
                                name="dateOfBirth"
                                type="date"
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Date de naissance"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="relative">
                            <label htmlFor="pseudo" className="sr-only">
                                Pseudo
                            </label>
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                                <UserIcon className="h-5 w-5 text-gray-400" aria-hidden="true"/>
                            </div>
                            <input
                                id="pseudo"
                                name="userName"
                                type="text"
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Pseudo"
                                value={formData.userName}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="relative">
                            <label htmlFor="email-address" className="sr-only">
                                Adresse email
                            </label>
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                                <MailIcon className="h-5 w-5 text-gray-400" aria-hidden="true"/>
                            </div>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Adresse email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="relative">
                            <label htmlFor="password" className="sr-only">
                                Mot de passe
                            </label>
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                                <LockIcon className="h-5 w-5 text-gray-400" aria-hidden="true"/>
                            </div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Mot de passe"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="relative">
                            <label htmlFor="confirm-password" className="sr-only">
                                Confirmer le mot de passe
                            </label>
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                                <LockIcon className="h-5 w-5 text-gray-400" aria-hidden="true"/>
                            </div>
                            <input
                                id="confirm-password"
                                name="confirmPassword"
                                type="password"
                                autoComplete="new-password"
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Confirmer le mot de passe"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                        </div>
                    </div>


                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300 cursor-pointer"
                        >
                            S'inscrire
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
