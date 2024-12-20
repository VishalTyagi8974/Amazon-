import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import conf from "../../../conf/conf";
import AlertMessage from "../AlertMessage"; // Adjust path as needed

const Order = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null); // Alert state for error messages
    const [isSeller, setIsSeller] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await axios.get(`${conf.baseUrl}/orders/${orderId}`, {
                    withCredentials: true,
                });
                setOrder(response.data.order);
                setIsSeller(response.data.isSeller);
            } catch (err) {
                if (err.response?.status === 401) {
                    setAlert({
                        type: "warning",
                        message: "You need to log in to view this order.",
                    });
                    setTimeout(() => navigate("/login"), 2000); // Redirect to login after 2 seconds
                } else {
                    setAlert({
                        type: "danger",
                        message: err.response?.data?.message || "Failed to fetch order details.",
                    });
                }
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId, navigate]);

    const handleAction = async (action) => {
        try {
            const response = await axios.patch(
                `${conf.baseUrl}/orders/${orderId}/${action}`,
                {},
                { withCredentials: true }
            );
            setOrder(response.data.order); // Update order state after action
            setAlert({
                type: "success",
                message: `Order successfully updated: ${action.replace(/-/g, " ")}.`,
            });
        } catch (err) {
            setAlert({
                type: "danger",
                message: err.response?.data?.message || `Failed to ${action.replace(/-/g, " ")}.`,
            });
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-warning" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container my-4">
            <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
                Back
            </button>

            {/* Alert Message */}
            {alert && (
                <AlertMessage
                    alertType={alert.type}
                    message={alert.message}
                    setValue={setAlert}
                />
            )}

            {order ? (
                <div className="card shadow-sm">
                    <img
                        src={order?.image?.url || "https://via.placeholder.com/400"}
                        alt={order?.name || "Product"}
                        className="card-img-top"
                        style={{ height: "300px", objectFit: "cover" }}
                    />
                    <div className="card-body">
                        <h3 className="card-title">{order.name || "Product Name"}</h3>
                        <p>
                            <strong>Status:</strong> {order.orderStatus || "Unknown"}
                        </p>
                        <p>
                            <strong>Quantity:</strong> {order.quantity || 0}
                        </p>
                        <p>
                            <strong>Price:</strong> ₹{order.price?.toFixed(2) || "0.00"}
                        </p>
                        <p>
                            <strong>Estimated Delivery:</strong>{" "}
                            {order.estimatedDeliveryDate || "Not available"}
                        </p>
                        <p>
                            <strong>Delivery Address:</strong>{" "}
                            {order.deliveryAddress?.location || "Not provided"}
                        </p>

                        {/* Conditional Buttons */}
                        <div className="mt-4">
                            {/* Cancel Order - Accessible to both Buyer and Seller if status is Pending */}
                            {order.orderStatus === "Pending" && (
                                <button
                                    className="btn btn-danger me-2"
                                    onClick={() => handleAction("cancel")}
                                >
                                    Cancel Order
                                </button>
                            )}

                            {/* Mark as Shipped - Seller Only */}
                            {isSeller && order.orderStatus === "Pending" && (
                                <button
                                    className="btn btn-warning me-2"
                                    onClick={() => handleAction("ship")}
                                >
                                    Mark as Shipped
                                </button>
                            )}

                            {/* Mark as Delivered - Buyer Only, when Shipped */}
                            {!isSeller && order.orderStatus === "Shipped" && (
                                <button
                                    className="btn btn-success me-2"
                                    onClick={() => handleAction("deliver")}
                                >
                                    Mark as Delivered
                                </button>
                            )}

                            {/* Return Order - Buyer Only */}
                            {!isSeller && order.orderStatus === "Delivered" && (
                                <button
                                    className="btn btn-info me-2"
                                    onClick={() => handleAction("return")}
                                >
                                    Return Order
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <p className="text-danger">Order not found.</p>
            )}
        </div>
    );
};

export default Order;
