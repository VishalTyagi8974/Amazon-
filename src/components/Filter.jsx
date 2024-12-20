import { useEffect, useState } from "react";
import FilterSelect from "./FilterSelect";
import axios from "axios";
import conf from "../../conf/conf";
import Button from "./Button";
import { useForm } from "react-hook-form";
import getProductsWithCategory from "../../utils/getProductsWithCategory";


export default function Filter({ setProducts }) {
    const [categories, setCategories] = useState([]);
    const { register, handleSubmit, formState: { errors } } = useForm();

    useEffect(() => {
        axios.get(`${conf.baseUrl}/products/allcategories`)
            .then((response) => {
                setCategories(response.data.allCategories);

            }).catch((error) => {
                console.log(error)
            })
    }, [])

    function handleFilterSubmit(data) {
        getProductsWithCategory({
            params: {
                category: data.category,
                pricing: data.pricing,
                rating: data.rating
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
                        <FilterSelect {...register("category")} className="mb-3" label="Category" options={categories} />
                        <FilterSelect {...register("rating")} label="Rating" options={["Default", "High-Low"]} />
                        <Button className="btn-success mt-3" type="submit">Filter</Button>
                    </form>
                </div>

            </div>
        </>
    )
}