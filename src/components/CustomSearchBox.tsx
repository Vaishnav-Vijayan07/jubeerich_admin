import React, { useState } from "react";
import { Button, Row, Col } from "react-bootstrap";

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
  onSearch: () => void; // Callback function for search
  onValueChange: (value: string) => void; // Callback function for search
  onClose: () => void; // Callback function for search
  placeholder?: string;
  isSearchApplied: boolean;
  value?: string;
};

function CustomSearchBox({ onSearch, onClose, onValueChange, value, placeholder = "Search...", isSearchApplied }: Props) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onValueChange(e.target.value);
  };

  const handleSearch = () => {
    onSearch(); // Call the provided callback with the search value
  };

  const handleSearchClose = () => {
    onClose();
  };

  return (
    <>
      <Row>
        <Col md={6} className="d-flex align-items-center">
          <div style={styles.wrapper}>
            <input type="search" value={value} onChange={handleInputChange} placeholder={placeholder} style={styles.input} />
            <Button type="button" style={styles.iconButton} onClick={isSearchApplied ? handleSearchClose : handleSearch}>
              {isSearchApplied ? <i className="mdi mdi-close"></i> : <i className="mdi mdi-magnify"></i>}
            </Button>
          </div>
        </Col>
      </Row>
    </>
  );
}

export default CustomSearchBox;
