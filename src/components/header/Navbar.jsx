import SecondNav from "./SecondNav";
import Search from "./Search";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import conf from "../../../conf/conf.js"
import { replaceSpacesWithDashes } from "../../../utils/replaceSpacesWithDashes.js";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../../../store/slices/authSlice.js";
import "./Navbar.css";
import { fetchAndMergeCartItems } from "../../../store/slices/cartSlice.js";

const Navbar = () => {
    const token = useSelector(state => state.auth.token)
    const dispatch = useDispatch()
    const [categories, setCategories] = useState([]);
    const cart = useSelector(state => state.cart.cartList);

    const navigate = useNavigate();
    const location = useLocation(); // Get current location for dynamic active class

    const scrollToTopAndCollapse = () => {
        window.scrollTo(0, 0);  // Scroll to top
    };

    useEffect(() => {
        axios.get(`${conf.baseUrl}/products/allcategories`)
            .then((response) => {
                setCategories(response.data.allCategories)
            }).catch((error) => {
                console.log(error)
            })
    }, [])


    useEffect(() => {
        scrollToTopAndCollapse();
    }, [location]);

    useEffect(() => {
        const navbarCollapse = document.getElementById("navbarContent");
        if (navbarCollapse && navbarCollapse.classList.contains("show")) {
            navbarCollapse.classList.remove("show");
        }
    }, [location]);


    useEffect(() => {
        axios.get(`${conf.baseUrl}/auth/status`, {
            headers: {
                'Accept': 'application/json'
            },
            withCredentials: true
        })
            .then((response) => {
                if (response.data.isAuthenticated) {
                    dispatch(login())
                    dispatch(fetchAndMergeCartItems(cart));
                } else {
                    dispatch(logout())
                }
            })
            .catch((error) => {
                console.log(error)
                console.error("Failed to check authentication status:");
            });
    }, [token]);



    const onSearchSubmit = (data) => {
        navigate(`/products/search?query=${data.query}`)
    }

    return (
        <div className="" id="firstNav">
            <nav className="navbar navbar-expand-md" style={{ backgroundColor: '#131921', padding: '10px' }}>
                <div className="container-fluid">
                    {/* Logo */}
                    <Link className="navbar-brand" to="/">
                        <img
                            src="/Amazon-Logo-White-PNG-Photo.png"
                            alt="Amazon Logo"
                            style={{
                                width: '100px'
                            }}
                        />
                    </Link>



                    {/* Toggle button for mobile view */}
                    <button className="navbar-toggler mb-2" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent" aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="inline-block pb-2" style={{ color: "white" }}><svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="currentColor" className="bi bi-grid-3x3-gap-fill" viewBox="0 0 16 16">
                            <path d="M1 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1zM1 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1zM1 12a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1z" />
                        </svg></span>
                    </button>
                    <Search onSearchSubmit={onSearchSubmit} className="d-flex d-md-none w-100 mx-0" style={{ maxWidth: "100%" }} />

                    {/* Collapsible content */}

                    <div className="collapse navbar-collapse" id="navbarContent">
                        {/* Delivery Location */}
                        {token && <Link to="/addAddress" className="nav-link">
                            <div className="nav-location" style={{ color: 'white', fontSize: '14px', marginRight: '15px' }}>
                                <i className="bi bi-geo-alt-fill" style={{ fontSize: '20px', marginRight: '5px' }}></i>
                                <span>Hello, Add your address</span>
                            </div>
                        </Link>}

                        {
                            !token &&
                            <div className="nav-item me-5">
                                <Link className="nav-link" to="/login" style={{ color: 'white', marginRight: '1em', fontSize: '14px' }}>
                                    Hello, log in
                                </Link>
                            </div>}

                        {/* Search Bar */}
                        <Search onSearchSubmit={onSearchSubmit} className="d-none d-md-flex " />

                        {/* Right Side Links */}
                        <ul className="navbar-nav ms-auto">
                            {
                                token &&
                                <li className="nav-item">
                                    <Link className="nav-link" to="/orders" style={{ color: 'white', marginRight: '1em', fontSize: '14px' }}>
                                        Returns & Orders
                                    </Link>
                                </li>
                            }
                            <li className="nav-item">
                                <Link className="nav-link" to="/cart" style={{ color: 'white', fontSize: '14px' }}>
                                    <div className="d-flex flex-column align-items-start justify-content-center">
                                        <sup className="mb-0 " style={{ marginLeft: "18px" }}>{cart.length}</sup>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="30" fill="currentColor" className="bi bi-cart3" viewBox="0 0 15 18">
                                            <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l.84 4.479 9.144-.459L13.89 4zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
                                        </svg>
                                    </div>
                                </Link>
                            </li>
                            {
                                token &&
                                <li className="nav-item">
                                    <Link className="nav-link" to="/user" style={{ color: 'white', marginRight: '1em', fontSize: '14px' }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
                                            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                                            <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                                        </svg>
                                    </Link>
                                </li>}
                        </ul>
                        <div className="d-flex flex-column d-md-none ">
                            <h2 className="text-light">Categories</h2>
                            <ul className="list-unstyled">
                                {categories.map((category, index) => (
                                    <li className="nav-item" key={index}>
                                        <Link className="nav-link" to={`/products/categories/${replaceSpacesWithDashes(category)}`} style={{ color: 'white', padding: '10px 15px' }}>
                                            {category}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>


                </div>
            </nav >
            <div className="d-none d-md-block">
                <SecondNav />
            </div>
        </div>
    )
}
export default Navbar