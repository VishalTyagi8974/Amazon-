import { useEffect, useState } from "react";
import randomFiveCategories from "../../utils/randomFiveCategories";
import AlertMessage from "./AlertMessage";
import { replaceSpacesWithDashes } from "../../utils/replaceSpacesWithDashes";
import CategoryCard from "./CategoryCard";
import Spinner from "./Spinner";

export default function OtherHomeComponents() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        setLoading(true)
        randomFiveCategories()
            .then((response) => {
                if (response.list) {
                    setLoading(false)
                    setCategories(response.list);
                } else {
                    setLoading(false)
                    setError(response.message || "Failed to fetch categories.");
                }
            })
            .catch(() => {
                setLoading(false)
                setError("Something went wrong while fetching categories.");
            });
    }, []);
    if (loading) {
        return <Spinner />
    }

    return (
        <div className="my-4">
            <h1 className="m-4">View More Categories</h1>

            {/* Display Error Message */}
            {error && <AlertMessage alertType="danger" setValue={setError} message={error} />}

            {/* Display Categories */}
            <div className="d-flex flex-wrap justify-content-center justify-content-md-start">
                {categories.map((category, index) => (
                    <CategoryCard
                        key={index} // Use index as fallback for keys
                        link={`/products/categories/${replaceSpacesWithDashes(category.title)}`}
                        heading={category.title}
                        imgSrc={category.image}
                    />
                ))}
            </div>
        </div>
    );
}
