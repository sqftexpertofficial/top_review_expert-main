// components/ProductCard.js
import React from 'react';
import HeartRating from '../HeartRating';
import { convertVotesToText } from '@/constants.js';

const ProductCard = ({ product }) => {

    

    return (
        <a className="bg-white border-2 border-solid border-[#faf0ff] p-4 rounded-lg max-sm:relative" href={`/companies/${product.slug}`}>
            <img src={product.img} alt={product.name} className="w-full h-[9.375rem] object-contain object-center p-[1rem] rounded-lg mb-4 max-sm:mb-0"  loading='lazy'/>
            <div className='flex justify-between items-center'>
                <h2 className="text-lg font-semibold mb-2 max-sm:mb-0 max-sm:text-[15px]">{product.name}</h2>
                <span className='md:hidden flex items-center gap-0.5 text-yellow-500 text-[12px]'>★{product.starRating}</span>
            </div>
            <div className="flex items-center justify-between mb-2 max-sm:mb-0">
                <div>
                    <span className="text-yellow-500 mr-1 max-sm:hidden">★</span>
                    <span className="text-yellow-500 max-sm:hidden">{product.starRating}</span>
                    <span className="text-gray-600 text-xs ml-2 max-sm:hidden">({product.votes ?? 0} votes)</span>
                    <span className="text-gray-600 md:hidden max-sm:absolute max-sm:top-[15px] max-sm:left-[9px] max-sm:text-[10px]">{convertVotesToText(product.votes)??0} votes</span>
                </div>
                <div className='max-sm:absolute max-sm:top-[15px] max-sm:right-[8px]'>
                    <HeartRating fillPercentage={product.likes ?? 0} className={'ml-2 text-gray-500 text-sm max-sm:ml-1'} width={'1rem'} />
                </div>
            </div>
        </a>
    );
};

export default ProductCard;
