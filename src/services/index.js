import instance from "./axiosConfig";

function handleError(error) {
  console.error("Error:", error);
  throw error.response.data;
}

export function searchProducts(searchText) {
  return instance
    .get("/productCompanies/search", {
      params: { query: searchText },
    })
    .then((response) => response?.data)
    .catch(handleError);
}

export async function getCategoryList() {
  try {
    const response = await instance.get("/categories", {
      headers: { "Cache-Control": "no-store" },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

export async function getProductList(params) {
  try {
    const response = await instance.get("/productCompanies/product-company", {
      params,
      headers: { "Cache-Control": "no-store" },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

export function register(params) {
  return instance
    .post("/users/signup", params)
    .then((response) => response?.data)
    .catch(handleError);
}

export function login(params) {
  return instance
    .post("/users/login", params)
    .then((response) => response?.data)
    .catch(handleError);
}

export function googleLogin(params) {
  return instance
    .post("/users/google-login", params)
    .then((response) => response?.data)
    .catch(handleError);
}

export function getUserData() {
  return instance
    .get("/users/me", { withCredentials: true })
    .then((response) => response?.data)
    .catch(handleError);
}

export function getCarouselData() {
  return instance
    .get("/main/homepage-carousel", {})
    .then((response) => response?.data?.carousels)
    .catch(handleError);
}

export function getReviewByCompany(id, limit, offset) {
  return instance
    .get(`/reviews/productCompany/${id}?limit=${limit}&offset=${offset}`)
    .then((response) => response.data)
    .catch(handleError);
}

export function fetchCompanyData(slug) {
  return instance
    .get(`/productCompanies/product-company/${slug}`)
    .then((response) => response.data)
    .catch(handleError);
}

export function addReviewByCompany(params) {
  return instance
    .post(`/reviews`, params)
    .then((response) => response.data)
    .catch(handleError);
}

export function getReviewByProfile(session) {
  return instance
    .get(`/reviews/`, {
      headers: {
        Authorization: `Bearer ${session}`,
      },
    })
    .then((response) => response.data)
    .catch(handleError);
}

export function uploadImage(formData) {
  return instance
    .post("/photos/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => response.data)
    .catch(handleError);
}

export function uploadPhotos(params) {
  return instance
    .post("/photos", params)
    .then((response) => response.data)
    .catch(handleError);
}

export function getPhotos(id) {
  return instance
    .get(`/photos/product/${id}`)
    .then((response) => response.data)
    .catch(handleError);
}

export function getFollowing(limit,offset) {
  return instance
    .get(`/follow/following?limit=${limit}&offset=${offset}`)
    .then((response) => response.data)
    .catch(handleError);
}


export function updateFollow(id, type='follow') {
  return instance
  .post(`/follow/product-company/${id}/${type}`)
  .then((response) => response.data)
  .catch(handleError);
} 

export function getFollowingStatus(id) {
  return instance
    .get(`/follow/${id}/status`)
    .then((response) => response.data)
    .catch(handleError);
}


export function fetchAllUsers(params) {
  const {pagination} = params
  return instance
    .get(`/api/admin/users?offset=${pagination.page}&limit=${pagination.size}&search=${params.search}&status=${params.status}`)
    .then((response) => response.data)
    .catch(handleError);
}

export function fetchProductCompanies(params) {
  return instance
    .get(`/api/productCompanies`, params)
    .then((response) => response.data)
    .catch(handleError);
}


export function fetchByUserId(id) {
  return instance
    .get(`/api/admin/users/${id}`)
    .then((response) => response.data)
    .catch(handleError);
}

export function updateUser(id, params) {
  return instance
    .put(`/api/admin/users/${id}`,params)
    .then((response) => response.data)
    .catch(handleError);
}

export function deleteUser(id, isActive) {
  return instance
    .put(`/api/admin/users/${id}/status`,{status:!isActive?'active':'inactive'})
    .then((response) => response.data)
    .catch(handleError);
}

export function addUser(params) {
  return instance
    .post(`/api/admin/users`, params)
    .then((response) => response.data)
    .catch(handleError);
}

 export function fetchAllCategories({pagination}) {
  return instance
    .get(`/api/categories?offset=${pagination.page}&limit=${pagination.size}`)
    .then((response) => response.data)
    .catch(handleError);
}

export function addCategory(params) {
  return instance
    .post(`/api/categories`, params)
    .then((response) => response.data)
    .catch(handleError);
}

export function updateCategory(categoryId, params) {
  return instance
    .put(`/api/categories/${categoryId}`,params)
    .then((response) => response.data)
    .catch(handleError);
}

export function deleteCategory(categoryId) {
  return instance
    .delete(`/api/categories/${categoryId}`)
    .then((response) => response.data)
    .catch(handleError);
}

export function fetchAllProductCompanies({pagination, filter}) {
  return instance
    .get(`/api/productCompanies`,{
      params:{
        offset: pagination.page,
        limit: pagination.size,
        search: filter.name || "",
        categoryId: filter.categoryId
      }
    })
    .then((response) => response.data)
    .catch(handleError);
}

export function addProductCompany(params) {
  return instance
    .post(`/api/productCompanies`, params)
    .then((response) => response.data)
    .catch(handleError);
}

export function updateProductCompany(companyId,params) {
  return instance
    .put(`/api/productCompanies/${companyId}`, params)
    .then((response) => response.data)
    .catch(handleError);
}

export function deleteProductCompany(id) {
  return instance
    .delete(`/api/productCompanies/${id}`)
    .then((response) => response.data)
    .catch(handleError);
}

export function fetchReviews({ pagination, companyId, isUser }) {
  const params = {
    offset: pagination.page,
    limit: pagination.size,
  };
  if (isUser) {
    params.userId = companyId;
  } else {
    params.productCompanyId = companyId;
  }

  return instance
    .get(`/api/reviews`, {
      params,
    })
    .then((response) => response.data)
    .catch(handleError);
}

export function addReview(params) {
  return instance
    .post(`/api/reviews`, params)
    .then((response) => response.data)
    .catch(handleError);
}

export function deleteReview(id) {
  return instance
    .delete(`/api/reviews/${id}`)
    .then((response) => response.data)
    .catch(handleError);
}

export function uploadImages(formData) {
  return instance
    .post("/photos/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => response.data)
    .catch(handleError);
}

export function uploadCSV(formData) {
  return instance
    .post("/api/productCompanies/bulk-upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => response.data)
    .catch(handleError);
}

export function submitBusinessRequest(params) {
  return instance
    .post(`/api/business/businessRequest`, params)
    .then((response) => response.data)
    .catch(handleError);
}

export function getAllBusinessRequests(params) {
  return instance
    .get(`/api/business/businessRequest`, {
      params,
    })
    .then((response) => response.data)
    .catch(handleError);
}

export function updateBusinessRequestStatus(id,params) {
  return instance
    .put(`/api/business/businessRequest/${id}/status`,params)
    .then((response) => response.data)
    .catch(handleError);
}

export function getAllUniqueReferrers() {
  return instance
    .get(`/api/business/businessRequest/unique-referrers`)
    .then((response) => response.data)
    .catch(handleError);
}

export function submitReview(params) {
  return instance
    .post(`/api/business/feedback`,params)
    .then((response) => response.data)
    .catch(handleError);
}


export function fetchCompanyDataById(id) {
  return instance
    .get(`/api/business/productCompanies/details-with-questions/${id}`)
    .then((response) => response.data)
    .catch(handleError);
}

export function fetchLatestFeedbackData(params) {
  return instance
    .get(`/api/business/feedback/latest-feedback-users`, {params})
    .then((response) => response.data)
    .catch(handleError);
}

export function fetchFeedbackDataByUser(params) {
  return instance
    .get(`/api/business/feedback/user-feedback`, {params})
    .then((response) => response.data)
    .catch(handleError);
}

export function resolveIssue(params) {
  return instance
    .put(`/api/business/feedback/rectify-feedback`, params)
    .then((response) => response.data)
    .catch(handleError);
}

export function fetchFAQs(productCompanyId, isBusiness, params) {
  return instance
    .get(isBusiness?`/api/business/faqs?productCompanyId=${productCompanyId}`:`/api/faqs?productCompanyId=${productCompanyId}`,{params})
    .then((response) => response.data)
    .catch(handleError);
}

export function createFAQ(params, isBusiness) {
  return instance
    .post(isBusiness?`/api/business/faqs`:`/api/faqs`, params)
    .then((response) => response.data)
    .catch(handleError);
}


export function updateFAQ(id,params, isBusiness) {
  return instance
    .put(isBusiness?`/api/business/faqs/${id}`: `/api/faqs/${id}`,params)
    .then((response) => response.data)
    .catch(handleError);
}

export function deleteFAQ(id, isBusiness) {
  return instance
    .delete(isBusiness?`/api/business/faqs/${id}`:`/api/faqs/${id}`)
    .then((response) => response.data)
    .catch(handleError);
}

export function updateBusinessData(productCompanyId,params) {
  return instance
    .put(`/api/business/productCompanies/${productCompanyId}?productCompanyId=${productCompanyId}`,params)
    .then((response) => response.data)
    .catch(handleError);
}

export function getDashboardData(params) {
  return instance
    .get(`/api/business/dashboard?&productCompanyId=${params.productCompanyId}`,{params})
    .then((response) => response.data)
    .catch(handleError);
}


export function getReviewAnalytics(params) {
  return instance
    .get(`/api/business/review-analytics/${params.productCompanyId}`,{params})
    .then((response) => response.data)
    .catch(handleError);
}


