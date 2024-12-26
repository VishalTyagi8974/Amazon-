import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import AlertMessage from "../AlertMessage";
import ProductCard from "../ProductCard";
import Filter from "../Filter";
import getProductsWithSearch from "../../../utils/getProductsWithSearch"; // Assuming this utility handles search logic
import Spinner from "../Spinner"; // Importing spinner for loading state

export default function SearchedPage() {
    const { search } = useLocation(); // Using location to get the query parameters from the URL
    const queryParams = new URLSearchParams(search);
    const searchQuery = queryParams.get("query") || ""; // Extract search query from URL
    const [products, setProducts] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true); // Loading state for spinner
    const [currentPage, setCurrentPage] = useState(1); // State for current page
    const [totalPages, setTotalPages] = useState(1); // State for total pages

    const pageSize = 10; // Number of products per page

    useEffect(() => {
        const controller = new AbortController(); // Create an AbortController instance
        const signal = controller.signal; // Get the signal from the AbortController

        // Function to fetch products with search query and pagination
        const fetchProducts = async () => {
            try {
                setLoading(true); // Start loading
                const response = await getProductsWithSearch({
                    signal,
                    params: {
                        query: searchQuery,
                        page: currentPage,
                        limit: pageSize,
                    },
                });

                // Ensure totalCount is valid and calculate totalPages
                const totalCount = response.totalCount || 0;
                setProducts(response.products);
                setTotalPages(Math.max(1, Math.ceil(totalCount / pageSize))); // Avoid NaN by using Math.max
                setLoading(false); // Stop loading
            } catch (error) {
                setLoading(false); // Stop loading
                if (error.name === "AbortError") {
                    console.log("Fetch aborted");
                } else {
                    setError(error?.message || "Something Went Wrong!");
                }
            }
        };

        fetchProducts();

        // Cleanup function to abort the request if the component unmounts or if search query changes
        return () => {
            controller.abort();
        };
    }, [searchQuery, currentPage]); // Re-run the effect when searchQuery or currentPage changes

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage); // Update current page state
        }
    };

    return (
        <div className="container my-4">
            {error && <AlertMessage message={error} alertType="danger" />} {/* Show error alert if there's an error */}
            {loading ? (
                <Spinner /> // Show spinner while data is loading
            ) : (
                <>
                    <div className="d-flex justify-content-between w-100 p-3">
                        <h2 className="responsiveH2">Search Results for "{searchQuery}"</h2>
                    </div>

                    <Filter setProducts={setProducts} />
                    <div className="w-100">
                        {products?.map((prod) => (
                            <Link
                                className="text-decoration-none text-black"
                                key={prod._id}
                                to={`/products/${prod._id}`}
                            >
                                <ProductCard product={prod} />
                            </Link>
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    <div className="d-flex justify-content-center mt-4">
                        <button
                            className="btn btn-outline-dark mx-2"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        <span>
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            className="btn btn-outline-dark mx-2"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
