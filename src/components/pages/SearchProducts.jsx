import { useEffect, useState, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import getProductsOnSearch from "../../../utils/getProductsOnSearch";
import { Link } from "react-router-dom";
import ProductCard from "../ProductCard";
import AlertMessage from "../AlertMessage";
import FilterSearch from "../FilterSearch";
import Spinner from "../Spinner";

export default function SearchProducts() {
    const [searchParams] = useSearchParams();
    const queries = useMemo(() => Object.fromEntries(searchParams.entries()), [searchParams]);
    const [products, setProducts] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
    });

    // Reset pagination on query change
    useEffect(() => {
        setPagination((prev) => ({
            ...prev,
            currentPage: 1, // Reset to page 1 on query change
        }));
    }, [queries.query]);

    // Fetch products when query or page changes
    useEffect(() => {
        if (queries.query) {
            setError(""); // Clear error state
            setLoading(true); // Start loading spinner

            getProductsOnSearch({
                queries: { ...queries, page: pagination.currentPage },
            })
                .then((response) => {
                    if (response && response.products) {
                        setProducts(response.products);
                        setPagination({
                            currentPage: response.currentPage,
                            totalPages: response.totalPages,
                        });
                    } else {
                        setProducts([]);
                        setPagination({
                            currentPage: 1,
                            totalPages: 1,
                        });
                    }
                    setLoading(false); // Stop loading spinner
                })
                .catch((err) => {
                    setLoading(false); // Stop loading spinner
                    setError(err.message || "Something Went Wrong!");
                });
        }
    }, [JSON.stringify(queries), pagination.currentPage]);

    // Pagination button logic
    const handlePrevPage = () => {
        if (pagination.currentPage > 1) {
            setPagination((prev) => ({ ...prev, currentPage: prev.currentPage - 1 }));
        }
    };

    const handleNextPage = () => {
        if (pagination.currentPage < pagination.totalPages) {
            setPagination((prev) => ({ ...prev, currentPage: prev.currentPage + 1 }));
        }
    };

    if (!queries.query) {
        return (
            <div className="container my-4">
                <h3>Please enter a search term to see results.</h3>
            </div>
        );
    }

    return (
        <div className="container my-4">
            {error && <AlertMessage message={error} alertType="danger" />}
            {loading ? (
                <Spinner />
            ) : (
                <>
                    <div className="d-flex justify-content-between w-100 p-3">
                        <div>
                            <h6>Search results for: </h6>
                            <h3 className="text-left">{queries.query}</h3>
                        </div>
                        <button
                            className="btn btn-black"
                            type="button"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#offcanvasExampleFilter"
                            aria-controls="offcanvasExample"
                            aria-label="Open filter options"
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

                    <FilterSearch setProducts={setProducts} setPagination={setPagination} />

                    <div className="w-100">
                        {products.length ? (
                            products.map((prod) => (
                                <Link
                                    className="text-decoration-none text-black"
                                    key={prod._id}
                                    to={`/products/${prod._id}`}
                                >
                                    <ProductCard product={prod} />
                                </Link>
                            ))
                        ) : (
                            <p>No products found for "{queries.query}"</p>
                        )}
                    </div>

                    <div className="d-flex justify-content-between mt-3">
                        <button
                            className="btn btn-secondary"
                            onClick={handlePrevPage}
                            disabled={pagination.currentPage === 1}
                        >
                            Previous
                        </button>
                        <span>
                            Page {pagination.currentPage} of {pagination.totalPages}
                        </span>
                        <button
                            className="btn btn-secondary"
                            onClick={handleNextPage}
                            disabled={pagination.currentPage === pagination.totalPages}
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
