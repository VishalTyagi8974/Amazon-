import { Link } from "react-router-dom";

export default function PageNotFound() {
    return (
        <div className="d-flex flex-column justify-content-center align-items-center vh-100 text-center">
            <h1 className="display-4">404</h1>
            <p className="lead">Oops! The page you are looking for does not exist.</p>
            <Link to="/" className="btn btn-warning mt-3">
                Go Back to Home
            </Link>
        </div>
    );
}
