import React, { useCallback, useState } from "react";
import { Button, Row, Col } from "react-bootstrap";
import { debounce } from "lodash";

const styles: any = {
  wrapper: {
    position: "relative",
    width: "30%",
  },
  input: {
    width: "100%",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    height: "40px",
    fontSize: "14px",
    outline: "none",
    transition: "box-shadow 0.3s ease, border-color 0.3s ease",
  },
  inputFocus: {
    borderColor: "#3f6eb4",
    boxShadow: "0 0 5px rgba(63, 110, 180, 0.5)",
  },
  iconButton: {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    backgroundColor: "transparent",
    border: "none",
    color: "#3f6eb4",
    fontSize: "18px",
    cursor: "pointer",
    padding: "0",
  },
  iconButtonHover: {
    color: "#2b4c8a",
  },
};

type Props = {
  onSearch: (searchValue: any) => void; // Callback function for search
  placeholder?: string;
};

function CustomSearchBox({ onSearch, placeholder = "Search..." }: Props) {
  console.log("Inside custom box");

  const [value, setValue] = useState("");

  const debouncedSearch = useCallback(
    debounce((value) => {
      onSearch(value);
    }, 500), // Adjust debounce delay as needed
    [onSearch]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value || "";
    setValue(searchValue);
    debouncedSearch(searchValue);
  };

  return (
    <>
      <Row>
        <Col md={6} className="d-flex align-items-center">
          <div style={styles.wrapper}>
            <input type="search" value={value} onChange={handleInputChange} placeholder={placeholder} style={styles.input} />
            {value !== "" && (
              <Button type="button" style={styles.iconButton} onClick={() => {
                onSearch("");
                setValue("");
              }}>
                <i className="mdi mdi-close"></i>
              </Button>
            )}
          </div>
        </Col>
      </Row>
    </>
  );
}

export default CustomSearchBox;
