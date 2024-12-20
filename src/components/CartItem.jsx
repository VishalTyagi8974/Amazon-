import React from "react";

const CartItem = ({ item, incrementItem, decrementItem, removeItem }) => {
    const { product, quantity } = item;
    const { _id, name, images, price } = product;

    return (
        <div className="cart-item d-flex align-items-center py-3 border-bottom">
            {/* Product Image */}
            <div className="cart-item-image me-3">
                <img
                    src={images[0].url || "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
                    alt={name}
                    className="img-fluid rounded"
                    style={{ width: "100px", height: "100px", objectFit: "cover" }}
                />
            </div>

            {/* Product Details */}
            <div className="cart-item-details flex-grow-1">
                <h5 className="mb-1">{name}</h5>
                <p className="text-muted mb-1">Price: ₹{price}</p>

                {/* Quantity Controls */}
                <div className="d-flex align-items-center">
                    <button
                        className="btn btn-outline-secondary btn-sm me-2"
                        onClick={(e) => {
                            e.preventDefault()
                            decrementItem(item)

                        }}
                    >
                        <i className="bi bi-dash"></i> {/* Bootstrap icon */}
                    </button>
                    <span className="quantity mx-2">{quantity}</span>
                    <button
                        className="btn btn-outline-secondary btn-sm me-2"
                        onClick={(e) => {
                            e.preventDefault()
                            incrementItem(item)
                        }}
                    >
                        <i className="bi bi-plus"></i> {/* Bootstrap icon */}
                    </button>
                </div>

                {/* Remove Button */}
                <button
                    className="btn btn-link text-danger mt-2 p-0"
                    onClick={(e) => {
                        e.preventDefault()
                        removeItem(item)
                    }}
                >
                    <i className="bi bi-trash-fill"></i> Remove {/* Bootstrap trash icon */}
                </button>
            </div>
        </div>
    );
};

export default CartItem;
