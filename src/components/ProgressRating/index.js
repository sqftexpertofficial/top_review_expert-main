import React from "react";

const ProgressRating = ({ rating }) => {
  const getTrackStyle = (value) => {
    if (value <= 20) return "red";
    if (value <= 40) return "orange";
    if (value <= 60) return "#50e3c2";
    if (value <= 80) return "green";
    return "green";
  };
  return (
      <div className="relative w-[100%] bg-gray-300 h-2 rounded-[30px]">
        {/* Dynamic Progress Bar */}
        <div
          className="absolute top-0 left-0 h-full rounded-l-[30px]"
          style={{ width: `${rating}%`, background: getTrackStyle(rating) }}
        ></div>
        {[20, 40, 60, 80].map((percentage) => (
          <div
            key={percentage}
            className="absolute top-0 h-full border-white-600 border-r-2"
            style={{ left: `${percentage}%`, height: "100%" }}
          ></div>
        ))}
      </div>
  );
};

export default ProgressRating;
