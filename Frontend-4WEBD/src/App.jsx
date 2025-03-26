import {useEffect, useState} from 'react'
import './App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Header from "./components/header.jsx";
import LoginPage from "./components/login-page.jsx";
import RegisterPage from "./components/register-page.jsx";
import SearchPage from "./components/search-page.jsx";
import AccountPage from "./components/account-page.jsx";
import BookingTicketPage from "./components/booking-ticket-page.jsx";
import ConfirmEmail from "./components/confirm-email.jsx";
import AdminPage from "./components/admin-page.jsx";
import {useAuth} from "./hooks/useAuth.js";

function App() {
    const {token, logout} = useAuth();


    useEffect(() => {
        const checkTokenExpiration = () => {
            if (token) {
                const tokenExpiration = JSON.parse(atob(token.split('.')[1])).exp * 1000;
                if (Date.now() >= tokenExpiration) {
                    logout();
                }
            }
        };

        checkTokenExpiration();
    }, [token, logout]);

    return (
        <>
            <BrowserRouter>
            <Header/>
            <Routes>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/register" element={<RegisterPage/>}/>
                <Route path="/" element={<SearchPage/>}/>
                <Route path="/account" element={<AccountPage/>}/>
                <Route path="/booking/:id" element={<BookingTicketPage/>}/>
                <Route path="/confirm-email" element={<ConfirmEmail/>}/>
                <Route path="/admin" element={<AdminPage/>}/>

            </Routes>
            </BrowserRouter>
        </>
    )
}

export default App
