import axios from "axios";
import conf from "../conf/conf.js";

export async function loginUser({ username, password }) {
    try {
        const response = await axios.post(`${conf.baseUrl}/login`,
            { username, password },
            { withCredentials: true } // Ensures cookies are sent and received
        );
        return {
            token: response.data.token,
            message: response.data.message,
            status: response.status
        };
    } catch (error) {
        return {
            message: error.response ? error.response.data.message : error.message,
            status: error.response ? error.response.status : 500
        };
    }
}


export async function signUpUser({ username, email, password, isSeller, cart = [] }) {
    try {
        const response = await axios.post(`${conf.baseUrl}/signup`, { username, password, email, isSeller, cart }, { withCredentials: true });

        return {
            token: response.data.token,
            message: response.data.message,
            status: response.status
        };
    } catch (error) {
        return {
            message: error.response ? error.response.data.message : error.message,
            status: error.response ? error.response.status : 500
        };
    }
}

export async function getUserData() {
    try {
        const response = await axios.get(`${conf.baseUrl}/user`, {
            withCredentials: true // Ensures cookies are sent
        });

        return { userData: response.data, status: response.status }

    } catch (error) {
        // console.log(error)
        return {

            message: error.response ? error.response.data.message : error.message,
            status: error.response ? error.response.status : 500
        };
    }
}

export async function getUserCartData() {
    try {
        const response = await axios.get(`${conf.baseUrl}/user/cart`, { withCredentials: true });

        return { cart: response.data.cart, status: response.status }

    } catch (error) {
        // console.log(error)
        return {
            message: error.response ? error.response.data.message : error.message,
            status: error.response ? error.response.status : 500
        };
    }
}


