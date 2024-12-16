"use client"
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductsList from '../../components/ProductsList';
import CustomPagination from '../../components/Pagination';
import Breadcrumb from '@/components/Breadcrumb';
import Header from '@/components/Header';
import { getProductList } from "@/services";
import { FilterTwoTone } from '@ant-design/icons';
import { Empty, Spin } from 'antd';
import FilterComp from '../FilterComp';
import { useRouter } from 'next/navigation';

const ProductList = ({ initialProducts, categories }) => {
    if (!initialProducts?.rows) {
        return 'something went wrong..';
    }

    const [currentPage, setCurrentPage] = useState(null);
    const [isFilterOpen, setFilterStatus] = useState(false);
    const [isProductApiLoading, setProductApiLoading] = useState(false);
    const productsPerPage = 20;
    const [products, setProducts] = useState([...initialProducts.rows]);
    const [totalProducts, setTotalProducts] = useState(initialProducts.count);
    const searchParams = useSearchParams();
    const category = searchParams.get('category');
    const [currentFilter, setCurrentFilter] = useState({ category: category });
    const router = useRouter();

    const getProducts = async () => {
        try {
            setProductApiLoading(true);
            let res = await getProductList({
                offset: !currentPage ? 1 : (currentPage - 1) * productsPerPage,
                limit: productsPerPage,
                categoryId: currentFilter.category
            });
            setProducts(res.rows);
            setTotalProducts(res.count);
        } catch (e) {
            console.log(e);
        }
        setProductApiLoading(false);
    };

    useEffect(() => {
        if (currentPage !== null) {
            getProducts();
        }
    }, [currentPage, currentFilter.category]);

    const breadcrumbItems = ['Home', 'Product Reviews'];
    const paginate = pageNumber => setCurrentPage(pageNumber);

    const handleFilter = () => {
        setFilterStatus(!isFilterOpen);
    };

    const onFilterCategory = (value) => {
        router.push(`/product-list?category=${value.id}`, { scroll: false });
        setCurrentFilter({
            ...currentFilter,
            category: value.id
        });
        setCurrentPage(1);
        setFilterStatus(false);
    };

    return (
        <div className='min-h-screen'>
            <Header />
            <div className="container mx-auto py-4">
                <div className='max-sm:pl-4'><Breadcrumb items={breadcrumbItems} /></div>
                <div className="flex flex-col md:flex-row">
                    {/* Filters and attributes */}
                    <FilterComp isOpen={isFilterOpen} categories={categories} handleCancel={handleFilter} onFilterCategory={onFilterCategory} currentFilter={currentFilter} />

                    {/* Product list */}
                    <div className="md:w-3/4 w-full relative">
                        {/* Product list UI */}
                        <h1 className="text-2xl font-semibold mb-4 max-sm:pl-4">Product List</h1>
                        <div className='flex items-center gap-2 absolute top-4 right-4 md:hidden' onClick={handleFilter}>
                            <FilterTwoTone /> Filters
                        </div>
                        {isProductApiLoading && <Spin />}
                        {products.length === 0 && !isProductApiLoading && <Empty />}
                        {products.length !== 0 && !isProductApiLoading && (
                            <>
                                <ProductsList products={products} />

                                {/* Pagination */}
                                <CustomPagination
                                    productsPerPage={productsPerPage}
                                    totalProducts={totalProducts}
                                    paginate={paginate}
                                    currentPage={currentPage}
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductList;
