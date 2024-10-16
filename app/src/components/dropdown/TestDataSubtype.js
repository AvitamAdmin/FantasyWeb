// import { api } from "@/envfile/api";
// import { Autocomplete, TextField } from "@mui/material";
// import { getCookie } from "cookies-next";
// import React, { useEffect, useState } from "react";
// import axios from 'axios';

// const TestDataSubTypeDropDown = ({ testDataSubtypes, setTestDataSubtypes }) => {
//   const [testDataSubtypesList, setTestDataSubtypesList] = useState([]);

//   useEffect(() => {
//     const token = getCookie("jwtToken");
//     if (token) {
//       getTestDataSubTypesData(token); // Fetch test data types once token is available
//     }
//   }, []);

//   const getTestDataSubTypesData = async (token) => {
//     try {
//       const headers = { Authorization: "Bearer " + token };
//       const response = await axios.get(api + "/admin/testdatasubtype/get", { headers });
//       setTestDataSubtypesList(response.data.testDataSubtypes); // Update the local test data types list
//     } catch (error) {
//       console.log(error, "Error fetching testDataSubtypesList");
//     }
//   };

//   // Log the updated testDataTypes after it changes
//   useEffect(() => {
//     console.log(testDataSubtypesList, "Fetched from backend testDataSubtypes");
//   }, [testDataSubtypesList]);

//   const handleNodeChange = (newValue) => {
//     if (newValue) {
//       setTestDataSubtypes(newValue.recordId); // Capture selected test data subtype by recordId
//       console.log("Selected TestData Subtype:", newValue);
//     } else {
//       setTestDataSubtypes(""); // Handle case when no value is selected
//     }
//   };

//   return (
//     <div>
//       <Autocomplete
//         className="text-xs w-full"
//         style={{ marginTop: "2.5vh" }}
//         options={testDataSubtypesList} // The array of testDataSubtypes
//         getOptionLabel={(option) => option.identifier || ''} // Display the identifier in the dropdown
//         value={testDataSubtypesList.find(option => option.recordId === testDataSubtypes) || null} // Set current value
//         onChange={(event, newValue) => handleNodeChange(newValue)} // Handle value change
//         isOptionEqualToValue={(option, value) => option.recordId === value?.recordId} // Match by recordId
//         renderInput={(params) => (
//           <TextField
//             {...params}
//             label="Select TestData Subtypes"
//             variant="standard"
//           />
//         )}
//       />
//     </div>
//   );
// };

// export default TestDataSubTypeDropDown;








import { api } from "@/envfile/api";
import { Autocomplete, TextField } from "@mui/material";
import { getCookie } from "cookies-next";
import React, { useEffect, useState } from "react";
import axios from 'axios';

const TestDataSubTypeDropDown = ({ testDataSubtypes, setTestDataSubtypes, dropdownName = "Select Test Data Subtypes" }) => {
  const [testDataSubtypesList, setTestDataSubtypesList] = useState([]);
  const [loading, setLoading] = useState(false); // Local loading state

  // Function to fetch test data subtypes
  const getTestDataSubTypesData = async (token) => {
    try {
      setLoading(true); // Set loading state before fetching
      const headers = { Authorization: "Bearer " + token };
      const response = await axios.get(`${api}/admin/testdatasubtype/get`, { headers });
      setTestDataSubtypesList(response.data.testDataSubtypes || []); // Update local state with fetched data
    } catch (error) {
      console.log(error, "Error fetching testDataSubtypesList");
    } finally {
      setLoading(false); // Set loading state to false after fetching
    }
  };

  // Handle the dropdown open event
  const handleDropdownOpen = () => {
    const token = getCookie("jwtToken");
    if (token && testDataSubtypesList.length === 0) {
      getTestDataSubTypesData(token); // Fetch data only if the dropdown is opened and data is empty
    }
  };

  const handleNodeChange = (newValue) => {
    if (newValue) {
      setTestDataSubtypes(newValue.recordId); // Capture selected test data subtype by recordId
      console.log("Selected TestData Subtype:", newValue);
    } else {
      setTestDataSubtypes(""); // Handle case when no value is selected
    }
  };

  return (
    <div>
      <Autocomplete
        className="text-xs w-full"
        style={{ marginTop: "2.5vh" }}
        options={testDataSubtypesList} // The array of testDataSubtypes
        getOptionLabel={(option) => option.identifier || ''} // Display the identifier in the dropdown
        value={testDataSubtypesList.find(option => option.recordId === testDataSubtypes) || null} // Set current value
        onChange={(event, newValue) => handleNodeChange(newValue)} // Handle value change
        onOpen={handleDropdownOpen} // Lazy-load data when dropdown opens
        loading={loading} // Show loading state
        isOptionEqualToValue={(option, value) => option.recordId === value?.recordId} // Match by recordId
        renderInput={(params) => (
          <TextField
            {...params}
            label={dropdownName} // Use dropdownName as the label
            variant="standard"
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

export default TestDataSubTypeDropDown;
