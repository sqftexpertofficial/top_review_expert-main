import Header from "@/components/Header";
import HomeFirstSection from "@/components/HomeFirstSection";
import RecommendedCard from "@/components/RecommendedCard";
import ReviewerCard from "@/components/ReviewerCard";
import CustomCard from "@/components/CustomCard";
import {
  recommendedData,
  testimonialList,
  staticCardsList
} from "@/constants.js";
import SliderWrapper from "@/components/SliderWrapper";
import Footer from "@/components/Footer";
import CustomImgCard from "@/components/CustomImgCard";
import { Button } from 'antd';
import { getCategoryList, getCarouselData } from "@/services";

export default async function Page() {
  let carouselsData;
  let categoriesList;
  
  try {
    carouselsData = await getCarouselData();
    categoriesList = await getCategoryList();
  } catch (e) {
    return <div>Server down</div>;
  }

  return (
    <div>
      <Header />
      <HomeFirstSection />

      <div className="flex flex-col bg-[#faeddb40] mt-8 mx-auto rounded-md max-sm:mx-[2%] max-w-[1200px]">
        <div className="flex items-center justify-between p-4 w-full">
          <h2 className="text-[16px] max-sm:text-[12px] font-medium">Explore Categories</h2>
          <Button className="rounded-3xl border-[#4096ff] text-[#4096ff] bg-[#4096ff1f] max-sm:text-[10px]">
            <a href={'/product-list'}>View All</a>
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 p-4">
          {categoriesList.map(item => (
            <a
              key={item.id}
              href={`/product-list?category=${item.id}`}
              className="text-[12px] border border-solid border-[#00000017] w-full sm:w-[225px] h-[45px] bg-white truncate flex items-center rounded pl-4 cursor-pointer"
            >
              {item.name}
            </a>
          ))}
        </div>
      </div>

      <div className="my-auto mx-auto max-w-[1200px]">
        <div className="mt-8 mb-4 font-medium max-sm:ml-4">
          Recommended Top Articles
        </div>
        <SliderWrapper>
          {recommendedData?.map((el, index) => (
            <div key={index}>
              <RecommendedCard cardData={el} />
            </div>
          ))}
        </SliderWrapper>
      </div>

      <div className="mb-4 mt-8 mx-auto max-w-[1200px]">
        <SliderWrapper takeComponentWidthHeight={false} slideToShow={1} mobileSlideToShow={1} centerMode={false}>
          {staticCardsList?.map((el, index) => (
            <div key={index}>
              <CustomImgCard cardData={el} />
            </div>
          ))}
        </SliderWrapper>
      </div>

      <div className="my-auto mx-auto max-w-[1200px]">
        <div className="my-4 font-medium max-sm:ml-4">
          Users Testimonials
        </div>
        <SliderWrapper>
          {testimonialList?.map((el, index) => (
            <div key={index}>
              <ReviewerCard cardData={el} />
            </div>
          ))}
        </SliderWrapper>
      </div>

      {/* <div className="my-auto mx-auto max-w-[1200px]">
        <div className="my-4 font-medium">
          Running in Theatres/Upcoming Movies
        </div>
        <SliderWrapper>
          {upcomingMovies?.map((el, index) => (
            <div key={index}>
              <CustomCard cardData={el} />
            </div>
          ))}
        </SliderWrapper>
      </div> */}

      {carouselsData?.map((carouselRow, rowIndex) => (
        <div key={rowIndex} className="my-auto mx-auto max-w-[1200px]">
          <div className="my-4 font-medium max-sm:ml-4">
            {carouselRow.title}
          </div>
          <SliderWrapper>
            {carouselRow?.data?.map((carousel, index) => {
              const el = {
                title: carousel.name,
                imageURL: carousel.img,
                starRatingObj: {
                  rate: carousel.starRating,
                  votes: carousel.votes,
                },
                recommandationPercentage: "80",
                chipList: [carousel.category],
                redirectionLink: `/companies/${carousel.slug}`,
                datePlaceHolder: "Launch Date",
              };
              return (
                <div key={index}>
                  <CustomCard cardData={el} />
                </div>
              );
            })}
          </SliderWrapper>
        </div>
      ))}

      <div className="pt-5">
        <Footer />
      </div>
    </div>
  );
}
