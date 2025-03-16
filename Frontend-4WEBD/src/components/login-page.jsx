"use client";
import {useState} from "react";
import {Link} from "react-router-dom";
import {LockIcon, MailIcon} from "lucide-react";
import axios from "axios";
import {useAuth} from "../hooks/useAuth.js";
import {useNavigate} from "react-router-dom";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [errors, setErrors] = useState(null);
    const {login} = useAuth();
    const apiUrl = import.meta.env.VITE_API_URL;

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors(null); // Réinitialiser les erreurs avant de soumettre le formulaire

        axios.post(`${apiUrl}/users/login`, {email, password, rememberMe})
            .then((response) => {
                const {user, token} = response.data;
                login(user, token);
                // Redirection vers la page d'accueil
                navigate("/");
            })
            .catch((error) => {
                console.error("Login error:", error);
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
                    <h2 className="text-center text-3xl font-extrabold text-gray-900">Connexion à Akkor Hotel</h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Ou{" "}
                        <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                            créez un compte
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
                        <div>
                            <label htmlFor="email-address" className="sr-only">
                                Adresse email
                            </label>
                            <div className="relative">
                                <div
                                    className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
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
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Mot de passe
                            </label>
                            <div className="relative">
                                <div
                                    className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                                    <LockIcon className="h-5 w-5 text-gray-400" aria-hidden="true"/>
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="appearance-none rounded-md relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="Mot de passe"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                Se souvenir de moi
                            </label>
                        </div>

                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300"
                        >
                            Se connecter
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
