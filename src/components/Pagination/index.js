// components/Pagination.js

import React from 'react';
import { Pagination } from 'antd';

const CustomPagination = ({ productsPerPage, totalProducts, paginate, currentPage }) => {
    const handlePageChange = (pageNumber) => {
        paginate(pageNumber);
    };

    return (
        <div className="mt-8">
            <Pagination
                current={currentPage}
                pageSize={productsPerPage}
                total={totalProducts}
                onChange={handlePageChange}
                showSizeChanger={false}
                className='flex max-sm:justify-center'
            />
        </div>
    );
};

export default CustomPagination;
