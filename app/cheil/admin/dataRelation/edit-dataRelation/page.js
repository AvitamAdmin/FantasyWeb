"use client";
import React, { useEffect, useState } from "react";
import { FaMinus } from "react-icons/fa";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import axios from "axios";
import AddNewPageButtons from "@/app/src/components/AddNewPageButtons/AddNewPageButtons";
import { api } from "@/envfile/api";
import { useDispatch, useSelector } from "react-redux";
import { getCookie } from "cookies-next";
import { clearAllEditRecordIds } from "@/app/src/Redux/Slice/slice";
import Lottie from "react-lottie";
import * as animationData from "../../../../../assests/LoadingAnimation.json";

const EditDataRelation = () => {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editInputfields, setEditInputfields] = useState([]);
  const router = useRouter();
  const [params, setParams] = useState([
    { fetchInputFields: [], selectedNode: "" },
  ]);

  const dispatch = useDispatch();
  const selectedID = useSelector((state) => state.tasks.multipleEditRecordId);

  useEffect(() => {
    const jwtToken = getCookie("jwtToken");
    if (jwtToken) {
      setToken(jwtToken);
      handleFetchData(jwtToken);
      getfetchInputFields(jwtToken);
    }
  }, []);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  
  const handleDatasourceChange = async (index, value) => {
    const updatedParams = [...params];
    updatedParams[index].selectedDataSource = value; // Update specific param's selectedDataSource
  
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const body = { recordId: value };
      const response = await axios.post(`${api}/admin/dataRelation/getDatasourceParamsForId`, body, { headers });
  
      updatedParams[index].fetchInputFields = response.data.params; // Set fetched input fields for this param
    } catch (error) {
      console.log("Error fetching input fields", error);
    }
  
    setParams(updatedParams); // Update the state with the modified params
  };

  const handleAddParamClick = () => {
    setParams([...params, { fetchInputFields: [], selectedNode: "" }]);
  };
  
  

  const handleRemoveParamClick = (index) => {
    const newParams = params.filter((_, i) => i !== index);
    setParams(newParams);
  };

  const handleParamChange = (index, selectedValue) => {
    const newParams = [...params];
    newParams[index].selectedNode = selectedValue;
    setParams(newParams);
  };
  

  
 
  
  const [fetchInputFields, setFetchInputFields] = useState([]);
  const getfetchInputFields = async (dataSourceId) => {
    console.log("getfetchInputFields triggered");
    
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const body = { recordId: dataSourceId };
      const response = await axios.post(`${api}/admin/dataRelation/getDatasourceParamsForId`, body, {
        headers,
      });
      return response;
    } catch (error) {
      console.error("Error fetching params", error);
    }
  };
  

  

  // Handle input field change
  const handleInputChange = async (e, index, paramIndex = null) => {
    const { name, value } = e.target;
    const updatedFields = [...editInputfields];
  
    if (paramIndex !== null) {
      updatedFields[index].dataRelationParams[paramIndex] = {
        ...updatedFields[index].dataRelationParams[paramIndex],
        [name]: value,
      };
  
      // If dataSource is changed, fetch params for the new dataSource
      if (name === "dataSource") {
        const fetchParamsResponse = await getfetchInputFields(value);
        updatedFields[index].dataRelationParams[paramIndex].fetchInputFields =
          fetchParamsResponse.data.params || [];
      }
    } else {
      updatedFields[index] = { ...updatedFields[index], [name]: value };
    }
  
    setEditInputfields(updatedFields);
  };
  

  const handleButtonClick = (index) => {
    const updatedFields = [...editInputfields];
    updatedFields[index].ButtonActive = !updatedFields[index].ButtonActive;
    setEditInputfields(updatedFields);
  };

  // Handle generator button toggle for each item
  const handleToggleGenerator = (index) => {
    const updatedFields = [...editInputfields];
    updatedFields[index] = {
      ...updatedFields[index],
      enableGenerator: !updatedFields[index].enableGenerator,
    };
    setEditInputfields(updatedFields);
  };

  // Handle POST request
  const handlePostClick = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const body = {
        dataRelations: editInputfields.map((item) => ({
          recordId: item.recordId,
          identifier: item.identifier || "-",
          shortDescription: item.shortDescription || "-",
          enableGenerator: item.enableGenerator,
          status: item.ButtonActive,
          dataRelationParams: item.dataRelationParams.map((param) => ({
            sourceKeyOne: param.sourceKeyOne,
            dataSource: param.dataSource,
          })),
        })),
      };

      console.log(body, "Request body");
      const response = await axios.post(
        `${api}/admin/dataRelation/edit`,
        body,
        { headers }
      );
      console.log(response.data, "API Response");
      dispatch(clearAllEditRecordIds());

      router.push("/cheil/admin/dataRelation");
    } catch (err) {
      setError("Error saving data");
    } finally {
      setLoading(false);
    }
  };

  // Fetch initial data
  const [dataSourceList, setDataSourceList] = useState([]);

  const handleFetchData = async (jwtToken) => {
    try {
      const headers = { Authorization: `Bearer ${jwtToken}` };
      const body = {
        dataRelations: selectedID.map((id) => ({ recordId: id })),
      };

      const response = await axios.post(
        `${api}/admin/dataRelation/getedits`,
        body,
        { headers }
      );
      console.log(response.data.dataRelations, "API Response");

      const response2 = await axios.get(api + "/admin/datasource/get", {
        headers,
      });
      setDataSourceList(response2.data.dataSources); // Update the local node list state
      console.log(response2.data.dataSources);

      
     
      // Initialize buttonActive and enableGenerator for each item
      const dataWithDefaults = response.data.dataRelations.map((item) => ({
        ...item,
        ButtonActive: item.status || false,
        enableGenerator: item.enableGenerator || false,
        params:item.dataRelationParams || []
      }));

      setEditInputfields(dataWithDefaults);
    } catch (err) {
      setError("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  const handleRunClick = () => {
    alert("Run function executed from EditDataRelation!");  
  };

  return (
    <AddNewPageButtons
      pagename="Edit"
      breadscrums="Admin > DataRelation"
      handleSaveClick={handlePostClick}
      handleRunClick={handleRunClick}
    >
      {loading ? (
        <>
          <div className="flex flex-row justify-center items-center w-full h-40">
            <div className="gap-5 flex flex-col items-center justify-center">
              <CircularProgress size={36} color="inherit" />
              <div>Loading...</div>
            </div>
          </div>
        </>
      ) : (
        <>
          {editInputfields.length < 1 ? (
            <div className="w-full flex flex-col  h-40 justify-center items-center">
              <div className="opacity-35 ">
                <Lottie options={defaultOptions} height={100} width={100} />
              </div>
              <div>No data data found...</div>
            </div>
          ) : (
            <>
              <div className="p-2">
                <div className="flex flex-col bg-gray-200 p-2 gap-3 rounded-md">
                  {editInputfields.map((item, index) => (
                    <div
                      key={item.recordId}
                      className="bg-white p-4 rounded-md shadow-md"
                    >
                      <div className="grid grid-cols-3 gap-5 mb-4">
                        <TextField
                          label="Identifier"
                          variant="standard"
                          name="identifier"
                          value={item.identifier || ""}
                          onChange={(e) => handleInputChange(e, index)}
                        />
                        <TextField
                          label="Short Description"
                          variant="standard"
                          name="shortDescription"
                          value={item.shortDescription || ""}
                          onChange={(e) => handleInputChange(e, index)}
                        />
                        <div className="flex flex-row gap-6 justify-end items-end">
                          {item.ButtonActive ? (
                            <button
                              onClick={() => handleButtonClick(index)}
                              className="bg-[#1581ed] border-2 border-solid border-[#1581ed] rounded-md text-white text-xs px-2 py-0.5 w-[80px]"
                            >
                              Active
                            </button>
                          ) : (
                            <button
                              onClick={() => handleButtonClick(index)}
                              className="bg-[#fff] border-2 border-solid border-gray-400 rounded-md text-gray-700 text-xs px-2 py-0.5 w-[80px]"
                            >
                              Inactive
                            </button>
                          )}

                          <button
                            onClick={() => handleToggleGenerator(index)}
                            className={`${
                              item.enableGenerator
                                ? "bg-blue-500 text-white"
                                : "bg-white text-blue-500"
                            } border-2 border-blue-500 rounded-md text-xs px-2 py-0.5 w-[80px]`}
                          >
                            Generator
                          </button>
                        </div>
                      </div>

                      {/* Render dataRelationParams */}
                      {item.params && item.params.map((param, paramIndex) => (
  <div key={paramIndex} className="grid grid-cols-2 gap-5 mb-4">
    <TextField
      variant="standard"
      select
      SelectProps={{ native: true }}
      name="dataSource"
      value={param.dataSource || ""}
      onChange={(e) => handleInputChange(e, index, paramIndex)}
    >
      <option value="">Select DataSource</option>
      {dataSourceList.map((option) => (
        <option key={option.recordId} value={option.recordId}>
          {option.identifier}
        </option>
      ))}
    </TextField>
 
    <TextField
      variant="standard"
      select
      SelectProps={{ native: true }}
      name="sourceKeyOne"
      value={param.sourceKeyOne || ""}
      onChange={(e) => handleInputChange(e, index, paramIndex)}
    >
      <option value="">Select Params</option>
      {(param.fetchInputFields || []).map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </TextField>
  </div>
))}

<div className="flex flex-col mt-4 w-[100%]">
        <div className="grid grid-cols-1 gap-4">
  {params.map((param, index) => (
    <div key={index} className="flex items-center gap-5 p-4 w-full">
     <Autocomplete
  className="text-xs w-full"
  style={{ marginTop: "2.5vh" }}
  options={dataSourceList || []} // Options list from dataSourceList
  getOptionLabel={(option) => option.identifier || ""} // Display identifier
  value={
    dataSourceList.find((option) => option.recordId === param.selectedDataSource) || null // Find the selected dataSource
  }
  onChange={(event, newValue) => {
    handleDatasourceChange(index, newValue?.recordId || ""); // Pass index and update dataSource
  }}
  isOptionEqualToValue={(option, value) => option.recordId === value?.recordId} // Compare by recordId
  renderInput={(params) => (
    <TextField 
      {...params}
      label="Select DataSource"
      variant="standard"
    /> 
  )}
/>



      {/* Display fetchInputFields for the selected DataSource */}
      <Autocomplete
  className="text-xs w-[80%] mt-5"
  options={param.fetchInputFields || []} // Options list from fetchInputFields
  getOptionLabel={(option) => option || ""} // Display the option itself
  value={param.selectedNode || null} // Use param.selectedNode for value
  onChange={(event, newValue) => handleParamChange(index, newValue || "")} // Pass the index and new value
  renderInput={(params) => (
    <TextField
      {...params}
      label="Select Params" // Label for the Autocomplete
      variant="standard"
    />
  )}
/>


      <button
        className="flex items-center justify-center p-2 rounded-md bg-red-600 text-white w-[30px]"
        onClick={() => handleRemoveParamClick(index)}
      >
        <FaMinus />
      </button>
    </div>
  ))}
</div>

          <button
            className="flex items-center justify-center mt-4 p-2 rounded-md bg-black text-white w-[150px] h-[40px]"
            onClick={handleAddParamClick}

          >
            Add an input field
          </button>
        </div>




                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </>
      )}
    </AddNewPageButtons>
  );
};

export default EditDataRelation;

