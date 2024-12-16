import { getReviewByProfile } from "@/services"
import { cookies } from 'next/headers'
import CompanyReviews from "@/components/CompanyReviews"

const Reviews = async (req) => {
  const session = cookies().get('session')
  let reviews = []
  try {
    reviews = await getReviewByProfile(session.value ?? "")
  } catch (e) {
    return <div>Error fetching data</div>
  }
  return (
    <div>
      <CompanyReviews
        reviews={reviews ?? []}
        containerId={'userReviews'}
        reviewTitle={'Reviews'}
      />
    </div>
  )
}

export default Reviews