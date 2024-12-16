// components/Specifications.js
import React from 'react';

const Specifications = ({ sections, containerId,name }) => {
    return (
        <div id={containerId} className='border-b pb-4'>
            <h3 className="text-2xl font-bold mb-4 max-sm:text-[14px] max-sm:mb-0">{name} Specifications</h3>
            {sections.map((section, index) => (
                <div key={index} className="pb-2 max-sm:text-[12px]">
                    <h3 className="text-lg font-md mb-2 bg-gray-200 p-2">{section.title}</h3>
                    <div className="flex flex-col mb-2">
                        {section.fields.map((field, fieldIndex) => (
                            <div key={fieldIndex} className={`flex p-2 py-1 ${fieldIndex % 2 === 0 ? "bg-gray-00" : "bg-gray-50"}`}>
                                <span className=" w-1/2">{field.title}:</span>
                                <span className='w-1/2'>{field.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
            {sections && sections.length === 0 && (
                <div className=" text-gray-600 p-4 max-sm:text-[12px]">
                    No Specifications available at the moment.
                </div>
            )}
        </div>
    );
};

export default Specifications;
