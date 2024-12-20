import { useEffect, useState, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import getProductsOnSearch from "../../../utils/getProductsOnSearch";
import { Link } from "react-router-dom";
import ProductCard from "../ProductCard";
import AlertMessage from "../AlertMessage";
import FilterSearch from "../FilterSearch";
import Spinner from "../Spinner"; // Importing spinner for loading state

export default function SearchProducts() {
    const [searchParams] = useSearchParams();
    const queries = useMemo(() => Object.fromEntries(searchParams.entries()), [searchParams]);
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true); // Loading state for spinner

    useEffect(() => {
        if (queries.query) {
            setLoading(true); // Start loading
            getProductsOnSearch({ queries })
                .then(response => {
                    setProducts(response.products);
                    setLoading(false); // Stop loading
                })
                .catch(err => {
                    setLoading(false); // Stop loading
                    setError(err.message || "Something Went Wrong!");
                });
        }
    }, [JSON.stringify(queries)]);

    return (
        <div className="container my-4">
            {error && <AlertMessage message={error} alertType="danger" />} {/* Show error alert if there's an error */}
            {loading ? (
                <Spinner /> // Show spinner while data is loading
            ) : (
                <>
                    <div className="d-flex justify-content-between w-100 p-3">
                        <div>
                            <h6>Search results for: </h6>
                            <h3 className='text-left'>{queries.query}</h3>
                        </div>
                        <button
                            className="btn btn-black"
                            type="button"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#offcanvasExampleFilter"
                            aria-controls="offcanvasExample"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                fill="currentColor"
                                className="bi bi-funnel-fill"
                                viewBox="0 0 14 14"
                            >
                                <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5z" />
                            </svg>
                        </button>
                    </div>

                    <FilterSearch setProducts={setProducts} />

                    <div className="w-100">
                        {products?.length ? (
                            products.map((prod) => (
                                <Link className="text-decoration-none text-black" key={prod._id} to={`/products/${prod._id}`}>
                                    <ProductCard product={prod} />
                                </Link>
                            ))
                        ) : (
                            <p>No products found for "{queries.query}"</p>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
