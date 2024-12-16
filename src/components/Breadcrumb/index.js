// components/Breadcrumb.js
import React from 'react';

const Breadcrumb = ({ items, handleRedirection=()=>{} }) => {
    return (
        <div className="text-sm text-gray-600 mb-4 max-sm:text-[11px]">
            {items.map((item, index) => (
                <span key={index} onClick={()=>handleRedirection(item)}>
                    {item}
                    {index < items.length - 1 && <span className="mx-2">&gt;</span>}
                </span>
            ))}
        </div>
    );
};

export default Breadcrumb;
