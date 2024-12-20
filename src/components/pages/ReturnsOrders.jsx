import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import conf from "../../../conf/conf";
import AlertMessage from "../AlertMessage";

const ReturnsOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = useSelector((state) => state.auth.token);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`${conf.baseUrl}/orders`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                });
                setOrders(response.data.orders || []);
            } catch (err) {
                const errorMessage = err.response?.data?.message || "Failed to fetch orders.";
                setError(errorMessage);

                // Redirect to login if unauthorized
                if (err.response?.status === 401) {
                    navigate("/login");
                }
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchOrders();
        } else {
            setError("You need to log in to view your orders.");
            navigate("/login");
        }
    }, [token, navigate]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-warning" role="status" style={{ width: "4rem", height: "4rem" }}>
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container my-4">
            {error && (
                <AlertMessage
                    alertType="danger"
                    message={error}
                    setValue={setError}
                />
            )}
            <h2 className="text-center mb-4">Your Orders</h2>
            {orders.length === 0 ? (
                <p className="text-center text-muted">You haven't placed any orders yet.</p>
            ) : (
                <div className="row">
                    {orders.map((order) => (
                        <div key={order._id} className="col-md-6 col-lg-4 mb-4">
                            <div className="card h-100 shadow-sm">
                                <img
                                    src={order?.image?.url || "https://via.placeholder.com/300"}
                                    className="card-img-top"
                                    alt={order.product?.name || "Product Image"}
                                    style={{ height: "200px", objectFit: "cover" }}
                                />
                                <div className="card-body">
                                    <h5 className="card-title text-primary">{order.name}</h5>
                                    <p className="card-text">
                                        <strong>Status:</strong>{" "}
                                        <span className={`badge ${getBadgeClass(order.orderStatus)}`}>
                                            {order.orderStatus}
                                        </span>
                                    </p>
                                    <button
                                        className="btn btn-link text-decoration-none p-0"
                                        onClick={() => navigate(`/orders/${order._id}`)}
                                    >
                                        View Order Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const getBadgeClass = (status) => {
    switch (status) {
        case "Delivered":
            return "bg-success";
        case "Returned":
            return "bg-info";
        case "Processing":
            return "bg-warning";
        default:
            return "bg-secondary";
    }
};

export default ReturnsOrders;
