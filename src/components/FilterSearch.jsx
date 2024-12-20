import FilterSelect from "./FilterSelect";
import Button from "./Button";
import { useForm } from "react-hook-form";
import getProductsOnSearch from "../../utils/getProductsOnSearch";
import AlertMessage from "./AlertMessage";
import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom"



export default function FilterSearch({ setProducts }) {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [error, setError] = useState("");
    const [searchParams] = useSearchParams();
    const queries = useMemo(() => Object.fromEntries(searchParams.entries()), [searchParams]);

    function handleFilterSubmit(data) {
        setError("")
        getProductsOnSearch({
            queries: {
                ...queries, pricing: data.pricing, rating: data.rating
            }
        })
            .then((response) => {
                setProducts(response.products)
            })
            .catch(error => {
                setError(error.message || "Something went wrong")
            })

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
                    <form action="" onSubmit={handleSubmit(handleFilterSubmit)}>
                        <FilterSelect {...register("pricing")} className="mb-3" label="Pricing" options={["Default", "Low-High", "High-Low"]} />
                        <FilterSelect {...register("rating")} className="mb-3" label="Rating" options={["Default", "High-Low"]} />
                        <Button className="btn-success mt-3" type="submit">Filter</Button>
                    </form>
                </div>

            </div>
        </>
    )
}