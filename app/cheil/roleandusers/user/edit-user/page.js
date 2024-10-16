"use client"
import React, { useEffect, useState } from "react";
import { TextField, Autocomplete } from "@mui/material"; // Import Autocomplete
import { useRouter } from "next/navigation";
import axios from "axios";
import { getCookie } from "cookies-next";
import AddNewPageButtons from "@/app/src/components/AddNewPageButtons/AddNewPageButtons";
import { api } from "@/envfile/api";
import { useDispatch, useSelector } from "react-redux";
import MultiSelectRole from "@/app/src/components/multiSelectDropdown/MultiSelectRole";
import NodeDropdown from "@/app/src/components/dropdown/Node";
import { FaMinus } from "react-icons/fa";
import LocalesDropdown from "@/app/src/components/dropdown/Locales";
import { clearAllEditRecordIds } from "@/app/src/Redux/Slice/slice";

const EditUser = () => {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [params, setParams] = useState([]);
  const [ButtonActive, setButtonActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [subsidiary, setSubsidiary] = useState([]); // This holds all available subsidiaries
  const [selectedSubsidiary, setSelectedSubsidiary] = useState([]); // This holds selected subsidiaries for a specific user
  
  // Function to fetch all subsidiaries from backend
  const getAllSubsidiaries = async () => {
    try {
      const response = await axios.get(api + "/admin/subsidiary/get");
      setSubsidiary(response.data.subsidiaries); // Store all fetched subsidiaries in state
    } catch (error) {
      console.error(error, "Error fetching subsidiaries");
    }
  };
  const [formValues, setFormValues] = useState({
    email: "",
    username: "",
    password: "welcome12345",
    confirmpassword: "",
    roles: [],
    subsidiaries: [],
    node: [],
    locale: [],
    status: ""
  });

  useEffect(() => {
    const storedEmail = localStorage.getItem("username");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  useEffect(() => {
    const jwtToken = getCookie("jwtToken");
    if (jwtToken) {
      setToken(jwtToken);
      handlefetchData(jwtToken);
    }
  }, []);

  const handleAddParamClick = () => {
    setParams([...params, ""]);
  };

  const handleRemoveParamClick = (index) => {
    const newParams = params.filter((_, i) => i !== index);
    setParams(newParams);
  };

  const handleParamChange = (index, value) => {
    const newParams = [...params];
    newParams[index] = value;
    setParams(newParams);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };
  const dispatch = useDispatch();

  const handlePostClick = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const body = {
        users: [{
          recordId: Array.isArray(selectedID) ? selectedID[0] : selectedID,
          email: formValues.email,
          username: formValues.username,
          node: formValues.node,
          subsidiaries: selectedSubsidiary.map((id) => ({ recordId: id })), // Use selectedSubsidiary for submission
          roles: formValues.roles.map((role) => ({ recordId: role.recordId })),
          password: formValues.password,
          passwordConfirm: formValues.confirmpassword,
          status: ButtonActive,
          locale: formValues.locale,
        }]
      };
  
      const response = await axios.post(`${api}/admin/user/edit`, body, { headers });
      router.push("/cheil/roleandusers/user"); // Redirect after submission
  
    } catch (err) {
      console.error(err.response?.data || err.message, "Error details");
      setError("Error submitting data");
    } finally {
      setLoading(false);
    }
  };
  

  const selectedID = useSelector((state) => state.tasks.multipleEditRecordId);
  const [subsidiariesList, setSubsidiariesList] = useState([]); // To store all subsidiaries
  
  const handlefetchData = async (jwtToken) => {
    try {
      const headers = { Authorization: `Bearer ${jwtToken}` };
      const body = { users: selectedID.map((id) => ({ recordId: id })) };
  
      const response = await axios.post(`${api}/admin/user/getedits`, body, { headers });
      const fetchedData = response.data.users[0];
  
      const subsidiaries = fetchedData.subsidiaries || [];
      setSubsidiariesList(subsidiaries);
  
      // Map the recordId values from the subsidiaries and set it to selectedSubsidiary
      const mappedRecordIds = subsidiaries.map(sub => sub.recordId);
      setSelectedSubsidiary(mappedRecordIds); // Set initially selected subsidiaries
  
      setFormValues({
        email: fetchedData.email || "",
        username: fetchedData.username || "",
        password: fetchedData.password || "",
        confirmpassword: fetchedData.password,
        roles: fetchedData.roles || [],
        subsidiaries: subsidiaries,
        node: fetchedData.node || [],
        locale: fetchedData.locale || "",
        status: fetchedData.status || [],
      });
  
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  };
  
  

  
  const pagename = "Edit";
  const breadscrums = "RoleandUser > Edit User";

  useEffect(() => {
    getAllSubsidiaries();
  }, []);

 

  return (
    <AddNewPageButtons
      pagename={pagename}
      email={email}
      breadscrums={breadscrums}
      handleSaveClick={handlePostClick}
    >
      <div className="p-2">
        <div className="flex flex-col bg-gray-200 p-2 gap-3 rounded-md">
          <div className="grid grid-cols-4 gap-5 mb-4">
            <TextField
              label="Email"
              variant="standard"
              className="text-xs"
              name="email"
              value={formValues.email}
              onChange={handleInputChange}
            />
            <TextField
              label="User Name"
              variant="standard"
              className="text-xs"
              name="username"
              value={formValues.username}
              onChange={handleInputChange}
            />
            <TextField
              type="password"
              label="Password"
              variant="standard"
              className="text-xs"
              name="password"
              value={formValues.password}
              onChange={handleInputChange}
            />
            <TextField
              type="password"
              label="Confirm Password"
              variant="standard"
              className="text-xs"
              name="confirmpassword"
              value={formValues.confirmpassword}
              onChange={handleInputChange}
            />
            <NodeDropdown
              selectedNode={formValues.node}
              setSelectedNode={(newNodes) => setFormValues((prev) => ({ ...prev, node: newNodes }))}
            />

            {/* Autocomplete for Subsidiaries */}
            <Autocomplete
  multiple
  options={subsidiary} // Use fetched subsidiaries list here
  getOptionLabel={(option) => option.identifier || ''} // Display identifier of the subsidiary
  value={subsidiary.filter((sub) => selectedSubsidiary.includes(sub.recordId))} // Display selected subsidiaries based on selectedSubsidiary state
  onChange={(event, newValue) => {
    setSelectedSubsidiary(newValue.map((item) => item.recordId)); // Update selected subsidiary IDs when user selects/deselects options
  }}
  renderInput={(params) => (
    <TextField {...params} label="Select Subsidiaries" variant="standard" />
  )}
/>





            <MultiSelectRole
              selectedRoles={formValues.roles}
              setSelectedRoles={(roles) => setFormValues((prev) => ({ ...prev, roles }))}
            />
            <LocalesDropdown
              locales={formValues.locale}
              setLocales={(value) => setFormValues((prev) => ({ ...prev, locale: value }))}
            />
          </div>
        </div>
        <div className="flex gap-4 items-center w-[100%] justify-end">
          <div className="flex flex-row gap-3 items-center">
            {ButtonActive === false ? (
              <button
                onClick={() => setButtonActive(!ButtonActive)}
                className="bg-[#fff] border-2 border-solid border-gray-400  rounded-md text-gray-700 text-xs px-2 py-0.5 w-[80px] animate__animated  animate__pulse"
              >
                InActive
              </button>
            ) : (
              <button
                onClick={() => setButtonActive(!ButtonActive)}
                className=" bg-[#1581ed] border-2 border-solid border-[#1581ed] rounded-md text-white text-xs px-2 py-0.5 w-[80px] animate__animated  animate__pulse"
              >
                Active
              </button>
            )}
          </div>
        </div>
        <div className="p-2 gap-2 flex flex-col">
          <div className="flex flex-col mt-4 w-[100%]">
            <div className="grid grid-cols-3 gap-4">
              {params.map((param, index) => (
                <div key={index} className="flex items-center gap-2">
                  <TextField
                    placeholder="Enter Param Here"
                    variant="outlined"
                    size="small"
                    value={param}
                    onChange={(e) => handleParamChange(index, e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveParamClick(index)}
                    className="text-red-500"
                  >
                    <FaMinus />
                  </button>
                </div>
              ))}
              <button
                onClick={handleAddParamClick}
                className="border border-gray-400 px-4 py-2 rounded-md"
              >
                Add Param
              </button>
            </div>
          </div>
        </div>
      </div>
    </AddNewPageButtons>
  );
};

export default EditUser;

