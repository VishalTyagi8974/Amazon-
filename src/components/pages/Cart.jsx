import { useDispatch, useSelector } from "react-redux";
import {
    removeItem,
    removeItemFromCart,
    addItem,
    clearCart,
    addOrUpdateItemToCart,
    fetchAndMergeCartItems,
    emptyCartItems
} from "../../../store/slices/cartSlice";
import CartItem from "../CartItem";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // For navigation
import AlertMessage from "../AlertMessage";

export default function Cart() {
    const cart = useSelector(state => state.cart.cartList);
    const isUser = useSelector(state => state.auth.token);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [alert, setAlert] = useState(null); // State for alert messages
    const [loading, setLoading] = useState(false); // State for spinner

    useEffect(() => {
        if (isUser) {
            dispatch(fetchAndMergeCartItems(cart));
        }
    }, [isUser, dispatch]);

    const removeAnItem = (item) => {
        try {
            if (isUser) {
                dispatch(removeItemFromCart(item));
            } else {
                dispatch(removeItem(item));
            }
            setAlert({
                type: "success",
                message: "Item removed from cart successfully."
            });
        } catch (error) {
            setAlert({
                type: "danger",
                message: "Failed to remove item. Please try again."
            });
        }
    };

    const addOrUpdateAnItem = (item) => {
        try {
            if (isUser) {
                dispatch(addOrUpdateItemToCart(item));
            } else {
                dispatch(addItem(item));
            }
            setAlert({
                type: "success",
                message: "Cart updated successfully."
            });
        } catch (error) {
            setAlert({
                type: "danger",
                message: "Failed to update cart. Please try again."
            });
        }
    };

    const clearAllCart = () => {
        try {
            if (isUser) {
                dispatch(emptyCartItems(cart));
            } else {
                dispatch(clearCart());
            }
            setAlert({
                type: "success",
                message: "Cart cleared successfully."
            });
        } catch (error) {
            setAlert({
                type: "danger",
                message: "Failed to clear cart. Please try again."
            });
        }
    };

    const incrementItem = (item) => addOrUpdateAnItem({ ...item, quantity: item.quantity + 1 });
    const decrementItem = (item) => addOrUpdateAnItem({ ...item, quantity: item.quantity > 1 ? item.quantity - 1 : item.quantity });

    const handleCheckout = async () => {
        if (!isUser) {
            setAlert({
                type: "warning",
                message: "You need to log in to proceed to checkout."
            });
            navigate("/login"); // Redirect to login page
            return;
        }

        try {
            setLoading(true); // Show spinner

            // Ensure the cart is synchronized
            await dispatch(fetchAndMergeCartItems(cart));

            // Validate items availability (optional, backend validation recommended)
            if (!cart.length) {
                setAlert({
                    type: "warning",
                    message: "Your cart is empty."
                });
                setLoading(false);
                return;
            }

            navigate('/checkout', { state: { cart } }); // Passing cart as state
        } catch (error) {
            setAlert({
                type: "danger",
                message: "An error occurred while preparing your checkout. Please try again."
            });
        } finally {
            setLoading(false); // Hide spinner
        }
    };

    return (
        <div className="container my-4">
            <div className="row">
                <div className="col-12">
                    {(cart && cart.length) ? (
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h3 className="text-dark">My Cart</h3>
                            <button className="btn btn-danger" style={{ width: "150px" }} onClick={clearAllCart}>
                                Clear Cart <i className="bi bi-x-lg"></i>
                            </button>
                        </div>
                    ) : (
                        <h3 className="text-muted text-center">Your Cart is Empty</h3>
                    )}
                </div>
            </div>

            {/* Alert Message */}
            {alert && (
                <AlertMessage
                    alertType={alert.type}
                    message={alert.message}
                    setValue={setAlert}
                />
            )}

            <div className="row">
                <div className="col-12">
                    {(cart && cart.length) ? (
                        <>
                            {cart.map(item => (
                                <Link key={item.product._id} to={`/products/${item.product._id}`} style={{ color: "black", textDecoration: "none" }} >
                                    <CartItem
                                        item={item}
                                        incrementItem={incrementItem}
                                        decrementItem={decrementItem}
                                        removeItem={removeAnItem}
                                    />
                                </Link>
                            ))}

                            {/* Checkout Button */}
                            <div className="text-end mt-4 mx-3">
                                <button
                                    className="btn btn-warning"
                                    style={{ width: "100%" }}
                                    onClick={handleCheckout}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    ) : "Proceed to Checkout"}
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-5">
                            <p className="text-muted">Add items to your cart to see them here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}