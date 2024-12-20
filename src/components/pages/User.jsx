import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { logout as storeLogout } from "../../../store/slices/authSlice";
import { getUserData } from "../../../utils/userFunctions";
import { useNavigate, Link } from "react-router-dom";
import "./UserPage.css";
import axios from "axios";
import conf from "../../../conf/conf";
import AlertMessage from "../AlertMessage";
import Spinner from "../Spinner"; // Importing Spinner for loading state
import { clearCart } from "../../../store/slices/cartSlice";

export default function User() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        getUserData()
            .then((response) => {
                if (response.userData) {
                    setUser(response.userData);
                    setLoading(false);
                } else {
                    navigate("/login");
                }
            })
            .catch(() => {
                setLoading(false);
                navigate("/login");
            });
    }, [navigate]);

    function logoutUser() {
        axios
            .post(`${conf.baseUrl}/logout`, {}, { withCredentials: true })
            .then(() => {
                dispatch(storeLogout());
                dispatch(clearCart());
                navigate("/");
            })
            .catch((err) => setError(err.message || "Unable to logout"));
    }

    return (
        <>
            {loading ? (
                <Spinner /> // Show spinner while data is being fetched
            ) : (
                <>
                    {error && <AlertMessage message={error} />}

                    <div className="container mt-5">
                        <div className="card shadow-lg p-4 mb-5 bg-white rounded">
                            <div className="card-body text-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="currentColor" className="bi bi-person-circle mb-3" viewBox="0 0 16 16">
                                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                                    <path
                                        fillRule="evenodd"
                                        d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
                                    />
                                </svg>
                                <h1 className="card-title text-primary">{user.username}</h1>
                                <h2 className="card-subtitle mb-3 text-muted">{user.email}</h2>
                                <h4 className="card-text mb-4">
                                    <span className={`badge ${user.isSeller ? "bg-success" : "bg-secondary"}`}>
                                        {user.isSeller ? "Seller" : "Customer"}
                                    </span>
                                </h4>

                                <div className="btn-group-vertical w-100" role="group">
                                    <Link to="/addAddress" className="mb-3">
                                        <button className="btn btn-warning btn-lg w-100 py-2 rounded-pill">
                                            <i className="bi bi-plus-lg"></i> Add Address
                                        </button>
                                    </Link>
                                    {user.isSeller && (
                                        <>
                                            <Link to="/products/addProduct" className="mb-3">
                                                <button className="btn btn-success btn-lg w-100 py-2 rounded-pill">
                                                    <i className="bi bi-plus-lg"></i> Add Product
                                                </button>
                                            </Link>
                                            <Link to="/orders/soldProducts">
                                                <button className="btn btn-primary btn-lg w-100 py-2 rounded-pill">
                                                    View Sold Products
                                                </button>
                                            </Link>
                                        </>
                                    )}
                                    <button className="btn btn-danger btn-lg  py-2 mt-3 rounded-pill" style={{ width: "230px" }} onClick={logoutUser} disabled={loading}>
                                        <i className="bi bi-box-arrow-right"></i> Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

