import React, { useState, useId } from "react";

const Stepper = ({
  steps,
  showNumber,
  activeStep: initialActiveStep,
  activeSubStep: initialActiveSubStep,
  onChange = null,
  direction,
  isShowTitle=true
}) => {
  const [activeStep, setActiveStep] = useState(initialActiveStep);
  const [activeSubStep, setActiveSubStep] = useState(initialActiveSubStep);

  const lastIndexOfSteps = steps.length - 1;

  const getCircleBg = (index, activeStep) => {
    if (index + 1 === activeStep) {
      return "bg-blue-500"; // Active step color
    } else if (index < activeStep) {
      return "bg-green-500"; // Completed step color
    }
    return "white"; // Future step color
  };

  const getSubStepBg = (index, activeStep, activeSubStep, parentIndex) => {
    // Check if the parent step is active and if the sub-step is completed or active
    if (activeStep === parentIndex + 1) {
      if (index + 1 < activeSubStep) {
        return "bg-green-500"; // Completed sub-step color
      } else if (index + 1 === activeSubStep) {
        return "white"; // Active sub-step color
      }
    }else if(parentIndex+1<activeStep){
        return "bg-green-500"; 
    }

    return "white";
  };

  // Handle step change (either main step or sub-step)
  const handleStepChange = (stepIndex, subStepIndex = null) => {
    const newActiveStep = stepIndex + 1;
    setActiveStep(newActiveStep);

    if (subStepIndex !== null) {
      setActiveSubStep(subStepIndex + 1);
    }

    if (onChange) {
      onChange(newActiveStep, subStepIndex);
    }
  };

  // Determine container layout based on direction
  const containerClass =
    direction === "vertical"
      ? "flex flex-col items-center space-y-4" // Vertical layout with space between steps
      : "flex justify-start items-center p-2 space-x-1"; // Horizontal layout

  return (
    <div className={containerClass}>
      {steps.map((step, parentIndex) => {
        const circleBg = getCircleBg(parentIndex, activeStep);
        return (
          <React.Fragment key={useId()}>
            {/* Render main step */}
            <Step
              circleBg={circleBg}
              onSelect={onChange ? () => handleStepChange(parentIndex) : undefined}
              showNumber={showNumber}
              index={parentIndex}
              activeStep={activeStep}
              lastIndexOfSteps={lastIndexOfSteps}
              step={step}
              activeSubStep={activeSubStep}
              direction={direction}
              isShowTitle={isShowTitle}
            />
            {/* Render sub-steps if they exist */}
            {step?.children?.map((sub, subIndex) => {
              const subBg = getSubStepBg(subIndex, activeStep, activeSubStep, parentIndex);
              return (
                <React.Fragment key={useId()}>
                  <Step
                    isSub={true}
                    step={sub}
                    index={subIndex}
                    circleBg={subBg}
                    lastIndexOfSteps={lastIndexOfSteps}
                    activeStep={activeStep}
                    activeSubStep={activeSubStep}
                    showNumber={showNumber}
                    onSelect={onChange ? () => handleStepChange(parentIndex, subIndex) : undefined}
                    textWidth={sub.textWidth}
                    direction={direction}
                    isShowTitle={isShowTitle}
                  />
                </React.Fragment>
              );
            })}
          </React.Fragment>
        );
      })}
    </div>
  );
};

Stepper.defaultProps = {
  steps: [
    {
      title: "Step 1",
      children: [{ title: "Sub-step 1.1" }, { title: "Sub-step 1.2" }],
    },
    { title: "Step 2", children: [{ title: "Sub-step 2.1" }] },
    { title: "Step 3" },
    { title: "Step 4" },
  ],
  showNumber: true,
  activeStep: 1,
  activeSubStep: null,
//   onChange: () => {}, // Default no-op function
  direction: "horizontal",
};

export default Stepper;

const Step = ({
    onSelect,
    circleBg,
    showNumber,
    index,
    activeStep,
    lastIndexOfSteps,
    step,
    isSub,
    activeSubStep,
    textWidth,
    direction,
    isShowTitle, 
  }) => {
    const isActive = index + 1 === activeStep;
    const isCompleted = activeStep < index + 1;
    const isInProgress = activeStep <= index + 1;
  
    // Define layout classes based on direction
    const stepClass =
      direction === "vertical"
        ? "flex flex-col items-center"
        : "flex items-center space-x-2"; // Vertical = column, Horizontal = row
    const textClass =
      direction === "vertical" ? "text-sm font-light mt-2" : "text-sm font-light"; // Vertical = text below the circle
  
    // For the divider
    const dividerClass =
      direction === "vertical"
        ? "border w-[1px] flex-grow border-t border-[#C8CACB] h-[3rem] mx-auto" // Vertical divider
        : "h-[1px] w-full border-t border-[#C8CACB]"; // Horizontal divider
  
    const inProgressDividerClass =
      direction === "vertical"
        ? "border w-[1px] flex-grow border-t border-dashed border-[#C8CACB] h-[3rem] mx-auto"
        : "h-[1px] w-full border-t border-dashed border-[#C8CACB]";
  
    // Check if we should show a divider between steps or substeps
    const showDivider = !isSub && step.children ? true : lastIndexOfSteps !== index;
  
    const getCircleBorderColor = () => {
      if (!isSub) {
        if (activeStep === index + 1) {
          return '1px solid #3B82F6'; // Blue border for the active step
        } else if (isCompleted) {
          return '1px solid rgb(229, 231, 235)'; // Grey border for completed step
        }
      } else if (isSub) {
        if (activeSubStep === index + 1) {
          return '1px solid #3B82F6';
        } else if (activeSubStep < index + 1) {
          return '1px solid rgb(229, 231, 235)';
        }
      }
      return 'none'; // No border for future steps
    };
  
    return (
      <React.Fragment>
        <div className={stepClass} onClick={onSelect}>
          {/* Circle with number */}
          <div className="flex justify-center items-center relative">
            <div className={`rounded-full ${isSub ? '' : activeSubStep === index + 1 ? '' : 'p-[3px]'}`} style={{ border: getCircleBorderColor() }}>
              <div
                className={`${circleBg} flex justify-center items-center rounded-full ${
                  isCompleted ? "text-[#000000]" : "text-white"
                } ${isSub ? "w-4 h-4" : "w-8 h-8"}`}
              >
                {showNumber && !isSub && index + 1}
              </div>
            </div>
            {direction === "vertical" && isShowTitle && (
              <span
                className={`${textClass} ${isCompleted ? "text-black" : "text-[#BFC2C3]"} absolute left-[120%]`}
                style={{ width: textWidth ? textWidth : "max-content" }}
              >
                {step.title}
              </span>
            )}
          </div>
  
          {/* Step title inline with dynamic width */}
          {direction === "horizontal" && isShowTitle && (
            <span
              className={`${textClass} ${activeStep === index + 1 ? "text-black" : "text-[#BFC2C3]"}`}
              style={{ width: textWidth ? textWidth : "max-content" }}
            >
              {step.title}
            </span>
          )}
        </div>
  
        {/* Step divider */}
        {showDivider && (
          <div
            className={`${isInProgress ? inProgressDividerClass : dividerClass} ${
              activeStep >= index + 1 ? "border-[#007cc3]" : ""
            }`}
          />
        )}
      </React.Fragment>
    );
  };
  