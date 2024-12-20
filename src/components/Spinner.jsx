export default function Spinner() {
    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="spinner-border text-warning" role="status" style={{ width: "4rem", height: "4rem" }}>
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    )
}