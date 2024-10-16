// import { api } from "@/envfile/api";
// import { Autocomplete, TextField } from "@mui/material";
// import { getCookie } from "cookies-next";
// import React, { useEffect, useState } from "react";
// import axios from 'axios';

// const TestDataTypesDropDown = ({ selectedTestDataTypes, setSelectedTestDataTypes }) => {
//   const [testDataTypes, setTestDataTypes] = useState([]);

//   useEffect(() => {
//     const token = getCookie("jwtToken");
//     if (token) {
//       getTestDataTypesData(token);
//     }
//   }, []);

//   const getTestDataTypesData = async (token) => {
//     try {
//       const headers = { Authorization: "Bearer " + token };
//       const response = await axios.get(api + "/admin/testdatatype/get", { headers });
//       setTestDataTypes(response.data.testDataTypes);
//     } catch (error) {
//       console.log(error, "Error fetching testDataTypes");
//     }
//   };

//   const handleNodeChange = (newValue) => {
//     if (newValue) {
//       setSelectedTestDataTypes(newValue.recordId); // Update with the selected recordId
//       console.log("Selected TestDataType:", newValue); // Log the selected object for verification
//     } else {
//       setSelectedTestDataTypes(""); // Clear selection if no value
//     }
//   };

//   return (
//     <div>
//       <Autocomplete
//         className="text-xs w-full"
//         style={{ marginTop: "2.5vh" }}
//         options={testDataTypes} // The array of options (testDataTypes)
//         getOptionLabel={(option) => option.identifier || ''} // Show identifier in dropdown
//         value={testDataTypes.find((option) => option.recordId === selectedTestDataTypes) || null} // Match based on recordId
//         onChange={(event, newValue) => handleNodeChange(newValue)} // Handle value change
//         isOptionEqualToValue={(option, value) => option.recordId === value?.recordId} // Match by recordId
//         renderInput={(params) => (
//           <TextField
//             {...params}
//             variant="standard"
//             label="Select TestDataTypes"
//           />
//         )}
//       />
//     </div>
//   );
// };

// export default TestDataTypesDropDown;




import { api } from "@/envfile/api";
import { Autocomplete, TextField } from "@mui/material";
import { getCookie } from "cookies-next";
import React, { useEffect, useState } from "react";
import axios from 'axios';

const TestDataTypesDropDown = ({ selectedTestDataTypes, setSelectedTestDataTypes, dropdownName = "Select TestDataTypes" }) => {
  const [testDataTypes, setTestDataTypes] = useState([]);
  const [loading, setLoading] = useState(false); // Local loading state

  // Function to fetch test data types
  const getTestDataTypesData = async (token) => {
    try {
      setLoading(true); // Set loading state before fetching
      const headers = { Authorization: "Bearer " + token };
      const response = await axios.get(`${api}/admin/testdatatype/get`, { headers });
      setTestDataTypes(response.data.testDataTypes || []); // Update local state with fetched data
    } catch (error) {
      console.log(error, "Error fetching testDataTypes");
    } finally {
      setLoading(false); // Set loading state to false after fetching
    }
  };

  // Handle the dropdown open event
  const handleDropdownOpen = () => {
    const token = getCookie("jwtToken");
    if (token && testDataTypes.length === 0) {
      getTestDataTypesData(token); // Fetch data only if the dropdown is opened and data is empty
    }
  };

  const handleNodeChange = (newValue) => {
    if (newValue) {
      setSelectedTestDataTypes(newValue.recordId); // Update with the selected recordId
      console.log("Selected TestDataType:", newValue); // Log the selected object for verification
    } else {
      setSelectedTestDataTypes(""); // Clear selection if no value
    }
  };

  return (
    <div>
      <Autocomplete
        className="text-xs w-full"
        style={{ marginTop: "2.5vh" }}
        options={testDataTypes} // The array of options (testDataTypes)
        getOptionLabel={(option) => option.identifier || ''} // Show identifier in dropdown
        value={testDataTypes.find((option) => option.recordId === selectedTestDataTypes) || null} // Match based on recordId
        onChange={(event, newValue) => handleNodeChange(newValue)} // Handle value change
        onOpen={handleDropdownOpen} // Lazy-load data when dropdown opens
        loading={loading} // Show loading state
        isOptionEqualToValue={(option, value) => option.recordId === value?.recordId} // Match by recordId
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            placeholder={dropdownName} // Use dropdownName as placeholder
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? <span>Loading...</span> : null} 
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />
    </div>
  );
};

export default TestDataTypesDropDown;
