import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import conf from "../../../conf/conf";
import AlertMessage from "../AlertMessage";

const SoldProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null); // Alert state for messages
    const token = useSelector((state) => state.auth.token);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSoldProducts = async () => {
            try {
                const response = await axios.get(`${conf.baseUrl}/orders/soldProducts`, {
                    withCredentials: true,
                });
                setProducts(response.data.soldProducts || []);
            } catch (err) {
                setAlert({
                    type: "danger",
                    message: err.response?.data?.message || "Failed to fetch sold products.",
                });
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchSoldProducts();
        } else {
            setAlert({
                type: "warning",
                message: "You need to log in to view sold products.",
            });
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
            <h2 className="text-center mb-4">Sold Products</h2>

            {/* Alert Message */}
            {alert && (
                <AlertMessage
                    alertType={alert.type}
                    message={alert.message}
                    setValue={setAlert} // Pass a function to clear the alert
                />
            )}

            {/* Products Display */}
            {products.length === 0 ? (
                <p className="text-center text-muted">No products sold yet.</p>
            ) : (
                <div className="row">
                    {products.map((product) => (
                        <div key={product._id} className="col-md-6 col-lg-4 mb-4">
                            <div className="card h-100 shadow-sm">
                                <img
                                    src={product?.image?.url || "https://via.placeholder.com/300"}
                                    className="card-img-top"
                                    alt={product.name || "Product Image"}
                                    style={{ height: "200px", objectFit: "cover" }}
                                />
                                <div className="card-body">
                                    <h5 className="card-title text-primary">{product.name}</h5>
                                    <p className="card-text">
                                        <strong>Price:</strong> ₹{product.price}
                                    </p>
                                    <p className="card-text">
                                        <strong>Status:</strong>{" "}
                                        <span className={`badge ${getBadgeClass(product.orderStatus)}`}>
                                            {product.orderStatus}
                                        </span>
                                    </p>
                                    <p className="card-text">
                                        <strong>Delivery Address:</strong>
                                        <br />
                                        {product.deliveryAddress?.location || "Not available"}
                                    </p>
                                    <button
                                        className="btn btn-link text-decoration-none p-0"
                                        onClick={() => navigate(`/orders/${product._id}`)}
                                    >
                                        View Product Details
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

// Helper function for badge classes
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

export default SoldProducts;
