import React from "react";
import { Form } from "react-bootstrap";
import SvgType from "./QrSvg";
import { CircleCheck, CircleX } from "lucide-react";

type Props = {
  label: string;
  name: string;
  type: string;
  id: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

function CheckQuality({ label, checked, onChange, name, type, id }: Props) {
  return (
    <div className="d-flex align-items-center justify-content-center p-3 ">
      <div className="d-flex align-items-center">
        <div
          className="d-flex align-items-center justify-content-center rounded-circle"
          style={{
            backgroundColor: "#FFE6E6",
            width: "40px",
            height: "40px",
            marginRight: "12px",
          }}
        >
          {/* <SvgType type={type} /> */}
        </div>
        <span className="fw-medium fs-5">{label}</span>
        {checked ? (
         <CircleCheck color="#10da43" className="ms-3" />
        )
        :
        (
          <CircleX color="#e40707"  className="ms-3"/>
        )
      }
        <Form.Check
          type="checkbox"
          id={id}
          hidden={true}
          name={name}
          checked={checked}
          onChange={onChange}
          className="ms-3"
          style={{
            transform: "scale(1.2)",
          }}
        />
      </div>
    </div>
  );
}

export default CheckQuality;
