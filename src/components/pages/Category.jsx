import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AlertMessage from "../AlertMessage";
import ProductCard from "../ProductCard";
import Filter from "../Filter";
import getProductsWithCategory from "../../../utils/getProductsWithCategory";
import Spinner from "../Spinner"; // Importing spinner for loading state

export default function Category() {
    const { category } = useParams();
    const [products, setProducts] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true); // Loading state for spinner
    const [page, setPage] = useState(1); // State for current page
    const [totalPages, setTotalPages] = useState(1); // State for total pages



    useEffect(() => {
        const controller = new AbortController(); // Create an AbortController instance
        const signal = controller.signal; // Get the signal from the AbortController
        // Function to fetch products with category and pagination
        const fetchProducts = async () => {
            try {
                setLoading(true); // Start loading
                const response = await getProductsWithCategory({
                    signal,
                    params: { category, page } // Pass current page and page size
                });
                setProducts(response.products);

                setTotalPages(Math.ceil(response.totalPages)); // Calculate total pages based on total count and page size
                setLoading(false); // Stop loading
            } catch (error) {
                setLoading(false); // Stop loading
                if (error.name === 'AbortError') {
                    console.log('Fetch aborted');
                } else {
                    setError(error?.message || "Something Went Wrong!");
                }
            }
        };

        fetchProducts();
        // Cleanup function to abort the request if the component unmounts or if category changes
        return () => {
            controller.abort();
        };
    }, [category, page]); // Dependency array with category and currentPage to re-run effect when they change

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage); // Update current page state
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
                        <h2 className='responsiveH2'>{products?.length ? products[0].category : category}</h2>
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
                                className="bi bi-funnel-fill "
                                viewBox="0 0 14 14"
                            >
                                <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5z" />
                            </svg>
                        </button>
                    </div>

                    <Filter setProducts={setProducts} page={page} category={category} />
                    <div className="w-100">
                        {products?.map((prod) => (
                            <Link className="text-decoration-none text-black" key={prod._id} to={`/products/${prod._id}`}>
                                <ProductCard product={prod} />
                            </Link>
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    <div className="d-flex justify-content-center mt-4">
                        <button
                            className="btn btn-outline-dark mx-2"
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 1}
                        >
                            Previous
                        </button>
                        <span>Page {page} of {totalPages}</span>
                        <button
                            className="btn btn-outline-dark mx-2"
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page === totalPages}
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
