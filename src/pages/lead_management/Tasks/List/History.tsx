import axios from "axios";
import React, { useEffect, useState } from "react";
import { showErrorAlert } from "../../../../constants";
import { Badge, Col, Dropdown, Row, Spinner } from "react-bootstrap";
import classNames from "classnames";
import CardLoadingSkeleton from "../../../../components/SkeletonLoading/CardLoadingSkeleton1";
import SkeletonComponent from "./StudyPreference/LoadingSkeleton";
import { reverse } from "dns";

const History = ({ studentId }: any) => {
  const [userHistory, setUserHistory] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("all"); // Default to "all"
  const [loading, setLoading] = useState(false);
  const [dropdownLabel, setDropdownLabel] = useState("Choose Country");

  const fetchDetails = async (countryId: any) => {
    setLoading(true);
    try {
      console.log(`Fetching details for country ID: ${countryId}`);
      const { data } = await axios.get(`lead_history/${studentId}/${countryId}`);
      setUserHistory(data.data.leadHistory);
      if (countryId === "all") setCountries(data.data.countries); // Set countries only on initial load
    } catch (error) {
      console.error("Error fetching lead history:", error);
      showErrorAlert(error);
    } finally {
      setLoading(false);
    }
  };

  console.log(studentId);

  // Fetch all countries and history initially
  useEffect(() => {
    fetchDetails("all");
  }, [studentId]);

  console.log(selectedCountry);
  console.log("userHistory", userHistory);

  // Re-fetch history when selected country changes
  useEffect(() => {
    console.log(selectedCountry);

    if (selectedCountry) {
      console.log("inside filter effect");

      fetchDetails(selectedCountry);
    }
  }, [selectedCountry]);

  // Update selected country and dropdown label
  const handleCountryWiseHistory = (countryId: any, countryName: any) => {
    console.log(countryId, countryName);

    setSelectedCountry(countryId);
    setDropdownLabel(countryName);
    console.log(selectedCountry);
  };

  return (
    <>
      {loading ? (
        <SkeletonComponent />
      ) : (
        <>
          <Row className="mb-3 mt-3">
            <Col md={6}>
              <div className="d-flex flex-wrap">
                <small
                  style={{
                    backgroundColor: selectedCountry === "all" ? "#00ce64" : "#9dd3f5",
                    color: "#122d3d",
                    padding: "4px 10px",
                  }}
                  className={classNames("rounded-pill fs-6 me-1 cursor-pointer")}
                  onClick={() => handleCountryWiseHistory("all", "All Countries")}
                >
                  All Countries
                </small>
                {countries.map((country: any) => (
                  <small
                    key={country.id}
                    style={{
                      backgroundColor: selectedCountry === country.id ? "#00ce64" : "#9dd3f5",
                      color: "#122d3d",
                      padding: "4px 10px",
                    }}
                    className={classNames("rounded-pill fs-6 me-1 cursor-pointer")}
                    onClick={() => handleCountryWiseHistory(country.id, country.country)}
                  >
                    {country.country}
                  </small>
                ))}
              </div>
            </Col>
          </Row>

          <Row>
            <div className="history-tl-container">
              <ul className="tl">
                <li className="tl-item">
                  History
                </li>
                {userHistory.length > 0 ? (
                  userHistory?.map((item: any) => (
                    <>
                      <li key={item.id} className="tl-item">
                        <div className="item-title">{item.action}</div>
                        <Badge>{item?.country ? item.country.country_name : ""}</Badge>
                        <div className="timestamp">{new Date(item.updated_on).toLocaleString()}</div>
                      </li>
                    </>
                  ))
                ) : (
                  <p>No lead history available for this filter.</p>
                )}
              </ul>
            </div>

          </Row>
        </>
      )}
    </>
  );
};

export default History;
