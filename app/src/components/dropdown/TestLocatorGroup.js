import { api } from "@/envfile/api";
import { TextField } from "@mui/material";
import { getCookie } from "cookies-next";
import React, { useEffect, useState } from "react";
import axios from 'axios';

const TestLocatorGroupDropdown = ({ setSelectedTestLocatorGroup, selectedTestLocatorGroup }) => {
  console.log(selectedTestLocatorGroup, "selectedTestLocatorGroup from the dropdown");

  const [LocatorGroups, setLocatorGroups] = useState([]);

  useEffect(() => {
    const token = getCookie("jwtToken");
    if (token) {
      getTestLocatorGroupData(token); // Fetch node data once token is available
    }
  }, []);

  const getTestLocatorGroupData = async (token) => {
    try {
      const headers = { Authorization: "Bearer " + token };
      const response = await axios.get(api + "/admin/locatorGroup/get", {
        headers,
      });
      setLocatorGroups(response.data.testLocatorGroups); // Update the local node list state
      console.log("data" + response.data.testLocatorGroups);
    } catch (error) {
      console.log(error, "Error fetching nodes");
    }
  };

  const handleTestLocatorGroupChange = (value) => {
    setSelectedTestLocatorGroup(value); // Capture selected node
  };

  return (
    <div>
      <TextField
        className="text-xs w-full"
        style={{ marginTop: "2.5vh" }}
        select
        value={selectedTestLocatorGroup}
        SelectProps={{
          native: true,
        }}
        variant="standard"
        onChange={(e) => handleTestLocatorGroupChange(e.target.value)}
      >
        <option value="">Select Test Group</option>
        {LocatorGroups.map((option) => (
          <option key={option.recordId} value={option.recordId}>
            {option.identifier}
          </option>
        ))}
      </TextField>
    </div>
  );
};

export default TestLocatorGroupDropdown;
