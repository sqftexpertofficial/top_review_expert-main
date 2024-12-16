"use client";
import React, { useState } from 'react';
import { Button, Modal } from 'antd';

const FilterComp = ({categories,isOpen,handleCancel, onFilterCategory, currentFilter}) => {
  return (
      <>
    <div className="w-1/4 pr-8 max-sm:hidden">
    {/* Add your filters and attributes UI here */}
    <h2 className="text-lg font-semibold mb-4">Filters</h2>
            <h3 className="text-md font-medium mb-2">Categories</h3>
            <ul>
                {categories?.map(category => (
                    <li key={category.id}>
                        <button onClick={() => onFilterCategory(category)}   className={`hover:text-blue-500 focus:outline-none ${category.id === currentFilter.category ? 'text-[#22c55d]' : ''}`}>{category.name}</button>
                    </li>
                ))}
            </ul>
</div>
    <Modal title="Apply Filter" open={isOpen} footer={false} onCancel={handleCancel}>
    <h3 className="text-md font-medium mb-2">Categories</h3>
            <ul>
                {categories?.map(category => (
                    <li key={category.id}>
                        <button onClick={() => onFilterCategory(category)} className={`hover:text-blue-500 focus:outline-none ${category.id === currentFilter.category ? 'text-[#22c55d]' : ''}`}>{category.name}</button>
                    </li>
                ))}
            </ul>
      </Modal>
      </>
  );
};

export default FilterComp;
