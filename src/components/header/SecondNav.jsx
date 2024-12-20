import React, { useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './HorizontalScroll.css';
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import conf from "../../../conf/conf.js"
import { replaceSpacesWithDashes } from '../../../utils/replaceSpacesWithDashes.js';

const SecondNav = () => {
    const scrollRef = useRef(null);
    const [categories, setCategories] = useState([]);
    useEffect(() => {
        axios.get(`${conf.baseUrl}/products/allcategories`)
            .then((response) => {
                setCategories(response.data.allCategories)
            }).catch((error) => {
                console.log(error)
            })
    }, [])

    return (
        <div className="scroll-container-wrapper" style={{ backgroundColor: '#232f3e' }}>

            <div className="scroll-container" ref={scrollRef}>
                <nav className="navbar" style={{ backgroundColor: '#232f3e', padding: '10px 0' }}>
                    <div className="container-fluid">
                        <div className="navbar" id="secondNavbar">
                            <ul className="navbar-nav d-flex flex-row">
                                {categories.map((category, index) => (
                                    <li className="nav-item" key={index}>
                                        <Link className="nav-link" to={`/products/categories/${replaceSpacesWithDashes(category)}`} style={{ color: 'white', padding: '10px 15px' }}>
                                            {category}
                                        </Link >
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>

        </div>
    );
};

export default SecondNav;
