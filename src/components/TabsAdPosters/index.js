// components/TabsAdPosters.js
import React from 'react';

const TabsAdPosters = ({ tabs, adPosters }) => {
    return (
        <div className="flex flex-col">
            {adPosters && adPosters.map((ad, index) => (
                <div key={index} className="mb-4">
                    <img src={ad.image} alt={ad.alt} className="w-full h-auto" />
                </div>
            ))}
        </div>
    );
};

export default TabsAdPosters;
