import { api } from "@/envfile/api";
import { TextField } from "@mui/material";
import { getCookie } from "cookies-next";
import React, { useEffect, useState } from "react";
import axios from 'axios';

const DashboardProfile = ({ selectedDashboardProfile, setSelectedDashboardProfile }) => {
  const [dashboardProfileList, setDashboardProfileList] = useState([]); // Local state to manage node data
  const [dashboardProfile, setDashboardProfile] = useState(""); // For capturing selected node

  useEffect(() => {
    const token = getCookie("jwtToken");
    if (token) {
      getDashboardProfileData(token); // Fetch node data once token is available
    }
  }, []);

  const getDashboardProfileData = async (token) => {
    try {
      const headers = { Authorization: "Bearer " + token };
      const response = await axios.get(api + "/admin/dashboardProfile/get", {
        headers,
      });
      setDashboardProfileList(response.data.dashboardProfiles); // Update the local node list state
    } catch (error) {
      console.log(error, "Error fetching DashboardProfile");
    }
  };

  const handleDashboardProfileChange = (value) => {
    setSelectedDashboardProfile(value); // Capture selected node
    setDashboardProfile(value); // Pass selected node to parent via setNodes
  };

  return (
    <div>
      <TextField
        className="text-xs w-full"
        style={{ marginTop: "2.5vh" }}
        select
        value={selectedDashboardProfile}
        SelectProps={{
          native: true,
        }}
        variant="standard"
        onChange={(e) => handleDashboardProfileChange(e.target.value)}
      >
        <option value="">Select DashboardProfile</option>
        {dashboardProfileList.map((option) => (
          <option key={option.recordId} value={option.recordId}>
            {option.identifier}
          </option>
        ))}
      </TextField>
    </div>
  );
};

export default DashboardProfile;
