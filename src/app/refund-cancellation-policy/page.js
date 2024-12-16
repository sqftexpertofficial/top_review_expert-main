import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { refundPolicy } from "@/constants.js/refund-policy";

const RefundCancellation = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-10 shadow-md">
      <Header  />
      </div>
      
      {/* Main content area */}
      <div
        className="flex-1 md:w-[60%] w-full m-auto p-10 pt-24 border overflow-y-auto"
        dangerouslySetInnerHTML={{
          __html: refundPolicy
        }}
      ></div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default RefundCancellation;
