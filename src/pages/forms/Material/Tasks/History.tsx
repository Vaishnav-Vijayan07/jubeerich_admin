import React, { useEffect, useState } from "react";
import axios from "axios";
import { handleDateFormat, showErrorAlert } from "../../../../constants";
import { Badge, Col, Dropdown, Row, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";

const History = ({ studentId }: any) => {
  const [userHistory, setUserHistory] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("all"); // Default to "all"
  const [loading, setLoading] = useState(false);
  const [dropdownLabel, setDropdownLabel] = useState("Choose Country");

  const { refresh } = useSelector((state: RootState) => ({
    refresh: state.refreshReducer.refreshing,
  }));

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
  }, [studentId, refresh]);

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
    <div className="history_container">
      <div className="history_heading">
        <h5>HISTORY</h5>
      </div>

      <div className="history_items">
        {/* history */}
        {userHistory.length > 0 ? (
          <>
            <div className="swiper-slide">
              <div className="timestamp">
                <span className="date">History</span>
              </div>
              <div className="status">
                <span style={{color:"transparent"}}>12</span>
              </div>
            </div>

            {userHistory?.map((item: any) => (
              <div className="swiper-slide" key={item.id}>
                <div className="timestamp">
                  <span className="date">{item.action}</span>
                </div>
                <div className="status">
                  <span>{handleDateFormat(item.updated_on)}</span>
                  <Badge>{item?.country ? item.country.country_name : ""}</Badge>
                </div>
              </div>
            ))}
          </>
        ) : (
          <p>No lead history available for this filter.</p>
        )}
      </div>
    </div>
  );
};

export default History;
