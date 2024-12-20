import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="bg-dark text-white pt-4">
            <div className="container">
                <div className="row">
                    <div className="col-md-3 col-sm-6">
                        <h5>Get to Know Us</h5>
                        <ul className="list-unstyled footer">
                            <li><a href="#!" className="text-white">About Us</a></li>
                            <li><a href="#!" className="text-white">Careers</a></li>
                            <li><a href="#!" className="text-white">Press Releases</a></li>
                            <li><a href="#!" className="text-white">Amazon Cares</a></li>
                        </ul>
                    </div>
                    <div className="col-md-3 col-sm-6">
                        <h5>Connect with Us</h5>
                        <ul className="list-unstyled footer">
                            <li><a href="#!" className="text-white">Facebook</a></li>
                            <li><a href="#!" className="text-white">Twitter</a></li>
                            <li><a href="#!" className="text-white">Instagram</a></li>
                        </ul>
                    </div>
                    <div className="col-md-3 col-sm-6">
                        <h5>Make Money with Us</h5>
                        <ul className="list-unstyled footer">
                            <li><a href="#!" className="text-white">Sell on Amazon</a></li>
                            <li><a href="#!" className="text-white">Amazon Global Selling</a></li>
                            <li><a href="#!" className="text-white">Become an Affiliate</a></li>
                            <li><a href="#!" className="text-white">Advertise Your Products</a></li>
                        </ul>
                    </div>
                    <div className="col-md-3 col-sm-6">
                        <h5>Let Us Help You</h5>
                        <ul className="list-unstyled footer">
                            <li><a href="#!" className="text-white">Your Account</a></li>
                            <li><a href="#!" className="text-white">Returns Centre</a></li>
                            <li><a href="#!" className="text-white">100% Purchase Protection</a></li>
                            <li><a href="#!" className="text-white">Help</a></li>
                        </ul>
                    </div>
                </div>

                <div className="row mt-4 mb-2">
                    <div className="col text-center">
                        <p className="mb-0">© 2024 Amazon. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
