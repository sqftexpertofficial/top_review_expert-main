"use client"
import React, { useState } from 'react';
import Search from '@/components/Search';
import { searchProducts } from '@/services';
import { debounce } from '@/utils';

const SearchContainer = () => {
  const [options, setOptions] = useState([]);
  const [onSearchLoading, setOnSearchLoading] = useState(false);

  const renderCategoryTitle = (title, slug) => (
    <div>
      {title}
      <a
        style={{ float: 'right' }}
        href={`/product-list?category=${slug}`}
        rel="noopener noreferrer"
      >
        more
      </a>
    </div>
  );

  const renderProductItem = (title, slug) => ({
    value: title,
    label: (
      <a
        href={`/companies/${slug}`}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        {title}
      </a>
    ),
  });

  const handleSearch = async (text) => {
    if (text === '') {
      setOptions([]);
      return;
    }
    setOnSearchLoading(true);
    try {
      let res = await searchProducts(text);
      const categoryOptions = res.categories.map((category) => ({
        label: renderCategoryTitle(category.name, category.id),
        options: res.products
          .filter((product) => product.categoryId === category.id)
          .map((product) => renderProductItem(product.name, product.slug)),
      }));
      const productOptions = res.products.map((product) =>
        renderProductItem(product.name, product.slug)
      );
      setOptions([...categoryOptions, ...productOptions]);
    } catch (err) {
      console.log(err);
    }
    setOnSearchLoading(false);
  };

  const debouncedSearch = debounce(handleSearch, 500);

  return (
    <Search styling='rounded-3xl' onSearch={debouncedSearch} options={options} onSearchLoading={onSearchLoading} placeholder='Search for products, brands, services and more...'/>
  );
};

export default SearchContainer;
