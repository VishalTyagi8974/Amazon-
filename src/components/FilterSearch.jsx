import FilterSelect from "./FilterSelect";
import Button from "./Button";
import { useForm } from "react-hook-form";
import getProductsOnSearch from "../../utils/getProductsOnSearch";
import AlertMessage from "./AlertMessage";
import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

export default function FilterSearch({ setProducts }) {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [error, setError] = useState("");
    const [searchParams, setSearchParams] = useSearchParams();

    // Memoized search queries from URL parameters
    const queries = useMemo(() => Object.fromEntries(searchParams.entries()), [searchParams]);

    // Handle filter submission
    function handleFilterSubmit(data) {
        setError("");
        // Update query parameters in the URL for consistency, preserving the current search query
        const updatedQueries = {
            ...queries, // Keep other query params intact
            pricing: data.pricing,
            rating: data.rating,
            page: 1, // Reset to page 1 when filters are applied
        };

        setSearchParams(updatedQueries); // Update the searchParams in URL

        // Fetch filtered products based on updated query params
        getProductsOnSearch({ queries: updatedQueries })
            .then((response) => {
                setProducts(response.products); // Update products
            })
            .catch((error) => {
                setError(error.message || "Something went wrong");
            });

        // Close the off-canvas filter manually by using the `data-bs-dismiss` attribute
        // Using `setTimeout` to ensure the DOM has updated before triggering the close
        setTimeout(() => {
            const closeButton = document.querySelector('[data-bs-dismiss="offcanvas"]');
            if (closeButton) {
                closeButton.click(); // Simulate click on close button to dismiss the offcanvas
            }
        }, 300); // Adjust timeout if needed
    }

    return (
        <>
            {error && <AlertMessage message={error} />}
            <div
                className="offcanvas offcanvas-start"
                tabIndex="-1"
                id="offcanvasExampleFilter"
                aria-labelledby="offcanvasExampleLabel"
            >
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="offcanvasExampleLabel">
                        Filter
                    </h5>
                    <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="offcanvas"
                        aria-label="Close"
                    ></button>
                </div>
                <div className="offcanvas-body">
                    <form onSubmit={handleSubmit(handleFilterSubmit)}>
                        {/* Pricing Filter */}
                        <FilterSelect
                            {...register("pricing")}
                            className="mb-3"
                            label="Pricing"
                            options={["Default", "Low-High", "High-Low"]}
                            defaultValue={queries.pricing || "Default"} // Preserve current filter state
                        />

                        {/* Rating Filter */}
                        <FilterSelect
                            {...register("rating")}
                            className="mb-3"
                            label="Rating"
                            options={["Default", "High-Low"]}
                            defaultValue={queries.rating || "Default"} // Preserve current filter state
                        />

                        <Button className="btn-success mt-3" type="submit">
                            Filter
                        </Button>
                    </form>
                </div>
            </div>
        </>
    );
}
