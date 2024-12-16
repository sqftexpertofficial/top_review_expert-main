import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { privacyPolicy } from "@/constants.js/privacy-policy";

const PrivacyPolicy = () => {
  return (
    <div >
       <div className="fixed top-0 left-0 right-0 z-10 shadow-md">
      <Header  />
      </div>
      <div
         className="flex-1 md:w-[60%] w-full m-auto p-10 pt-24 border overflow-y-auto"
        dangerouslySetInnerHTML={{
          __html: privacyPolicy
        }}
      ></div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
