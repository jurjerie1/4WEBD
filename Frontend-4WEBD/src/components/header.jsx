import {useAuth} from "../hooks/useAuth.js";
import {LogOutIcon} from "lucide-react";
import {useNavigate} from "react-router-dom";

export default function Header() {
    const {user, logout} = useAuth();
    const navigate = useNavigate();
    const logOut = () => {
        // Call the logout function from the context
        logout();
        // Redirect to the home page
        navigate("/");
    }
    return (
        <header className="bg-white shadow">
            <div className="max-w-8xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900 cursor-pointer"
                    onClick={() => navigate("/")} >Booking</h1>
                <div className="flex items-center space-x-4">

                    {user ? (
                        <>
                            {(user.role === "admin") && (
                                <button className="text-gray-500 hover:text-gray-700 cursor-pointer"
                                        onClick={() => navigate("/admin")}>Administration</button>
                            )}
                            <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 cursor-pointer"
                                    onClick={() => navigate("/account")}>Mon
                                compte
                            </button>
                            <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 cursor-pointer" data-cy="logout-icon"
                                    onClick={logOut}>
                                <LogOutIcon className="w-6 h-6"/>
                            </button>
                        </>
                    ) : (
                        <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 cursor-pointer"
                                onClick={() => navigate("/login")}>Connexion</button>
                    )}
                </div>
            </div>
        </header>
    )
}