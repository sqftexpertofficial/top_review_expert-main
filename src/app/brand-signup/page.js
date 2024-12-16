import OwnerLandingPage from "@/components/OwnerLandingPage";
import Footer from '@/components/Footer';
import { Layout } from "antd";

const BusinessLandingPage = () =>{
    return (
        <Layout className="h-full">
            <OwnerLandingPage />
            <Footer/>
        </Layout>
    )
}

export default BusinessLandingPage