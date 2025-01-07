import React from "react";
import { Check } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";

type StepperDataItem = {
  label: string;
  isCompleted: boolean;
};

type StepperData = StepperDataItem[];

type Props = {
  steps:StepperData;
  current: number;
};

const ApplicationStepper = ({ steps, current }: Props) => {
  return (
    <div className="p-1">
      <div className="row d-flex gap-3 ">
        {steps.map((step: StepperDataItem, index: any) => (
          <div
            key={index}
            className={`col d-flex flex-column align-items-center position-relative border ${current == index ? "opacity-100" : "opacity-25"} `}
            style={{width:"158px",height:"82px", borderColor: "#e9ecef", backgroundColor: "#6657dd", borderRadius: "5px", padding: " 10px" }}
          >
            {/* Circle with tick */}
            <div
              className="rounded-circle d-flex gap-1 align-items-center justify-content-center"
              style={{ width: "29px", height: "29px", marginBottom: "8px", backgroundColor: "white" }}
            >
              {current == index || !step.isCompleted ? <span>{index + 1}</span> : <Check color="#6657dd" style={{ padding: "3px" }} size={24} />}
            </div>

            {/* Step name */}
            <span
              style={{
                fontWeight: 500,
                fontSize: "14px",
                color: "white",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                width: "100%",
                textAlign: "center",
              }}
              title={step?.label} // Shows full text on hover
            >
              {step?.label}
            </span>

            {/* Dotted connector line */}
            {index < steps.length - 1 && (
              <div
                className="position-absolute"
                style={{
                  top: "39px",
                  left: "100%",
                  width: "2rem",
                  height: "2px",
                  background: "linear-gradient(to right, #6657dd 25%, transparent 25%)",
                  backgroundSize: "6px 2px",
                  transform: "translateX(-0.5rem)",
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApplicationStepper;
