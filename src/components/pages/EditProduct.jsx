import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import conf from "../../../conf/conf";
import { useNavigate, useParams } from "react-router-dom";
import AlertMessage from "../AlertMessage";
import Spinner from "../Spinner";

const EditProduct = () => {
    const [categories, setCategories] = useState([]);
    const [product, setProduct] = useState({});
    const [seller, setSeller] = useState({});
    const [deleteImages, setDeleteImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const navigate = useNavigate();
    const { prodId } = useParams();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues: {
            name: "",
            price: "",
            description: "",
            category: "",
        },
    });

    // Update form values when the `product` is fetched
    useEffect(() => {
        if (Object.keys(product).length > 0) {
            reset({
                name: product.name || "",
                price: product.price || "",
                description: product.description || "",
                category: product.category || "",
            });
        }
    }, [product, reset]);

    const handleCheckboxChange = (filename) => {
        setDeleteImages((prevArray) => {
            if (prevArray.includes(filename)) {
                return prevArray.filter((item) => item !== filename);
            } else {
                return [...prevArray, filename];
            }
        });
    };

    useEffect(() => {
        axios.get(`${conf.baseUrl}/products/allcategories`)
            .then((response) => {
                setCategories(response.data.allCategories);
            })
            .catch((error) => {
                setErrorMessage("Failed to fetch categories. Please try again later.");
            });
    }, []);

    useEffect(() => {
        axios.get(`${conf.baseUrl}/products/${prodId}`)
            .then((response) => {
                setProduct(response.data.productData);
                setSeller(response.data.productSeller);
            })
            .catch((error) => {
                setErrorMessage("Failed to fetch product details. Please try again later.");
            });
    }, [prodId]);

    const onSubmit = async (data) => {
        try {
            setIsLoading(true);
            setErrorMessage("");
            setSuccessMessage("");

            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("price", data.price);
            formData.append("description", data.description);
            formData.append("category", data.category);
            formData.append("deleteImages", JSON.stringify(deleteImages));
            formData.append("sellerId", seller._id);
            formData.append("prodId", prodId);

            const files = data.images;
            for (let i = 0; i < files.length; i++) {
                formData.append("images", files[i]);
            }

            const response = await axios.patch(`${conf.baseUrl}/products`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            });

            setSuccessMessage("Product updated successfully!");
            navigate(`/products/${response.data.productId}`);
        } catch (error) {
            setErrorMessage(error.response?.data?.message || "Failed to update the product. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container my-5">
            <h2>Edit Product</h2>

            {errorMessage && <AlertMessage type="danger" message={errorMessage} />}
            {successMessage && <AlertMessage type="success" message={successMessage} />}

            {isLoading ? (
                <Spinner />
            ) : (
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

                    {/* Current Images */}
                    <div>
                        <span className="form-label mt-2">Current images</span>
                        <div className="d-flex flex-wrap justify-content-center">
                            {product.images?.map((image, index) => (
                                <div key={index} style={{ position: "relative", maxWidth: "240px" }}>
                                    <img
                                        src={image.url}
                                        className="m-2 img-thumbnail"
                                        alt={`Thumbnail ${index}`}
                                    />
                                    <div
                                        className="my-3"
                                        style={{
                                            position: "absolute",
                                            right: 0,
                                            top: 0,
                                            backgroundColor: "rgba(255, 255, 255, 0.7)",
                                            borderRadius: "5px",
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            className="btn-check"
                                            id={`checkbox${index}`}
                                            onChange={() => handleCheckboxChange(image.filename)}
                                            style={{ display: "none" }}
                                        />
                                        <label
                                            className="btn btn-outline-danger"
                                            htmlFor={`checkbox${index}`}
                                        >
                                            <i className="bi bi-trash-fill"></i>
                                        </label>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* New Images */}
                    <div className="mb-3">
                        <label htmlFor="images" className="form-label">Upload New Images</label>
                        <input
                            type="file"
                            id="images"
                            className="form-control"
                            multiple
                            {...register("images")}
                        />
                    </div>

                    {/* Submit Button */}
                    <button type="submit" className="btn btn-primary">Update Product</button>
                </form>
            )}
        </div>
    );
};

export default EditProduct;
