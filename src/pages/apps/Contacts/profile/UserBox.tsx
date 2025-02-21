import React, { useState, useEffect } from "react";
import axios from "axios";

const UserBox = () => {
  const [profileDetails, setProfileDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("/get_user_profile"); // API call to fetch user details
        setProfileDetails(response.data.data); // Assuming response structure is { success: true, data: {...} }
      } catch (err) {
        setError("Failed to load profile details.");
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="text-start mt-3 mb-3">
      <p className="text-muted mb-2 font-13">
        <strong>Full Name :</strong>
        <span className="ms-2">{profileDetails?.name || "N/A"}</span>
      </p>

      <p className="text-muted mb-2 font-13">
        <strong>Mobile :</strong>
        <span className="ms-2">{profileDetails?.phone || "N/A"}</span>
      </p>

      <p className="text-muted mb-2 font-13">
        <strong>Email :</strong>
        <span className="ms-2">{profileDetails?.email || "N/A"}</span>
      </p>

      <p className="text-muted mb-1 font-13">
        <strong>Address :</strong>
        <span className="ms-2">{profileDetails?.address || "N/A"}</span>
      </p>
    </div>
  );
};

export default UserBox;
