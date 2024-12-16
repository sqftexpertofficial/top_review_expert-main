import SearchContainer from "@/components/SearchContainer";

const HomeFirstSection = () => {
  return (
    <div className="wrapper h-[27rem] max-sm:h-[14rem] p-7 pt-12"
    style={{
      backgroundImage:"url('/banner.jpg')",
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat'
    }}
    >
      <div className="my-auto md:mx-[20%] max-sm:flex flex items-center justify-center flex-col">
        <div className="text-4xl max-sm:text-xl text-[51px] font-bold text-white">
            India's TOP REVIEW Platform
        </div>
        <div className="mt-8 max-sm:mt-4 font-medium text-lg max-sm:text-sm max-sm:w-[80%] max-sm:text-center text-white">
          Millions of unbiased reviews. <span className="px-[7px] py-[12px] max-sm:pt-[1px] max-sm:pb-[5px] bg-[#020202ad]">Trusted by 700 Million+ users.</span>
        </div>
        <div className="mt-7 w-full flex items-center justify-center">
          <SearchContainer />
        </div>
      </div>
    </div>
  );
};

export default HomeFirstSection;
