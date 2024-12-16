"use client";
import React, { useEffect, useState } from "react";
import { Input, Button, message, Spin, ConfigProvider } from "antd";
import { fetchCompanyDataById, submitReview } from "@/services";
import { useRouter } from "next/navigation"; // Import useRouter
import "./index.css";
import StarRatings from "react-star-ratings";

const Reviewus = ({ businessId, contactQuery, nameQuery }) => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [thoughts, setThoughts] = useState("");
  const [starRating, setStarRating] = useState(0);
  const [productCompanyData, setProductCompanyData] = useState({});
  const [formErrors, setFormErrors] = useState({
    name: "",
    contactNumber: "",
    thoughts: "",
    starRating: "",
    feedbackQuestions: "",
  });
  const [loading, setLoading] = useState(true);
  const [feedbackAnswers, setFeedbackAnswers] = useState([]);
  const [step, setStep] = useState(1); // Step to manage the flow (1: Rating, 2: Feedback Questions, 3: Name & Phone)

  // Regex for validating contact number
  const phoneRegex = /^[0-9]{10}$/;

  // Validate the form inputs
  const validateForm = () => {
    let temp = {};
    let errors = {
      name: name ? "" : "Please enter your name.",
      contactNumber: phoneRegex.test(contactNumber)
        ? "" // If the phone number is valid
        : "Please enter a valid 10-digit contact number.",
      starRating: starRating ? "" : "Please rate the restaurant.",
    };

    // Validate feedback questions if the rating is between 1 and 3 stars
    if (starRating > 0 && starRating <= 3) {
      const missingFeedbackAnswers =
        productCompanyData?.feedbackQuestions?.some((question) => {
          return !feedbackAnswers.find(
            (answer) => answer.questionId === question.id
          );
        });

      if (missingFeedbackAnswers) {
        temp.feedbackQuestions = "Please answer all the feedback questions.";
        setFormErrors(temp);
      } else {
        temp.feedbackQuestions = "";
        setFormErrors(temp);
        return true;
      }
    } else {
      setFormErrors(errors);
      return !Object.values(errors).some((error) => error);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e?.preventDefault();

    // Prepare data to send to backend
    const payload = {
      mobileNo: contactNumber,
      name: name,
      starRating: starRating,
      description: thoughts,
      productCompanyId: productCompanyData?.productCompany?.id,
      answers: feedbackAnswers.length > 0 ? feedbackAnswers : undefined, // Include answers only if there are any
    };

    try {
      await submitReview(payload);
      setStep(4); // After submission, show the thank you message
      message.success("Review submitted successfully!");

      // If the rating is greater than 4, redirect to Google Review page
      if (starRating >= 4 && productCompanyData?.productCompany?.gReviewUrl) {
        const reviewUrl = productCompanyData.productCompany.gReviewUrl;
        openLink(reviewUrl);
      }
    } catch (error) {
      message.error("Failed to submit review. Please try again.");
    } finally {
      // Reset form state after submission
      setName("");
      setContactNumber("");
      setThoughts("");
      setStarRating(0);
      setFeedbackAnswers([]);
    }
  };

  // Fetch product company data using the businessId from query params
  const getProductCompany = async (businessId) => {
    if (!businessId) {
      message.error("Business ID is required.");
      router.push("/"); // Redirect to home if no businessId is present
      return;
    }

    try {
      setLoading(true); // Start loading when API call begins
      let res = await fetchCompanyDataById(businessId); // Pass the businessId from the query

      if (!res || Object.keys(res)?.length === 0) {
        message.warning("No company data found. Redirecting to home.");
        router.push("/"); // Redirect to home if no company data is found
        return;
      }

      setProductCompanyData(res);
    } catch (e) {
      router.push("/"); // Redirect to home on error
    } finally {
      setLoading(false);
    }
  };

  // Fetch product company data once the businessId is set
  useEffect(() => {
    if (businessId) {
      getProductCompany(businessId); // Fetch company data when businessId is available
    }
  }, [businessId]); // Trigger only when businessId changes

  // Handle change in answers for additional questions
  const handleAnswerChange = (questionId, value) => {
    setFeedbackAnswers((prevAnswers) => {
      const existingAnswer = prevAnswers.find(
        (answer) => answer.questionId === questionId
      );
      if (existingAnswer) {
        // Update existing answer
        return prevAnswers.map((answer) =>
          answer.questionId === questionId
            ? { ...answer, answerValue: value }
            : answer
        );
      } else {
        // Add new answer
        return [...prevAnswers, { questionId, answerValue: value }];
      }
    });
  };

  function openLink(url) {
    setTimeout(() => {
      window.open(url, "_blank");
    }, 0);
  }

  const upiId = productCompanyData?.productCompany?.upiId
  const paymentLinks = {
    gpay: `upi://pay?pa=${upiId}`,
    phonepe: `upi://pay?pa=${upiId}`,
    paytm: `upi://pay?pa=${upiId}@paytm`,
    bhim: `upi://pay?pa=${upiId}`,
  };
  const handlePaymentClick = (paymentMethod) => {
    const url = paymentLinks[paymentMethod];
    if (!url) {
      console.log("Invalid payment method.");
      return;
    }
    // Check if the device is mobile (Android or iOS)
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    let payUrl = null;
    if (isMobile) {
      if (paymentMethod === "gpay") {
        // Explicitly target Google Pay on Android
        payUrl = `tez://upi/pay?pa=${upiId}&cu=INR`;
      } else if (paymentMethod === "phonepe") {
        // Explicitly target PhonePe on Android
        payUrl = `phonepe://pay?pa=${upiId}&cu=INR`;
      } else if (paymentMethod === "paytm") {
        // Explicitly target Paytm on Android
        payUrl = `paytmmp://pay?pa=${upiId}&cu=INR`;
      } else {
        // Fallback to the generic UPI deep link for BHIM or any other method
        payUrl = `upi://pay?pa=${upiId}&cu=INR`;
      }

      setTimeout(() => {
        window.open(payUrl, "_blank");
      }, 1000);
    } else {
      window.open(url, "_blank");
    }
  };
  useEffect(() => {
    if (!!contactQuery && !!nameQuery) {
      setName(nameQuery);
      setContactNumber(contactQuery);
    }
  }, [contactQuery, nameQuery]);

  const moveNextBasedOnContact = () => {
    if (!!name && !!contactNumber) {
      if (!!contactQuery && !!nameQuery) {
        handleSubmit();
      }
    } else {
      setStep(3);
      return null;
    }
  };

  useEffect(() => {
    if (starRating !== 0) {
      // Check if both nameQuery and contactQuery exist
      if (contactQuery && nameQuery) {
        // If starRating is 3 or less, show feedback questions (step 2)
        if (starRating <= 3) {
          setStep(2);
        } else {
          // If starRating is greater than 3, proceed based on contact details
          moveNextBasedOnContact();
        }
      } else {
        // If no contactQuery or nameQuery is present
        if (starRating >= 4) {
          setStep(3); // Go to name & phone step (step 3)
        } else {
          setStep(2); // Go to feedback questions (step 2)
        }
      }
    }
  }, [starRating]);

  return (
    <ConfigProvider
      theme={{
        components: {
          Rate: {
            colorFillContent: "#acd3fa",
          },
        },
      }}
    >
      <div className="flex flex-col md:items-center justify-center h-screen md:bg-gray-100 overflow-y-auto review-us overflow-y-auto sm:scrolling-touch sm:scrollbar-thin sm:scrollbar-thumb-gray-300 bg-[#0b84ff]">
        <div className="containers w-full max-w-lg h-[25%]">
          <div className="logo">
            <div className="flex items-center justify-center">
              <img
                src={"/logo.png"}
                alt="logo-icon"
                className="h-[63px] max-sm:h-[63px] w-[200px] mb-4"
              />
            </div>
          </div>
          <div className="curve">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1440 320"
              preserveAspectRatio="none"
            >
              <path
                d="M0,0 C230,100 900,240 1440,160 L1440,320 L0,320 Z"
                fill="#0056b3"
              />
            </svg>
            {!loading && (
              <div className="title-wrapper uppercase">
                {" "}
                <div className="title truncate">
                  {productCompanyData.productCompany?.name}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="relative h-[75%] p-10 bg-[#0b84ff] text-[#ffffff] md:shadow-md w-full max-w-lg">
          {loading ? (
            <div className="flex justify-center">
              <Spin size="large" />
            </div>
          ) : (
            <>
              <div className="absolute left-[50%] top-[50%] bg-transparent shadow-[0_0_100px_40px_rgba(255,255,255,0.6)] rounded-full pb-4" />
              {step === 1 && (
                <div className="flex justify-center mb-3">
                  <img src={"restaurant.png"} width={"20%"} />
                </div>
              )}
              {[1, 2].includes(step) && (
                <div className="text-center mb-2 text-xl font-medium">
                  How was your experience?
                </div>
              )}
              <form onSubmit={handleSubmit}>
                {/* Show rating and automatically move to next step */}
                {step === 1 && (
                  <>
                    <div className="my-8 text-center">
                      <StarRatings
                        rating={starRating}
                        starRatedColor="yellow"
                        starHoverColor="yellow"
                        changeRating={(value) => {
                          setStarRating(value);
                        }}
                        className={"text-lg"}
                        starDimension="35"
                      />
                      {formErrors.starRating && (
                        <div className="text-red-500 text-sm mt-2">
                          {formErrors.starRating}
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* Show feedback questions for ratings between 1-3 */}
                {starRating <= 3 && step === 2 && (
                  <>
                    <div className="flex justify-center">
                      <StarRatings
                        starDimension="30"
                        starRatedColor="yellow"
                        starHoverColor="yellow"
                        disabled={starRating >= 4}
                        changeRating={(value) => {
                          setStarRating(value);
                        }}
                        rating={starRating}
                      />
                    </div>

                    <div className="my-4">
                      {productCompanyData?.feedbackQuestions?.map(
                        (question) => (
                          <div key={question.id} className="mb-2">
                            <label className="block mb-2 text-sm">
                              {question.questionText}
                            </label>
                            <StarRatings
                              starRatedColor="yellow"
                              starHoverColor="yellow"
                              starDimension="25"
                              changeRating={(value) =>
                                handleAnswerChange(question.id, value)
                              }
                              rating={
                                feedbackAnswers.find(
                                  (answer) => answer.questionId === question.id
                                )?.answerValue || 0
                              }
                            />
                          </div>
                        )
                      )}
                      {formErrors.feedbackQuestions && (
                        <div className="text-red-500 text-sm mt-2">
                          {formErrors.feedbackQuestions}
                        </div>
                      )}
                    </div>

                    {/* Thoughts Section (non-mandatory) */}
                    <div className="mb-4">
                      <label className="block mb-2 text-sm font-medium">
                        Enter Your Thoughts
                      </label>
                      <Input.TextArea
                        value={thoughts}
                        onChange={(e) => setThoughts(e.target.value)}
                        placeholder="Enter your thoughts"
                      />
                    </div>

                    {/* Next Button for Feedback Questions */}
                    <div className="flex justify-center mt-4">
                      <Button
                        type="primary"
                        onClick={() => {
                          if (validateForm()) {
                            moveNextBasedOnContact();
                          } else {
                            message.error("Please answer all the questions.");
                          }
                        }}
                      >
                        Next
                      </Button>
                    </div>
                  </>
                )}

                {/* Show name and contact for all ratings */}
                {step === 3 && (
                  <>
                    <div className="mb-4">
                      <label className="block mb-2 text-sm font-medium">
                        Name
                      </label>
                      <Input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        required
                      />
                      {formErrors.name && (
                        <div className="text-red-500 text-sm mt-2">
                          {formErrors.name}
                        </div>
                      )}
                    </div>

                    <div className="mb-4">
                      <label className="block mb-2 text-sm font-medium">
                        Contact Number
                      </label>
                      <Input
                        type="tel"
                        value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value)}
                        placeholder="Enter your contact number"
                        required
                      />
                      {formErrors.contactNumber && (
                        <div className="text-red-500 text-sm mt-2">
                          {formErrors.contactNumber}
                        </div>
                      )}
                    </div>
                  </>
                )}

                {step === 3 && (
                  <div className={`flex justify-center`}>
                    <Button type="primary" htmlType="submit">
                      Submit
                    </Button>
                  </div>
                )}
              </form>
              {step === 4 && (
                <div className="flex flex-col justify-center text-center align-center">
                  <div className="flex items-center justify-center">
                    <img src="/starIcon.png" width={"300px"} />
                  </div>
                  <div>Thank you for your feedback.</div>
                  <div>It helps us improve and serve you better</div>
                  {productCompanyData?.productCompany?.upiId && (
                    <div className="mt-5">
                      <div className="text-sm text-white mb-6">
                        Select your payment method
                      </div>
                      <div className="text-xs text-white mb-3 text-left">
                        Select your UPI app
                      </div>
                      <div className="flex justify-evenly">
                        <div
                          onClick={() => handlePaymentClick("gpay")}
                          className="flex align-center justify-center bg-white p-2 rounded"
                        >
                          <img src="/gPay.png" width={"80px"} height={"60px"} />
                        </div>
                        <div
                          onClick={() => handlePaymentClick("phonepe")}
                          className="flex align-center justify-center bg-white p-2 rounded"
                        >
                          <img
                            src="/PhonePe.png"
                            width={"80px"}
                            height={"60px"}
                          />
                        </div>
                      </div>
                      <div className="flex justify-evenly mt-2">
                        <div
                          onClick={() => handlePaymentClick("paytm")}
                          className="flex align-center justify-center bg-white p-2 rounded"
                        >
                          <img
                            src="/Paytm.png"
                            width={"80px"}
                            height={"60px"}
                          />
                        </div>
                        <div
                          onClick={() => handlePaymentClick("bhim")}
                          className="flex align-center justify-center bg-white p-2 rounded"
                        >
                          <img src="/Bhim.png" width={"80px"} height={"60px"} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </ConfigProvider>
  );
};

export default Reviewus;
