import React from 'react';// Ensure to include the custom CSS for half-star clipping

const StarRating = ({ rating, className }) => {
    const maxStars = 5;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    const renderStar = (index) => {
        if (index < fullStars) {
            return <span key={index} className="text-yellow-500 text-xl">&#9733;</span>;
        } else if (hasHalfStar && index === fullStars) {
            return (
                <span key={index} className="relative text-yellow-500 text-xl">
                    <span className="absolute inset-0 text-gray-300">&#9733;</span>
                    <span className="relative text-yellow-500 clip-half">&#9733;</span>
                </span>
            );
        } else {
            return <span key={index} className="text-gray-300 text-xl">&#9734;</span>;
        }
    };

    return (
        <div className={`flex items-center ${className}`}>
            {Array.from({ length: maxStars }, (_, index) => renderStar(index))}
        </div>
    );
};

export default StarRating;
