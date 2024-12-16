import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import CompanyReview from '../../../components/CompanyReview';
import { fetchCompanyData, getReviewByCompany } from "@/services"

export async function generateMetadata({ params }) {
  const { slug } = params;
  const data = await fetchCompanyData(slug);
  return {
    title: data?.metaTitle,
    description: data?.metaDescription,
    alternates: {
      canonical: `https://topreview.expert/companies/${slug}`,
    },
  };
}

const Home = async ({ params }) => {
  try {
    const data = await fetchCompanyData(params.slug);
    const reviews = await getReviewByCompany(data.id, 10, 0);

    return (
      <div>
        <Header />
        <CompanyReview data={data} reviews={reviews} />
        <Footer />
      </div>
    );
  } catch (error) {
    console.error('Error fetching data:', error);
    return (
      <div>
        <Header />
        <p>An error occurred while fetching the data. Please try again later.</p>
        <Footer />
      </div>
    );
  }
};

export default Home;