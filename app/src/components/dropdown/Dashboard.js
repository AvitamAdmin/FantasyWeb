import { api } from "@/envfile/api";
import { Autocomplete, TextField } from "@mui/material";
import { getCookie } from "cookies-next";
import React, { useEffect, useState } from "react";
import axios from 'axios';

const Dashboard = ({ selectedDashboard, setSelectedDashboard }) => {
  const [dashboardList, setDashboardList] = useState([]); // Local state to manage node data

  useEffect(() => {
    const token = getCookie("jwtToken");
    if (token) {
      getDashboardData(token); // Fetch node data once token is available
    }
  }, []);

  const getDashboardData = async (token) => {
    try {
      const headers = { Authorization: "Bearer " + token };
      const response = await axios.get(api + "/admin/dashboard/get", {
        headers,
      });
      setDashboardList(response.data.dashboards); // Update the local node list state
    } catch (error) {
      console.log(error, "Error fetching nodes");
    }
  };

  const handleDashboardChange = (value) => {
    setSelectedDashboard(value); // Capture selected node
  };

  return (
    <div>
      <Autocomplete
  size="small"
  options={dashboardList} // List of all dashboards
  getOptionLabel={(option) => option?.identifier || ''} // Safely access the 'identifier' field
  value={dashboardList.find((dashboard) => dashboard.recordId === selectedDashboard) || null} // Use find for single selection
  onChange={(event, newValue) => {
    if (newValue) {
      handleDashboardChange(newValue.recordId); // Update the selected dashboard by its recordId
    } else {
      handleDashboardChange(''); // Clear selection if no value is selected
    }
  }}
  renderInput={(params) => (
    <TextField
      {...params}
      label="Select Dashboard"
      variant="standard"
    />
  )}
/>

    </div>
  );
};

export default Dashboard;
