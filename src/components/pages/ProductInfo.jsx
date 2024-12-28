import { useEffect, useState } from "react";
import Button from "../Button";
import ProductImages from "../ProductImages";
import AlertMessage from "../AlertMessage";
import Spinner from "../Spinner"; // Importing spinner for loading state
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import conf from "../../../conf/conf";
import "./CustomCssProduct.css";
import { addOrUpdateItemToCart, addItem } from "../../../store/slices/cartSlice";
import { useSelector, useDispatch } from "react-redux";
import ReviewComponent from "../ReviewComponent";
import { getUserData } from "../../../utils/userFunctions";
import ConfirmationModal from "../ConfirmationModal";
export default function ProductInfo() {
    const isUser = useSelector((state) => state.auth.token); // Check if user is logged in
    const dispatch = useDispatch(); // For dispatching Redux actions
    const navigate = useNavigate(); // For redirecting after delete
    const { prodId } = useParams(); // Get product ID from route params
    const [modalVisible, setModalVisible] = useState(false);

    const [product, setProduct] = useState({});
    const [user, setUser] = useState({});
    const [seller, setSeller] = useState({});
    const [error, setError] = useState(""); // Error message state
    const [loading, setLoading] = useState(true); // Loading state for spinner

    // Function to add or update item in cart
    const addOrUpdateAnItem = (item) => {
        if (isUser) {
            dispatch(addOrUpdateItemToCart(item)); // Dispatch action for logged-in user
        } else {
            dispatch(addItem(item)); // Dispatch action for guest user
        }
    };

    // Function to handle product deletion
    const deleteProduct = async () => {
        setLoading(true);
        try {
            await axios.delete(`${conf.baseUrl}/products`, {
                data: {
                    prodId,
                    sellerId: seller._id,
                },
                withCredentials: true,
            });
            navigate("/"); // Redirect to products page after deletion
        } catch (err) {
            setError(err.message || "Failed to delete product");
        }
    };

    // Fetch product details
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true); // Start loading
                const response = await axios.get(`${conf.baseUrl}/products/${prodId}`);
                if (response.data.productData) {
                    setProduct(response.data.productData);
                    setSeller(response.data.productSeller);
                } else {
                    navigate("/404"); // Navigate to 404 page if product not found
                }
            } catch (err) {
                setError(err.message || "Something went wrong");
                navigate("/404");
            } finally {
                setLoading(false); // Stop loading
            }
        };
        fetchProduct();
    }, [prodId, navigate]);

    // Fetch user data
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await getUserData();
                setUser(response.userData);
            } catch (err) {
                console.error(err);
                setError(err.message || "Failed to fetch user data");
            }
        };
        fetchUser();
    }, []);

    return (
        <div className="container my-4">
            {error && <AlertMessage message={error} />} {/* Show error alert if there's an error */}
            {loading ? (
                <Spinner /> // Show spinner while data is loading
            ) : (
                <div className="row">
                    <div className="col-md-6">
                        <ProductImages images={product.images} />
                    </div>
                    <div className="col-md-6">
                        <h1 className="display-5">{product.name}</h1>
                        <h2 className="text-danger fw-bold">₹{product.price}</h2>
                        <p className="lead">{product.description}</p>
                        <p>
                            <strong>Category:</strong> {product.category}
                        </p>
                        <p>
                            <strong>Seller:</strong> {seller ? seller.username : "Loading..."}
                        </p>

                        <Button
                            variant="warning"
                            className="w-100 py-2 mt-3"
                            onClick={() => addOrUpdateAnItem({ product: product, quantity: 1 })} // Dispatch Redux action
                        >
                            Add to Cart
                        </Button>

                        {/* Conditionally render Edit and Delete buttons if the user is the seller */}
                        {isUser && user._id === seller._id && (
                            <div className="mt-4">
                                <Button
                                    variant="outline-info"
                                    className="w-25 py-2 mx-2"
                                    onClick={() => navigate(`/products/${prodId}/edit`)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="outline-danger"
                                    className="w-25 py-2 mx-2"
                                    onClick={() => setModalVisible(true)} // Delete product
                                >
                                    Delete
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            )}
            <ReviewComponent prodId={prodId} avg={product.avgRating} />
            <ConfirmationModal show={modalVisible} handleClose={() => setModalVisible(false)} handleConfirm={deleteProduct} />
        </div>
    );
}
