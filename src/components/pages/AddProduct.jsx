import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import conf from "../../../conf/conf";
import { useNavigate } from "react-router-dom";
import AlertMessage from "../AlertMessage"; // Importing alert message component
import Spinner from "../Spinner"; // Importing spinner component for loading state

const AddProduct = () => {
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false); // Loading state for spinner

    useEffect(() => {
        setLoading(true); // Start loading
        axios.get(`${conf.baseUrl}/products/allcategories`)
            .then((response) => {
                setCategories(response.data.allCategories);
                setLoading(false); // Stop loading
            })
            .catch((error) => {
                setError("Failed to load categories");
                setLoading(false); // Stop loading
            });
    }, []);

    const onSubmit = async (data) => {
        try {
            setLoading(true); // Start loading
            const formData = new FormData();

            // Append non-file fields to formData
            formData.append("name", data.name);
            formData.append("price", data.price);
            formData.append("description", data.description);
            formData.append("category", data.category);

            // Append each image file to formData
            const files = data.images;
            for (let i = 0; i < files.length; i++) {
                formData.append("images", files[i]);
            }

            const response = await axios.post(`${conf.baseUrl}/products`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true,
            });

            reset(); // Reset the form after successful submission
            navigate(`/products/${response.data.productId}`);
        } catch (error) {
            console.error("Error adding product:", error);
            setError("Failed to add product. Please try again.");
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <div className="container my-5">
            {error && <AlertMessage message={error} />}
            {loading ? (
                <Spinner /> // Show spinner while data is loading
            ) : (
                <>
                    <h2>Add New Product</h2>
                    <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">

                        {/* Name */}
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Product Name</label>
                            <input
                                type="text"
                                id="name"
                                className="form-control"
                                {...register("name", { required: true })}
                            />
                            {errors.name && <p className="text-danger">Name is required.</p>}
                        </div>

                        {/* Price */}
                        <div className="mb-3">
                            <label htmlFor="price" className="form-label">Price</label>
                            <input
                                type="number"
                                id="price"
                                className="form-control"
                                step="0.01"
                                {...register("price", { required: true })}
                            />
                            {errors.price && <p className="text-danger">Price is required.</p>}
                        </div>

                        {/* Description */}
                        <div className="mb-3">
                            <label htmlFor="description" className="form-label">Description</label>
                            <textarea
                                id="description"
                                className="form-control"
                                {...register("description", { required: true })}
                            />
                            {errors.description && <p className="text-danger">Description is required.</p>}
                        </div>

                        {/* Category */}
                        <div className="mb-3">
                            <label htmlFor="category" className="form-label">Category</label>
                            <select
                                id="category"
                                className="form-select"
                                {...register("category", { required: true })}
                            >
                                <option value="">Select a category</option>
                                {categories.map((category, index) => (
                                    <option key={index} value={category}>{category}</option>
                                ))}
                            </select>
                            {errors.category && <p className="text-danger">Category is required.</p>}
                        </div>

                        {/* Image Upload */}
                        <div className="mb-3">
                            <label htmlFor="images" className="form-label">Product Image</label>
                            <input
                                type="file"
                                id="images"
                                className="form-control"
                                multiple
                                {...register("images", { required: true })}
                            />
                            {errors.images && <p className="text-danger">Image is required.</p>}
                        </div>

                        {/* Submit Button */}
                        <button type="submit" className="btn btn-primary">Add Product</button>
                    </form>
                </>
            )}
        </div>
    );
};

export default AddProduct;
