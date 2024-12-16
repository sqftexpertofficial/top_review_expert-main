"use client";
// components/Tabs.js
import React, { useState, useRef } from 'react';

const Tabs = ({ tabs, children }) => {
    const [activeTab, setActiveTab] = useState(tabs[0]);


    const handleTabClick = (tab) => {
        setActiveTab(tab);

        // Scroll the content of the active tab into view by using the element's ID
        const contentElement = document.getElementById(tab.id);
        if (contentElement) {
            contentElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="flex">
            {/* Tab buttons */}
            <div className="flex w-full max-sm:text-[14px]">
                {tabs.map((tab, index) => (
                    <div
                        key={"tab" + index}
                        className={`cursor-pointer border-b mb-2 p-2 flex-grow text-center ${activeTab.id === tab.id ? 'border-b-2 border-green-500 text-green-500' : 'border-gray-300 text-gray-700'}`}
                        onClick={() => handleTabClick(tab)}
                    >
                        {tab.name}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Tabs;
