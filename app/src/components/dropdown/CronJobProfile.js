import { api } from "@/envfile/api";
import { Autocomplete, TextField } from "@mui/material";
import { getCookie } from "cookies-next";
import React, { useEffect, useState } from "react";
import axios from 'axios';

const CronJobProfile = ({ setSelectedCronJobProfile, selectedCronJobProfile}) => {
  const [cronJobProfileList, setCronJobProfileList] = useState([]); // Local state to manage node data
  

  useEffect(() => {
    const token = getCookie("jwtToken");
    if (token) {
      getCronJobProfileData(token); // Fetch node data once token is available
    }
  }, []);

  const getCronJobProfileData = async (token) => {
    try {
      const headers = { Authorization: "Bearer " + token };
      const response = await axios.get(api + "/admin/cronjobProfile/get", {
        headers,
      });
      setCronJobProfileList(response.data.cronJobProfiles); // Update the local node list state
      console.log(response.data.cronJobProfiles);
    } catch (error) {
      console.log(error, "Error fetching nodes");
    }
  };

  const handleCronJobProfileChange = (value) => {
    setSelectedCronJobProfile(value); // Capture selected node
    
  };

  return (
    <div>
      <Autocomplete
  size="small"
  options={cronJobProfileList} // Use the cronJobProfileList as the options
  getOptionLabel={(option) => option?.identifier || ''} // Safely access the 'identifier' field
  value={cronJobProfileList.find((profile) => profile.recordId === selectedCronJobProfile) || null} // Use find for single selection
  onChange={(event, newValue) => {
    if (newValue) {
      handleCronJobProfileChange(newValue.recordId); // Update the selected profile by its recordId
    } else {
      handleCronJobProfileChange(null); // Clear selection if no value is selected
    }
  }}
  renderInput={(params) => (
    <TextField
      {...params}
      label="Select CronJob Profile"
      variant="standard"
    />
  )}
/>

    </div>
  );
};

export default CronJobProfile;
