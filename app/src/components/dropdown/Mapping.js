// import { api } from "@/envfile/api";
// import { TextField } from "@mui/material";
// import { getCookie } from "cookies-next";
// import React, { useEffect, useState } from "react";
// import axios from 'axios';

// const MappingDropdown = ({ setMapping, mapping }) => {
//   const [mappingList, setMappingList] = useState([]);
//   const [selectedMapping, setSelectedMapping] = useState(mapping || ""); // Set the initial value from existing data

//   useEffect(() => {
//     const token = getCookie("jwtToken");
//     if (token) {
//       getInterfaceData(token);
//     }
//   }, []);

//   const getInterfaceData = async (token) => {
//     try {
//       const headers = { Authorization: "Bearer " + token };
//       const response = await axios.get(api + "/admin/mapping/get", {
//         headers,
//       });
//       setMappingList(response.data.sourceTargetMappings);
//     } catch (error) {
//       console.log(error, "Error fetching mapping");
//     }
//   };

//   const handleNodeChange = (value) => {
//     setSelectedMapping(value);
//     setMapping(value);
//   };

//   return (
//     <div>
//       <TextField
//         className="text-xs w-full"
//         style={{ marginTop: "2.5vh" }}
//         select
//         value={selectedMapping}
//         SelectProps={{
//           native: true,
//         }}
//         variant="standard"
//         onChange={(e) => handleNodeChange(e.target.value)}
//       >
//         <option value="">Select Mapping</option>
//         {mappingList.map((option) => (
//           <option key={option.recordId} value={option.recordId}>
//             {option.identifier}
//           </option>
//         ))}
//       </TextField>
//     </div>
//   );
// };

// export default MappingDropdown;



import { api } from "@/envfile/api";
import { Autocomplete, TextField } from "@mui/material";
import { getCookie } from "cookies-next";
import React, { useEffect, useState } from "react";
import axios from "axios";

const MappingDropdown = ({
  setMapping,
  mapping,
  initialload = false, // Default to false
  dropdownName = "Select Mapping", // Customizable label
}) => {
  const [mappingList, setMappingList] = useState([]);
  const [loading, setLoading] = useState(false); // Manage loading state
  const [selectedMapping, setSelectedMapping] = useState(
    mappingList.find((item) => item.recordId === mapping) || null
  ); // Set initial value if available

  useEffect(() => {
    if (initialload) {
      const token = getCookie("jwtToken");
      if (token) getMappingData(token); // Fetch data initially if required
    }
  }, [initialload]);

  const getMappingData = async (token) => {
    setLoading(true); // Show loading indicator while fetching
    try {
      const headers = { Authorization: "Bearer " + token };
      const response = await axios.get(api + "/admin/mapping/get", { headers });
      setMappingList(response.data.sourceTargetMappings || []);
    } catch (error) {
      console.log(error, "Error fetching mapping");
    } finally {
      setLoading(false); // Stop loading indicator
    }
  };

  const handleMappingChange = (event, newValue) => {
    setSelectedMapping(newValue); // Update selected value
    setMapping(newValue ? newValue.recordId : ""); // Pass selected mapping to parent
  };

  return (
    <div className="w-full">
      <Autocomplete
        className="w-full"
        options={mappingList}
        getOptionLabel={(option) => option.identifier || ""}
        value={selectedMapping}
        onChange={handleMappingChange}
        onOpen={() => {
          if (!initialload && mappingList.length === 0) {
            const token = getCookie("jwtToken");
            if (token) getMappingData(token); // Fetch data on dropdown open
          }
        }}
        loading={loading}
        isOptionEqualToValue={(option, value) =>
          option.recordId === (value?.recordId || value)
        }
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            label={dropdownName} // Dynamic label
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

export default MappingDropdown;
