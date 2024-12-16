// components/ProductsList.js

import React from 'react';
import ProductCard from '../ProductCard';

const ProductsList = ({ products }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4  max-sm:m-[5%]">
            {products.map(product => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
};

export default ProductsList;
