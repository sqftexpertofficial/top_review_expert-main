import Footer from "@/components/Footer";
import ProductList from "@/components/ProductList/ProductList";
import { getCategoryList, getProductList } from "@/services"
import Head from 'next/head'

const getProducts = async (category) => {
    try {
        let res = await getProductList({
            offset: 0,
            limit: 20,
            categoryId: category
        })
        return {
            rows: res?.rows,
            count: res?.count
        }
    } catch (e) {
        console.log(e)
    }
}


const Products = async (params) => {
    let category = params?.searchParams?.category
    let categories = await getCategoryList()
    let products = await getProducts(category)


    return (
        <>
            <Head>

                <title>
                    Top Review Expert Product List
                </title>
                {/* {data?.metaDescription && <meta name="description" content={data?.metaDescription} />} */}
                <link rel="canonical" href={"https://topreview.expert/product-list"} />
            </Head>
            <ProductList initialProducts={products} categories={categories} />
            <Footer />
        </>
    );
};

export default Products;
