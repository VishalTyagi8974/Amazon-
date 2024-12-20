import { Link } from "react-router-dom";
import { useEffect, useState } from "react"
import randomFiveCategories from "../../utils/randomFiveCategories";
import AlertMessage from "./AlertMessage";
import { replaceSpacesWithDashes } from "../../utils/replaceSpacesWithDashes";


export default function CarouselHome() {
    const [carouselCategories, setCarouselCategories] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        randomFiveCategories()
            .then((response) => {
                if (response.list) {
                    setCarouselCategories(response.list)
                }
                else {
                    setError(response.message);
                }
            }).catch((error) => {
                setError("Something went Wrong!")
            })

    }, [])

    return (
        <>
            <div className="m-2" style={{ backgroundColor: "rgba(0,0,0,0.2)" }}>
                <div
                    id="carouselExampleCaptions"
                    className="carousel slide"
                    data-bs-ride="carousel"
                    data-bs-interval="2000"
                >
                    {/* Carousel Indicators */}
                    <div className="carousel-indicators">
                        <button
                            type="button"
                            data-bs-target="#carouselExampleCaptions"
                            data-bs-slide-to="0"
                            className="active"
                            aria-current="true"
                            aria-label="Slide 1"
                        ></button>
                        {carouselCategories.slice(1).map((_, index) => (
                            <button
                                key={index + 1}
                                type="button"
                                data-bs-target="#carouselExampleCaptions"
                                data-bs-slide-to={index + 1}
                                aria-label={`Slide ${index + 2}`}
                            ></button>
                        ))}
                    </div>

                    <div className="carousel-inner" style={{ height: '420px' }}>
                        {carouselCategories.map((category, index) => (
                            <div
                                key={category._id}
                                className={`carousel-item ${index === 0 ? 'active' : ''}`}
                                style={{ height: '420px', position: 'relative' }}
                            >
                                {/* Image that covers the entire area */}
                                <img
                                    className="d-block w-100 h-100 position-absolute"
                                    style={{ objectFit: 'cover', top: 0, left: 0 }}
                                    src={category.image}
                                    alt={category.title}
                                />

                                {/* Overlay content, adjusted lower */}
                                <div className="position-absolute w-100 h-100 d-flex flex-column justify-content-end align-items-center mb-4">
                                    <h5 className="text-center text-white mb-3" style={{ textShadow: '0 0 5px black' }}>
                                        {category.title}
                                    </h5>
                                    <Link
                                        to={`/products/categories/${replaceSpacesWithDashes(category.title)}`}
                                        className="btn btn-warning rounded mb-5"
                                        style={{ width: '200px' }}
                                    >
                                        View More
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Carousel Controls */}
                    <button
                        className="carousel-control-prev"
                        type="button"
                        data-bs-target="#carouselExampleCaptions"
                        data-bs-slide="prev"
                    >
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button
                        className="carousel-control-next"
                        type="button"
                        data-bs-target="#carouselExampleCaptions"
                        data-bs-slide="next"
                    >
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>
            </div>
            {error && <AlertMessage alertType="danger" setValue={setError} message={error} />}
        </>

    )
}