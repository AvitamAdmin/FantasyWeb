"use client";
import React, { useState, useEffect } from "react";
import { FaMinus } from "react-icons/fa";
import { Autocomplete, MenuItem, TextField } from "@mui/material";
import axios from "axios";
import { api } from "@/envfile/api";
import { getCookie } from "cookies-next";
import CronjobExpression from "@/app/src/components/modal/CronjobExpression";
import AddNewPageButtons from "@/app/src/components/AddNewPageButtons/AddNewPageButtons";
import Dashboard from "@/app/src/components/dropdown/Dashboard";
import CronJobProfile from "@/app/src/components/dropdown/CronJobProfile";
import { useRouter } from "next/navigation";
import cronjobProfile from "../../cronjobProfile/page";
// import "animate.css";

const addQacronjob = () => {
  const router = useRouter();
  const [ButtonActive, setButtonActive] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cronJobProfile, setCronJobProfile] = useState([]);
  const [selectedCronJobProfile, setSelectedCronJobProfile] = useState("");
  const [selectedDashboard, setSelectedDashboard] = useState("");
  const [subsidiary, setSubsidiary] = useState([]);
  const [sitesList, setSitesList] = useState([]);
  const [environments, setEnvironments] = useState([]);
  const [testProfile, setTestProfile] = useState([]);
  const [testPlanList, setTestPlanList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  useEffect(() => {
    const storedEmail = localStorage.getItem("username");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);
  const [formValues, setFormValues] = useState({
    identifier: "",
    emailSubject: "",
    cronExpression: "",
    skus: "",
    campaign: "",
  });

  useEffect(() => {
    const jwtToken = getCookie("jwtToken");
    if (jwtToken) {
      setToken(jwtToken);
      getAllSubsidiaries();
      getSitesData(jwtToken);
      getAllEnvironments(jwtToken);
      getTestPlanData(jwtToken);
      getAllTestProfile(jwtToken);
      getcategoryList(jwtToken);
      getcronJobProfiles(jwtToken);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  
  // Function to handle removing a params set
  const handleRemoveParamClick = (index) => {
    setParams((prevParams) => prevParams.filter((_, i) => i !== index));
  };
  const handleParamChange = (index, value) => {
    const newParams = [...params];
    newParams[index] = value;
    setParams(newParams);
  };
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveClick = async () => {
    setLoading(true); // Start loading state
  
    try {
      console.log(token, "Token"); // Log the token for debugging
      const headers = { Authorization: `Bearer ${token}` };
  
      // Map through params to format input data
      const formattedInputs = params.map((input) => ({
        subsidiary: input.subsidiariedata,
        siteIsoCode: input.sitesdata,
        testProfile: input.testprofiledata,
        environment: input.environmentdata,
        testPlan: input.testplandata,
        categoryId: input.categorydata,
        cronProfileId: input.cronjobprofiledata,
      }));
  
      // Construct the request body
      const body = {
        cronJobs: [
          {
            cronTestPlanDtoList: formattedInputs,
            identifier: formValues.identifier,
            emailSubject: formValues.emailSubject,
            cronExpression: formValues.cronExpression,
            skus: formValues.skus,
            campaign: formValues.campaign,
            dashboard: selectedDashboard,
            cronProfileId: selectedCronJobProfile,
            envProfiles: selectEnviroment,
            status: ButtonActive, // Use button active status (true or false)
          },
        ],
      };
  
      console.log(body, "Request body from user"); // Log the request body
  
      // Send the POST request
      const response = await axios.post(`${api}/admin/qaCronJob/edit`, body, {
        headers,
      });
  
      console.log(response.data, "Response from API"); // Log the response data
      router.push("/cheil/admin/qaCronJob"); // Navigate to another page
    } catch (err) {
      // Improved error handling
      if (axios.isAxiosError(err)) {
        console.error(err.response?.data); // Log the response error from Axios
        setError(err.response?.data.message || "Error fetching qaCronJob data");
      } else {
        console.error(err); // Log non-Axios errors
        setError("Unexpected error occurred");
      }
    } finally {
      setLoading(false); // Stop loading state
    }
  };
  

  const breadscrums = "Admin > qaCronJob";
  const pagename = "Add New";

  const enviromentFields = [
    {
      value: "stag",
      label: "Stag",
    },

    {
      value: "prod-two",
      label: "Prod-two ",
    },
    {
      value: "prod",
      label: "Prod ",
    },
    {
      value: "dashboard",
      label: "Dashboard",
    },
  ];

  const [selectEnviroment, setSelectEnviroment] = useState([]); // Local state to manage node data

  const handleCronJobProfileChange = (value) => {
    setSelectEnviroment(value); // Capture selected node
  };

  const getAllSubsidiaries = async () => {
    try {
      const response = await axios.get(api + "/admin/subsidiary/get");
      setSubsidiary(response.data.subsidiaries);
      // console.log(response.data.subsidiaries, "subsidiaries fetched");
    } catch (error) {
      console.log(error, "error fetching subsidiaries");
    }
  };
  const getSitesData = async (token) => {
    try {
      const headers = { Authorization: "Bearer " + token };
      const response = await axios.get(api + "/admin/site/get", {
        headers,
      });
      setSitesList(response.data.sites); // Update the local node list state
      console.log(response.data.sites, "response.data.sites");
    } catch (error) {
      console.log(error, "Error fetching sites");
    }
  };
  const getAllEnvironments = async (token) => {
    try {
      const headers = { Authorization: "Bearer " + token };
      const response = await axios.get(api + "/admin/environment/get", {
        headers,
      });
      setEnvironments(response.data.environments);
      // console.log(response.data.environments, "environments fetched");
    } catch (error) {
      console.log("Error fetching environments", error);
    }
  };
  const getTestPlanData = async (token) => {
    try {
      const headers = { Authorization: "Bearer " + token };
      const response = await axios.get(api + "/admin/qa/get", {
        headers,
      });
      setTestPlanList(response.data.testPlans); // Update the local node list state
      // console.log(response.data.testPlans);
    } catch (error) {
      console.log(error, "Error fetching nodes");
    }
  };
  const getAllTestProfile = async (token) => {
    try {
      const headers = { Authorization: "Bearer " + token };
      console.log(token, "token from testProfile");
      const response = await axios.get(api + "/admin/profile/get", {
        headers,
      });
      setTestProfile(response.data.testProfiles);
      // console.log(response.data.testProfiles, "environments fetched");
    } catch (error) {
      console.log("Error fetching environments", error);
    }
  };
  const getcategoryList = async (token) => {
    try {
      const headers = { Authorization: "Bearer " + token };
      console.log(token, "token from testProfile");
      const response = await axios.get(api + "/admin/category/get", {
        headers,
      });
      setCategoryList(response.data.categories);
      // console.log(response.data.categories, "categories fetched");
    } catch (error) {
      console.log("Error fetching environments", error);
    }
  };
  const getcronJobProfiles = async (token) => {
    try {
      const headers = { Authorization: "Bearer " + token };
      console.log(token, "token from testProfile");
      const response = await axios.get(api + "/admin/cronjobProfile/get", {
        headers,
      });
      setCronJobProfile(response.data.cronJobProfiles);
      // console.log(response.data.categories, "categories fetched");
    } catch (error) {
      console.log("Error fetching environments", error);
    }
  };


  const [params, setParams] = useState([]);  
  const handleAddParamClick = () => {

    setParams((prevParams) => [
      ...prevParams,
      {
        subsidiariedata: '',
        sitesdata: '',
        testprofiledata: '',
        environmentdata: '',
        testplandata: '',
        categorydata: '',
        cronjobprofiledata: '',
      },
    ]);
  };
  // Function to handle input field changes
  const handleInputFieldChange = (index, fieldName, value) => {
    setParams((prevParams) => {
      const updatedParams = [...prevParams];
      updatedParams[index] = {
        ...updatedParams[index],
        [fieldName]: value,
      };
      return updatedParams;
    });
  };
  
  const handlesubsidiaryChange = async (newValue) => {
    if (!newValue || !newValue.recordId) {
      console.log("Invalid subsidiary selected");
      return;
    }
  
    const recordId = newValue.recordId;
    const headers = { Authorization: "Bearer " + token };
    const body = {
      recordId: recordId,
    };
  
    try {
      const enviromentresponse = await axios.post(`${api}/qa/getEnvironmentsForSubsidiary`, body,{
        headers,
        // params: { recordId },
      });  
      setEnvironments(enviromentresponse.data);

      const sitesresponse = await axios.post(api + "/qa/getSitesForSubsidiary",  body,{
        headers,
      });
      setSitesList(sitesresponse.data); 
      console.log(sitesList,"sitesList sitesListsitesList");

      const testplanresponse = await axios.post(api + "/qa/getTestPlanForSubsidiary",  body,{
        headers,
      });
      setTestPlanList(testplanresponse.data);    
      
      const testprofileresponse = await axios.post(api + "/qa/getTestProfileForSubsidiary",  body,{
        headers,
      });
      setTestProfile(testprofileresponse.data);

      const categoryresponse = await axios.post(api + "/qa/getCategoryForSubsidiary",  body,{
        headers,
      });
      setCategoryList(categoryresponse.data);
    } catch (error) {
      console.error("Error fetching environments for subsidiary", error);
    }
  };
  return (
    <AddNewPageButtons
      pagename={pagename}
      email={email}
      breadscrums={breadscrums}
      handleSaveClick={handleSaveClick}
    >
      <div
        className="flex flex-col w-full  min-h-screen gap-5"
        style={{ fontFamily: "SamsungOne, sans-serif" }}
      >
        <div className="bg-gray-200 flex flex-col pb-5 rounded-md">
          <div className="  w-[100%] flex items-center flex-row justify-center ">
            <div className="bg-white  w-[98%] rounded-md shadow-md flex flex-col justify-center gap-3 pb-4 p-2">
              <div className="flex flex-col rounded-lg bg-white border-solid border-2 border-white w-full">
                <div className=" flex-row justify-between grid grid-cols-3 gap-3">
                  <TextField
                    id="standard-textarea"
                    label="Identifier"
                    placeholder="Placeholder"
                    
                    variant="standard"
                    name="identifier"
                    value={formValues.identifier}
                    onChange={handleInputChange}
                  />
                  <TextField
                    id="standard-textarea"
                    label="Email Subject"
                    placeholder="Placeholder"
                    
                    variant="standard"
                    name="emailSubject"
                    value={formValues.emailSubject}
                    onChange={handleInputChange}
                  />

                  <Dashboard
                    selectedDashboard={selectedDashboard}
                    setSelectedDashboard={setSelectedDashboard}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4 items-center justify-center  flex-col">
                <TextField
                  id="standard-textarea"
                  label="Cronjob Expression"
                  placeholder="* * * * * *"
                  
                  variant="standard"
                  onClick={openModal}
                  name="cronExpression"
                  value={formValues.cronExpression}
                  onChange={handleInputChange}
                />

                <CronjobExpression
                  isOpen={isModalOpen}
                  setIsModalOpen={setIsModalOpen}
                />

                <CronJobProfile
                  selectedCronJobProfile={selectedCronJobProfile}
                  setSelectedCronJobProfile={setSelectedCronJobProfile}
                />

<Autocomplete
  multiple
  size="small"
  options={enviromentFields} // List of all environment types
  getOptionLabel={(option) => option.label} // Display 'label' for the dropdown options
  value={selectEnviroment.map((env) =>
    enviromentFields.find((item) => item.value === env) || null
  )} // Map back to full option objects based on stored values
  onChange={(event, newValue) => {
    // Set only the values of the selected items
    const selectedValues = newValue.map((option) => option.value);
    handleCronJobProfileChange(selectedValues); // Update the state with the array of values
  }}
  renderInput={(params) => (
    <TextField
      {...params}
      variant="standard"
      label="Select Environment Type"
    />
  )}
/>


              </div>

              <div className="flex flex-col gap-3 ">
                <div className="flex flex-row gap-3 items-center w-full justify-end">
                  {ButtonActive == false ? (
                    <button
                      onClick={() => setButtonActive(!ButtonActive)}
                      className="bg-[#fff] border-2 border-solid border-gray-400 rounded-md text-gray-500 text-xs px-2 py-0.5 w-[80px] animate__animated  animate__pulse"
                    >
                      Inactive
                    </button>
                  ) : (
                    <button
                      onClick={() => setButtonActive(!ButtonActive)}
                      className="bg-[#1581ed] border-2 border-solid border-[#1581ed] rounded-md text-white text-xs px-2 py-0.5 w-[80px] animate__animated  animate__pulse"
                    >
                      Active
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-row w-full p-3 justify-between gap-5">
            <div className="flex flex-row w-[50%]">
              <textarea
                placeholder="Enter SKU's "
                className="w-full h-44 border-solid border-2 border-gray-300 rounded-md p-2"
                name="skus"
                value={formValues.skus}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-row w-[50%]">
              <textarea
                placeholder="Enter campaign"
                className="w-full h-44 border-solid border-2 border-gray-300 rounded-md p-2"
                name="campaign"
                value={formValues.campaign}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col mt-4 p-4 w-[100%]">
          <div className=" flex-row gap-4 w-[100%] grid grid-cols-1">
            {params.map((param, index) => (
              <div
                key={index}
                className="grid grid-cols-4 flex-row items-center bg-white pb-2 rounded-md gap-5 justify-between p-2"
              >
                {/* Subsidiary Dropdown */}
                <Autocomplete
                  options={subsidiary || []}
                  getOptionLabel={(option) => option.identifier || ""}
                  value={
                    subsidiary.find(
                      (subs) => subs.recordId === param.subsidiariedata
                    ) || null
                  }
                  onChange={(event, newValue) => {
                    handleInputFieldChange(
                      index,
                      "subsidiariedata",
                      newValue?.recordId || ""
                    );
                    handlesubsidiaryChange(newValue);
                  }}
                  isOptionEqualToValue={(option, value) =>
                    option.recordId === value?.recordId
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Subsidiary"
                      variant="standard"
                    />
                  )}
                />

                {/* Sites Dropdown */}
                <Autocomplete
                  options={sitesList || []}
                  getOptionLabel={(option) => option.identifier || ""}
                  value={
                    sitesList.find(
                      (site) => site.recordId === param.sitesdata
                    ) || null
                  }
                  onChange={(event, newValue) => {
                    handleInputFieldChange(
                      index,
                      "sitesdata",
                      newValue?.recordId || ""
                    );
                  }}
                  isOptionEqualToValue={(option, value) =>
                    option.recordId === value?.recordId
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Sites"
                      variant="standard"
                    />
                  )}
                />

                {/* Test Profile Dropdown */}
                <Autocomplete
                  options={testProfile || []}
                  getOptionLabel={(option) => option.identifier || ""}
                  value={
                    testProfile.find(
                      (profile) => profile.recordId === param.testprofiledata
                    ) || null
                  }
                  onChange={(event, newValue) => {
                    handleInputFieldChange(
                      index,
                      "testprofiledata",
                      newValue?.recordId || ""
                    );
                  }}
                  isOptionEqualToValue={(option, value) =>
                    option.recordId === value?.recordId
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Test Profile"
                      variant="standard"
                    />
                  )}
                />

                {/* Environment Dropdown */}
                <Autocomplete
                  options={environments || []}
                  getOptionLabel={(option) => option.identifier || ""}
                  value={
                    environments.find(
                      (env) => env.recordId === param.environmentdata
                    ) || null
                  }
                  onChange={(event, newValue) => {
                    handleInputFieldChange(
                      index,
                      "environmentdata",
                      newValue?.recordId || ""
                    );
                  }}
                  isOptionEqualToValue={(option, value) =>
                    option.recordId === value?.recordId
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Environment"
                      variant="standard"
                    />
                  )}
                />

                {/* Test Plan Dropdown */}
                <Autocomplete
                  options={testPlanList || []}
                  getOptionLabel={(option) => option.identifier || ""}
                  value={
                    testPlanList.find(
                      (plan) => plan.recordId === param.testplandata
                    ) || null
                  }
                  onChange={(event, newValue) => {
                    handleInputFieldChange(
                      index,
                      "testplandata",
                      newValue?.recordId || ""
                    );
                  }}
                  isOptionEqualToValue={(option, value) =>
                    option.recordId === value?.recordId
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Test Plan"
                      variant="standard"
                    />
                  )}
                />

                {/* Category Dropdown */}
                <Autocomplete
                  options={categoryList || []}
                  getOptionLabel={(option) => option.identifier || ""}
                  value={
                    categoryList.find(
                      (category) => category.recordId === param.categorydata
                    ) || null
                  }
                  onChange={(event, newValue) => {
                    handleInputFieldChange(
                      index,
                      "categorydata",
                      newValue?.recordId || ""
                    );
                  }}
                  isOptionEqualToValue={(option, value) =>
                    option.recordId === value?.recordId
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Category"
                      variant="standard"
                    />
                  )}
                />

                {/* Cronjob Profile Dropdown */}
                <Autocomplete
                  options={cronJobProfile || []}
                  getOptionLabel={(option) => option.identifier || ""}
                  value={
                    cronJobProfile.find(
                      (cronjob) => cronjob.recordId === param.cronjobprofiledata
                    ) || null
                  }
                  onChange={(event, newValue) => {
                    handleInputFieldChange(
                      index,
                      "cronjobprofiledata",
                      newValue?.recordId || ""
                    );
                  }}
                  isOptionEqualToValue={(option, value) =>
                    option.recordId === value?.recordId
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Cronjob Profile"
                      variant="standard"
                    />
                  )}
                />

                {/* Remove Button */}
                <button
                  className="flex items-center justify-center p-2 rounded-md bg-red-600 text-white"
                  onClick={() => handleRemoveParamClick(index)}
                  style={{ width: "30px", height: "30px" }}
                >
                  <FaMinus />
                </button>
              </div>
            ))}
          </div>
          <button
            className="flex items-center justify-center w-36 mt-4 p-2 rounded-md bg-black text-white"
            onClick={handleAddParamClick}
          >
            Add Test Plan
          </button>
        </div>
      </div>
    </AddNewPageButtons>
  );
};

export default addQacronjob;
