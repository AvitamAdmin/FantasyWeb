"use client";
import React, { useEffect, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { TbClockEdit, TbClockPlus } from "react-icons/tb";
import { useRouter } from "next/navigation";
import axios from "axios";
import AddNewPageButtons from "@/app/src/components/AddNewPageButtons/AddNewPageButtons";
import { api } from "@/envfile/api";
import { useDispatch, useSelector } from "react-redux";
import { getCookie } from "cookies-next";
import NodeDropdown from "@/app/src/components/dropdown/Node";
import DataRelation from "@/app/src/components/dropdown/DataRelation";
import SingleSelectSubsidiary from "@/app/src/components/dropdown/Subsidiary";
import { clearAllEditRecordIds } from "@/app/src/Redux/Slice/slice";
import MultiSelectSubsidiary from "@/app/src/components/multiSelectDropdown/Subsidiary";
import Lottie from "react-lottie";
import * as animationData from "../../../../../assests/LoadingAnimation.json";


const EditMapping = () => {
  const selectedID = useSelector((state) => state.tasks.multipleEditRecordId);

  useEffect(() => {
    const jwtToken = getCookie("jwtToken");
    if (jwtToken) {
      setToken(jwtToken);
      handlefetchData(jwtToken);
      console.log("JWT Token retrieved:", jwtToken);
    } else {
      console.log("No token found");
    }
  }, [selectedID]);  // Add selectedID as a dependency

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  
  const [token, setToken] = useState("");
  const [params, setParams] = useState([]);
  const [error, setError] = useState(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("");
  const [editInputfields, setEditInputfields] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [initialload, setInitialLoad] = useState(true);
  const [selectedSubsidiary, setSelectedSubsidiary] = useState([]);
  const [dataRelation, setDataRelation] = useState([]);
  const [selectedDataRelation, setSelectedDataRelation] = useState("");
  const [datasourceData, setDatasourceData] = useState([]);
  const [datasourceDataParams, setDatasourceDataParams] = useState([]);

  useEffect(() => {
    const storedEmail = localStorage.getItem("username");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const handleAddParamClick = (index) => {
    const updatedFields = [...editInputfields];
    if (!updatedFields[index].params) {
      updatedFields[index].params = [];
    }

    updatedFields[index].params.push("");
    setEditInputfields(updatedFields);
  };
  const handleRemoveParamClick = (fieldIndex, paramIndex) => {
    const updatedFields = [...editInputfields];
    updatedFields[fieldIndex].params.splice(paramIndex, 1);
    setEditInputfields(updatedFields);
  };

  const handleParamChange = (index, value) => {
    const newParams = [...params];
    newParams[index] = value;
    setParams(newParams);
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
  
    const updatedFields = editInputfields.map((item, i) => {
      if (i === index) {
        if (name === "parentNode") {
          return {
            ...item,
            parentNode: { ...item.parentNode, identifier: value }, 
          };
        }
        return { ...item, [name]: value };
      }
      return item;
    });
  
    setEditInputfields(updatedFields);
  };
  

  const handleFormatChange = (format) => {
    setSelectedFormat(format); 
  };
  
  const dispatch = useDispatch();
  const handlePostClick = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
  
      
      const body = {
        sourceTargetMappings: editInputfields.map((item) => ({
          recordId: item.recordId,
          identifier: item.identifier || "-",
          shortDescription: item.shortDescription || "-",
          node: item.node,
          dataRelation: item.dataRelation,
          status: item.ButtonActive,
          enableVariant: item.EnableVariant, 
          enableToggle: item.EnableBundle, 
          enableCurrentPage: item.EnableCurrentPage, 
          enableCategory: item.EnableCategory, 
          enableVoucher: item.EnableVoucher,
          subsidiaries:item.subsidiaries,
          sourceTargetParamMappings: item.params,
        })),
      };
  
      console.log(body, "req body from user");
      console.log(token, "token");
  
      const response = await axios.post(`${api}/admin/mapping/edit`, body, { headers });
      router.push("/cheil/admin/mapping");
      dispatch(clearAllEditRecordIds());

      console.log(response.data, "response from API");
    } catch (err) {
      setError("Error saving Datasource data");
      console.error(err);
    } 
  };
  


  const handlefetchData = async (jwtToken) => {
    try {
      setLoading(true);
      if (!selectedID || selectedID.length === 0) {
        console.error("selectedID is empty");
        return;
      }
      
      const headers = { Authorization: `Bearer ${jwtToken}` };
      const body = { sourceTargetMappings: selectedID.map((id) => ({ recordId: id })) };
  
      console.log("Sending request with body:", body);
  
   
      const response = await axios.post(`${api}/admin/mapping/getedits`, body, { headers });
  console.log(response,"responce from api");
  
  
      if (response?.data?.sourceTargetMappings) {
        const sourceTargetMappings = response.data.sourceTargetMappings.map((item) => ({
          ...item,
          ButtonActive: item.status || false,
          EnableVariant: item.enableVariant || false,
          EnableBundle: item.enableToggle || false,
          EnableCurrentPage: item.enableCurrentPage || false,
          EnableCategory: item.enableCategory || false,
          EnableVoucher: item.enableVoucher || false,
          params: item.sourceTargetParamMappings || [],
        }));
      setLoading(false);

        setEditInputfields(sourceTargetMappings);
      } else {
        setError("Error: Unexpected response structure");
      }    } catch (err) {
      console.error("Error fetching data:", err);

      setError("Error fetching Datasource data");
    }
  };
  

  const handleRunClick = () => {
    alert("Run function executed from EditMapping!");
  };

  const pagename = "Edit";
  const breadscrums = "Admin > Mapping";

  const handleToggleButton = (index, fieldName) => {
    setEditInputfields((prevFields) => {
      return prevFields.map((item, i) => {
        if (i === index) {
          return {
            ...item,
            [fieldName]: !item[fieldName],
          };
        }
        return item;
      });
    });
  };
  const handleToggleButtonActive = (index) => {
    setEditInputfields((prevFields) => {
      return prevFields.map((item, i) => {
        if (i === index) {
          return {
            ...item,
            ButtonActive: !item.ButtonActive,
          };
        }
        return item;
      });
    });
  };
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
  const getDataSourcesParams = async (selectedRecordId) => {
    try {
      const headers = { Authorization: "Bearer " + token };
      const body = {
        recordId: selectedRecordId, 
      };
      
      console.log(selectedRecordId, "selectedDatasource from dataSources");
      
      const response = await axios.post(
        api + "/admin/mapping/getDataSourceParamsById",
        body,
        { headers }
      );
      
      setDatasourceDataParams(response.data);
      console.log(response.data, "dataSources Params fetched");
    } catch (error) {
      console.log("Error fetching dataSources data", error);
    }
  };
  return (
    <AddNewPageButtons
      pagename={pagename}
      email={email}
      breadscrums={breadscrums}
      handleSaveClick={handlePostClick}
      handleRunClick={handleRunClick}
    >
     
     {
      loading ? (<>
        <div className="flex flex-row justify-center items-center w-full h-40">
        <div className="gap-5 flex flex-col items-center justify-center">
        <CircularProgress size={36} color="inherit" />
        <div>Loading...</div>
        </div>
          </div>
          
          </>) :(
            <>
            {
              editInputfields.length < 1 ? (
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
              <div className="grid grid-cols-4 gap-5 mb-4">
                <TextField
                  label="Identifier"
                  variant="standard"
                  className="text-xs mt-1"
                  name="identifier"
                  value={item.identifier || ""}
                  onChange={(e) => handleInputChange(e, index)} // Pass index
                />
                <TextField
                  label="Short Description"
                  variant="standard"
                  className="text-xs mt-1"
                  name="shortDescription"
                  value={item.shortDescription || ""}
                  onChange={(e) => handleInputChange(e, index)} // Pass index
                />
                <MultiSelectSubsidiary initialload={initialload} setSelectedSubsidiary={(newNode) => {
                    const updatedFields = editInputfields.map((field, i) => {
                      if (i === index) {
                        return { ...field, subsidiaries: newNode }; // Update node data
                      }
                      return field;
                    });
                    setEditInputfields(updatedFields); // Update state
                  }} selectedSubsidiary={item.subsidiaries} />
                 
                <NodeDropdown initialload={initialload}
                  selectedNode={item.node } // Pass selected node
                  setSelectedNode={(newNode) => {
                    const updatedFields = editInputfields.map((field, i) => {
                      if (i === index) {
                        return { ...field, parentNode: newNode }; // Update node data
                      }
                      return field;
                    });
                    setEditInputfields(updatedFields); // Update state
                  }}
                />
                  <DataRelation initialload={initialload}
                    selectedDataRelation={item.dataRelation}
                    setSelectedDataRelation={(newNodes) => {
                      const updatedFields = editInputfields.map((field, i) => {
                        if (i === index) {
                          return { ...field, dataRelation: newNodes }; // Update dataRelation
                        }
                        return field;
                      });
                      setEditInputfields(updatedFields); // Update state
                    }}
                  />
              </div>
              <div>
              <div className=" gap-4 mb-4 items-center justify-center flex w-full flex-col">
                

                 <div className="flex flex-row gap-3 w-full justify-start">
            {/* Voucher Button */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => handleToggleButton(index, 'EnableVoucher')}
                className={`${
                  item.EnableVoucher
                    ? 'bg-[#1581ed] text-white border-[#1581ed]'
                    : 'bg-[#fff] text-gray-500 border-gray-400'
                } border-2 border-solid rounded-md text-xs px-2 py-0.5 w-[80px] animate__pulse`}
              >
                Voucher
              </button>
            </div>

            {/* Category Button */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => handleToggleButton(index, 'EnableCategory')}
                className={`${
                  item.EnableCategory
                    ? 'bg-[#1581ed] text-white border-[#1581ed]'
                    : 'bg-[#fff] text-gray-500 border-gray-400'
                } border-2 border-solid rounded-md text-xs px-2 py-0.5 w-[80px] animate__pulse`}
              >
                Category
              </button>
            </div>

            {/* Current Page Button */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => handleToggleButton(index, 'EnableCurrentPage')}
                className={`${
                  item.EnableCurrentPage
                    ? 'bg-[#1581ed] text-white border-[#1581ed]'
                    : 'bg-[#fff] text-gray-500 border-gray-400'
                } border-2 border-solid rounded-md text-xs px-2 py-0.5 w-[100px] animate__pulse`}
              >
                Current Page
              </button>
            </div>

            {/* Bundle Button */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => handleToggleButton(index, 'EnableBundle')}
                className={`${
                  item.EnableBundle
                    ? 'bg-[#1581ed] text-white border-[#1581ed]'
                    : 'bg-[#fff] text-gray-500 border-gray-400'
                } border-2 border-solid rounded-md text-xs px-2 py-0.5 w-[80px] animate__pulse`}
              >
                Bundle
              </button>
            </div>

            {/* Variant Button */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => handleToggleButton(index, 'EnableVariant')}
                className={`${
                  item.EnableVariant
                    ? 'bg-[#1581ed] text-white border-[#1581ed]'
                    : 'bg-[#fff] text-gray-500 border-gray-400'
                } border-2 border-solid rounded-md text-xs px-2 py-0.5 w-[80px] animate__pulse`}
              >
                Variant
              </button>
            </div>
          </div>
              </div>

              <div className="flex flex-col gap-3 ">
              <div className="flex flex-row gap-3 items-center w-full justify-end">
            {item.ButtonActive === false ? (
              <button
                onClick={() => handleToggleButtonActive(index)} // Handle button click to toggle the state
                className="bg-[#fff] border-2 border-solid border-gray-400 rounded-md text-gray-700 text-xs px-2 py-0.5 w-[80px] animate__animated  animate__pulse"
              >
                InActive
              </button>
            ) : (
              <button
                onClick={() => handleToggleButtonActive(index)} // Handle button click to toggle the state
                className="bg-[#1581ed] border-2 border-solid border-[#1581ed] rounded-md text-white text-xs px-2 py-0.5 w-[80px] animate__animated  animate__pulse"
              >
                Active
              </button>
            )}
          </div>
              </div>
            </div>
              <div className="p-2 gap-2 flex flex-col">
          <div className="flex flex-col mt-4 p-4 w-[100%]">
     <div className="flex-row gap-4 w-[100%] grid grid-cols-1">
 {item.params &&
    item.params.map((param, paramIndex) => (
    <div key={paramIndex} className="items-center justify-between gap-5 grid grid-cols-5 w-[100%] p-2">
      <TextField
        className="mt-5"
        placeholder="*Input the Report Header"
        variant="standard"
        size="small"
        value={param.header}  
        onChange={(e) => handleInputFieldChange(index, "name", e.target.value)}
      />
 
      <Autocomplete
              options={datasourceData || []}
              getOptionLabel={(option) => option.identifier || ""}
              
              value={datasourceData.find((ds) => ds.recordId === param.dataSource) || null}
              onChange={(event, newValue) => {
                handleInputFieldChange(index, "dataSourceData", newValue?.recordId || "");
                if (newValue?.recordId) {
                  getDataSourcesParams(newValue.recordId); // Fetch data source params
                }
              }}
              isOptionEqualToValue={(option, value) => option.recordId === value?.recordId}
              renderInput={(params) => (
                <TextField {...params} label="Select dataSourceData" variant="standard" />
              )}
            />

            <Autocomplete
              options={datasourceDataParams || []}
              getOptionLabel={(option) => option || ""}
              value={param.dataSourceParams || null}
              onChange={(event, newValue) => {
                handleInputFieldChange(index, "dataSourceParams", newValue || "");
              }}
              isOptionEqualToValue={(option, value) => option === value}
              renderInput={(params) => (
                <TextField {...params} label="Select Params" variant="standard" />
              )}
            />

      <div className="flex flex-row gap-5 justify-center items-end">
        <button
        
          onClick={() => toggleButtonState(index, "status")}
          className={`${
            param.status ? "bg-[#1581ed] text-white" : "bg-[#fff] text-gray-700"
          } border-2 border-solid border-${param.status ? "#1581ed" : "gray-400"} rounded-md text-xs px-2 py-0.5 w-[70px] h-[25px]`}
        >
          Pivot
        </button>

        <button
          className="flex items-center justify-center p-2 rounded-md bg-red-600 text-white"
          onClick={() => handleRemoveParamClick(index)}
          style={{ width: "30px", height: "30px" }}
        >
          <FaMinus />
        </button>
      </div>
    </div>
  ))}
</div>

  <button
                        className="flex items-center justify-center  p-2 rounded-md bg-black text-white"
                        onClick={() => handleAddParamClick(index)}
                        style={{ width: "100px", height: "40px" }}
                      >
                        Add Param
                      </button>
    </div>
        </div>
            </div>
            
            
          ))}
        </div>

        
      </div>
                </>
              )
            }
            </>
          )
     }


   
    </AddNewPageButtons>
  );
};

export default EditMapping;
