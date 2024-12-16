// components/QA.js
import React from 'react';

const QA = ({ faqs, containerId,name }) => {
    return (
        <div id={containerId} className='py-4'>
            {/* FAQ-style Questions and Answers */}
            <h3 className="text-2xl font-bold mb-4 max-sm:text-[14px] max-sm:mb-0">{name} Q&A</h3>
            {faqs && faqs.map((faq, index) => (
                <div key={index} className="mb-4">
                    <h3 className="text-lg font-bold max-sm:text-[13px]">{faq.question}</h3>
                    <p className='max-sm:text-[12px]'>{faq.answer}</p>
                </div>
            ))}
            {faqs && faqs.length === 0 && (
                <div className=" text-gray-600 p-4 max-sm:text-[12px]">
                    No FAQ's available
                </div>
            )}
        </div>
    );
};

export default QA;
