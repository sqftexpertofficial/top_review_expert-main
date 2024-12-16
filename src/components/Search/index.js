"use client";
import { AutoComplete } from "antd";
const Search = ({onSearch, options, onSearchLoading,placeholder='Enter', styling='rounded-md'}) => {
  
  return (
    <AutoComplete
      popupClassName="certain-category-search-dropdown"
      // popupMatchSelectWidth={250}
      dropdownMatchSelectWidth={true}
      className={`md:w-[80%] max-sm:w-full ${styling}`}
      options={options}
      onSearch={(text) => onSearch(text)}
      load
      size="large"
      placeholder={placeholder}
    >
      {/* <Input.Search loading={onSearchLoading} enterButton={false}/> */}
    </AutoComplete>
  );
};

export default Search;
