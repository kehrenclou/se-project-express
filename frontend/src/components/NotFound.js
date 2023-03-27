import React from "react";
import { Redirect } from "react-router-dom";
import { useAuth } from "../hooks";

export const NotFound = () => {
    const { isLoggedIn } = useAuth();

    return isLoggedIn ? <Redirect to="/" /> : <Redirect to="/signin" />
}