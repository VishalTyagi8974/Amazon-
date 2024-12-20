export default function ProductImages({ images }) {
    return (
        <div id="carouselExampleIndicators" className="carousel slide w-100">
            <div className="carousel-indicators">
                {images?.map((image, idx) => (
                    <button
                        type="button"
                        data-bs-target="#carouselExampleIndicators"
                        data-bs-slide-to={idx}
                        className={`${idx === 0 ? "active" : ""}`}
                        aria-current={idx === 0 ? "true" : "false"}
                        aria-label={`Slide ${idx + 1}`}
                        key={`Slide-${idx}`}
                    ></button>
                ))}
            </div>
            <div className="carousel-inner">
                {images?.map((image, idx) => (
                    <div key={idx} className={`carousel-item ${idx === 0 ? "active" : ""}`}>
                        <img
                            src={image.url || "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
                            className="d-block w-100"
                            style={{ maxHeight: "400px", objectFit: "cover" }}
                            alt="Product"
                        />
                    </div>
                ))}
            </div>
            <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#carouselExampleIndicators"
                data-bs-slide="prev"
            >
                <span className="carousel-control-prev-icon " aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
            </button>
            <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#carouselExampleIndicators"
                data-bs-slide="next"
            >
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
            </button>
        </div>
    );
}
