import React from 'react';
import './ProductCard.css';
import StarRateIcon from '@mui/icons-material/StarRate';

const ProductCard = ({ product }) => {
    return (
        <div className=' shadow d-flex justify-content-center border border-dark-subtle rounded m-4 p-4'>
            <div className='prodImage' >
                <img className='img-fluid pe-3' src={product.images[0].url ? product.images[0].url : "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"} alt="" />
            </div>
            <div className='prodContent' >
                <h4 className='responsiveTexts'>{product.name}</h4>
                <h3 className='responsiveTexts'><sup> &#8377;</sup> {product.price}</h3>
                <h5 className='responsiveTexts'>{product.avgRating ? product.avgRating : "No Ratings"} {product.reviews.length ? < StarRateIcon /> : ""}</h5>
                <h5 className='responsiveTexts'>{product.description}</h5>
            </div>
        </div >
    );
};

export default ProductCard;
