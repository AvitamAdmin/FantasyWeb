import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";
import { api } from "@/envfile/api";

const LocalesDropdown = ({ setLocales, locales }) => {
  const [localesList, setLocalesList] = useState([]); // Manage list of locales

  useEffect(() => {
    const token = getCookie("jwtToken");
    if (token) {
      getLocalesData(token); // Fetch locales data when token is available
    }
  }, []);

  const getLocalesData = async (token) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(`${api}/admin/user/add`, { headers });
      setLocalesList(response.data.locales);
    } catch (error) {
      console.log("Error fetching locales:", error);
    }
  };

  
  const handleLocaleChange = (event, newValue) => {
    setLocales(newValue); // newValue is the array of selected locales
  };
  

  return (
    <div className="flex flex-col w-full">
      <Autocomplete
  options={localesList}
  value={locales || null} // Set value to a single locale or null
  onChange={handleLocaleChange}
  renderInput={(params) => (
    <TextField
      {...params}
      className="text-xs w-full"
      style={{ marginTop: "2.5vh" }}
      variant="standard"
      label="Select Locale"
    />
  )}
/>
    </div>
  );
};

export default LocalesDropdown;
