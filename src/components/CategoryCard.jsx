import { Link } from "react-router-dom";

export default function CategoryCard({ heading, imgSrc, link }) {
    return (
        <div className="card shadow m-4 mx-5 p-3" style={{ width: "270px" }} >
            <h5 className="mb-3">{heading}</h5>
            <img className="mb-2" src={imgSrc} alt="" />
            <Link to={link}  >View More </Link>
        </div>
    )
}