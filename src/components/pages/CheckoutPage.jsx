import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUserData } from "../../../utils/userFunctions";
import {
    clearCart,
    fetchAndMergeCartItems,
    emptyCartItems
} from "../../../store/slices/cartSlice";
import axios from "axios";
import conf from "../../../conf/conf";
import AlertMessage from "../AlertMessage";

export default function CheckoutPage() {
    const cart = useSelector((state) => state.cart.cartList);
    const isUser = useSelector((state) => state.auth.token);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [totalAmount, setTotalAmount] = useState(0);
    const [alert, setAlert] = useState(null);
    const [loading, setLoading] = useState(false); // Spinner state

    useEffect(() => {
        if (isUser) {
            dispatch(fetchAndMergeCartItems(cart));
        }
    }, [isUser, dispatch]);

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            try {
                const response = await getUserData();
                if (response.userData) {
                    setUser(response.userData);

                    if (response.userData.addresses && response.userData.addresses.length > 0) {
                        setSelectedAddress(response.userData.addresses[0]);
                    }
                } else {
                    navigate("/login");
                }
            } catch (error) {
                setAlert({
                    type: "danger",
                    message: "Error fetching user data. Please log in again.",
                });
                navigate("/login");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();

        const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
        setTotalAmount(total);
    }, [cart, navigate]);

    const handleAddressChange = (event) => {
        const selectedLocation = event.target.value;
        const address = user.addresses.find((addr) => addr.location === selectedLocation);
        if (address) {
            setSelectedAddress(address);
        } else {
            setAlert({
                type: "danger",
                message: "Invalid address selection.",
            });
        }
    };

    const handlePlaceOrder = async () => {
        if (!selectedAddress) {
            setAlert({
                type: "danger",
                message: "Please select a delivery address.",
            });
            return;
        }

        setLoading(true);
        try {
            const orderData = {
                items: cart.map((item) => ({
                    productId: item.product._id,
                    quantity: item.quantity,
                })),
                address: {
                    location: selectedAddress.location,
                    geometry: selectedAddress.geometry,
                },
                userId: user._id,
            };

            const response = await axios.post(`${conf.baseUrl}/orders`, orderData, {
                withCredentials: true,
            });

            if (response.status === 200) {
                dispatch(emptyCartItems());
                setTotalAmount(0);
                setAlert({
                    type: "success",
                    message: "Order placed successfully!",
                });

                setTimeout(() => {
                    navigate("/orders");
                }, 2000);
            }
        } catch (error) {
            console.log(error)
            setAlert({
                type: "danger",
                message: "Failed to place the order. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container my-4">
            <h3 className="text-dark">Checkout</h3>

            {/* Alert Message */}
            {alert && (
                <AlertMessage
                    alertType={alert.type}
                    message={alert.message}
                    setValue={setAlert}
                />
            )}

            {/* Loading Spinner */}
            {loading && (
                <div className="text-center my-3">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}

            {/* Address Selection */}
            {!loading && user && user.addresses && user.addresses.length > 0 ? (
                <div className="mb-4">
                    <h5>Select Delivery Address</h5>
                    <select
                        className="form-select"
                        value={selectedAddress?.location || ""}
                        onChange={handleAddressChange}
                    >
                        <option value="" disabled>Select an address</option>
                        {user.addresses.map((address, index) => (
                            <option key={index} value={address.location}>
                                {address.location}
                            </option>
                        ))}
                    </select>
                </div>
            ) : (
                !loading && (
                    <p className="text-muted">
                        No addresses found. Please add an address in your profile.
                    </p>
                )
            )}

            {/* Cart Items and Total Amount */}
            <div className="mb-4">
                <h5>Order Summary</h5>
                {!loading && cart.length > 0 ? (
                    <>
                        <ul className="list-group mb-3">
                            {cart.map((item) => (
                                <li
                                    key={item.product._id}
                                    className="list-group-item d-flex justify-content-between"
                                >
                                    <div>
                                        <strong>{item.product.name}</strong>
                                        <br />
                                        Quantity: {item.quantity}
                                    </div>
                                    <span>₹{item.product.price * item.quantity}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="text-end">
                            <h6>Total: ₹{totalAmount}</h6>
                        </div>
                    </>
                ) : (
                    !loading && <p className="text-muted">Your cart is empty.</p>
                )}
            </div>

            {/* Place Order Button */}
            <button
                className="btn btn-success"
                style={{ width: "100%" }}
                onClick={handlePlaceOrder}
                disabled={loading || cart.length === 0 || !selectedAddress}
            >
                Place Order
            </button>
        </div>
    );
}
