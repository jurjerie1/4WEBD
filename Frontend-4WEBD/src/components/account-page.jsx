import {useEffect, useState} from 'react';
import {useAuth} from '../hooks/useAuth.js';
import {useNavigate} from "react-router-dom";
import AccountReservationInfo from "./account-reservationInfo.jsx";
import AccountUserInfo from "./account-userInfo.jsx";

export default function AccountPage() {
    const {user} = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("reservations");

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 pb-12">
            {/* Tabs */}
            <div className="bg-white shadow-md py-6 mb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex space-x-4">
                        <button
                            onClick={() => setActiveTab("reservations")}
                            className={`px-4 py-2 rounded-md ${activeTab === "reservations" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700"}`}
                        >
                            Mes réservations
                        </button>
                        <button
                            onClick={() => setActiveTab("informations")}
                            className={`px-4 py-2 rounded-md ${activeTab === "informations" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700"}`}
                        >
                            Mes informations
                        </button>
                    </div>
                </div>
            </div>


            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {activeTab === "reservations" && (
                    <AccountReservationInfo/>
                )}
                {activeTab === "informations" && (
                    <AccountUserInfo/>
                )}

            </main>
        </div>
    );
};
