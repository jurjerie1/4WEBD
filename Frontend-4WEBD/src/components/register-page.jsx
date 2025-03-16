import {useState} from "react";
import {Link} from "react-router-dom";
import {LockIcon, MailIcon, UserIcon} from "lucide-react";
import axios from "axios";
import {useAuth} from "../hooks/useAuth.js";
import {useNavigate} from "react-router-dom";

export default function RegisterPage() {
    const {login} = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        pseudo: "",
        password: "",
        confirmPassword: "",
        role: "normal",
        terms: false,
    });
    const [errors, setErrors] = useState(null);
    const apiUrl = import.meta.env.VITE_API_URL;

    const handleChange = (e) => {
        const {name, value, type, checked} = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors(null);

        const {confirmPassword, terms, ...dataToSend} = formData;

        if (formData.password !== formData.confirmPassword) {
            setErrors("Les mots de passe ne correspondent pas.");
            return;
        }

        axios
            .post(`${apiUrl}/users/register`, dataToSend)
            .then((response) => {
                const {user, token} = response.data;
                login(user, token);
                // Redirection vers la page d'accuei
                navigate("/");

            })
            .catch((error) => {
                console.error(error);
                if (error.response) {
                    setErrors(error.response.data.error || "Une erreur est survenue.");
                } else {
                    setErrors("Une erreur est survenue. Veuillez réessayer.");
                }
            });
    };

    return (
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
                    <div className="rounded-md shadow-sm space-y-4">
                        <div className="relative">
                            <label htmlFor="pseudo" className="sr-only">
                                Pseudo
                            </label>
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                                <UserIcon className="h-5 w-5 text-gray-400" aria-hidden="true"/>
                            </div>
                            <input
                                id="pseudo"
                                name="pseudo"
                                type="text"
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Pseudo"
                                value={formData.pseudo}
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
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300"
                            disabled={!formData.terms}
                        >
                            S'inscrire
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
