"use client";
import React, { useState, useEffect } from "react";
import { FaMinus } from "react-icons/fa";
import { Autocomplete, TextField, } from "@mui/material";
import 'animate.css';
import AddNewPageButtons from "@/app/src/components/AddNewPageButtons/AddNewPageButtons";
import axios from "axios";
import { api } from "@/envfile/api";
import { getCookie } from "cookies-next";
import Node from "@/app/src/components/dropdown/Node";
import DataRelation from "@/app/src/components/dropdown/DataRelation";
import { useRouter } from "next/navigation";
import NodeDropdown from "@/app/src/components/dropdown/Node";
import MultiSelectNode from "@/app/src/components/multiSelectDropdown/MultiSelectNode";
import toast, { Toaster } from "react-hot-toast";

const addCompiler = () => {
  const [ButtonActive, setButtonActive] = useState(false);
  const [nodes, setNode] = useState([]);
  const [token, setToken] = useState("");
  const [email, setEmail] = useState('');
  const [subsidiary, setSubsidiary] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [datasourceData, setDatasourceData] = useState([]);
  const [datasourceDataParams, setDatasourceDataParams] = useState([]);
  const [selectedNodeInterface, setSelectedNodeInterface] = useState([]);
  const [selectedDataRelation, setSelectedDataRelation] = useState("");
  const [editInputfields,seteditInputfields] = useState([]);
  const router = useRouter();

  const [formValues, setFormValues] = useState({
    identifier: '',
    shortDescription: '',

  });

  useEffect(() => {
    const jwtToken = getCookie("jwtToken");
    if (jwtToken) {
      setToken(jwtToken);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };

  const [params, setParams] = useState([]);


  const handleAddParamClick = () => {
    getDataSources();

    setParams((prevParams) => [
      ...prevParams,
      {
        name: '',
        dataSourceData: '',
        dataSourceParams: '',
        ButtonPivot: false,
      },
    ]);
  };
 

  const handleRemoveParamClick = (index) => {
    const newParams = params.filter((_, i) => i !== index);
    setParams(newParams);
  };


  const handleSaveClick = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const reportCompilerMappings = params.map(input => ({
        header: input.name,
        dataSource: input.dataSourceData,
        param: input.dataSourceParams,
        isPivot:input.ButtonPivot
      }));
      const body = {
        reportCompilers: [{
          identifier: formValues.identifier,
          shortDescription: formValues.shortDescription,
          node: selectedNode,
          reportInterfaces: selectedNodeInterface,
          dataRelation: selectedDataRelation,
          status: ButtonActive, // Use button active status (true or false)
          reportCompilerMappings:reportCompilerMappings
        }]
      };

      console.log(body, "req body from user");
      // console.log(selectedNode, "selectedNode");
      // console.log(selectedNodeInterface, "selectedNodeInterface");

      const response = await axios.post(`${api}/admin/reportCompiler/edit`, body, { headers });
      console.log(response.data, "response from api");
      router.push("/cheil/admin/reportCompiler");
    } catch (err) {
      setError("Error fetching reportCompiler data");
    } finally {
      setLoading(false);
    }
  };



  const breadscrums = "Admin > reportCompiler"
  const pagename = "Add New"

  const getDataSources = async () => {
    try {
      const headers = { Authorization: "Bearer " + token };
    const body = {
      recordId: selectedDataRelation,
    };
      console.log(selectedDataRelation, "selectedDataRelation from dataSources");
      const response = await axios.post(api + "/admin/mapping/getDataSourcesByRelationId",body, {
        headers,
      });
      setDatasourceData(response.data);
      console.log(response.data, "dataSources dataSources fetched");
    } catch (error) {
      console.log("Error fetching dataSources data", error);
    }
  };
  const getDataSourcesParams = async (selectedRecordId) => {
    try {
      const headers = { Authorization: "Bearer " + token };
      const body = {
        recordId: selectedRecordId,  // Use the selected recordId passed from onChange
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
 
  const toggleButtonState = (index, buttonName) => {
    const updatedFields = editInputfields.map((item, i) => {
      if (i === index) {
        return { ...item, [buttonName]: !item[buttonName] }; // Toggle button state
      }
      return item;
    }
    
  );
  seteditInputfields(updatedFields);
  const newInputs = [...params];
    
    // Toggle only the specific button for this row
    newInputs[index][buttonType] = !newInputs[index][buttonType];
    
    setParams(newInputs);
  
    
  };

  return (
    <AddNewPageButtons pagename={pagename} email={email} breadscrums={breadscrums}
      handleSaveClick={handleSaveClick} >
      <div
        className="flex flex-col w-full   "
        style={{ fontFamily: "SamsungOne, sans-serif" }}
      >
        <Toaster />



        <div className="bg-gray-200 flex flex-col pb-5 rounded-md">


          <div className="  w-[100%] flex items-center flex-row justify-center ">
            <div className="bg-white gap-5 w-[98%] rounded-md shadow-md flex flex-col justify-center  pb-4 p-2">
              <div className="flex flex-col gap-4 rounded-lg bg-white border-solid border-2 border-white w-full">
                <div className=" flex-row justify-between grid grid-cols-3 gap-3">
                  <TextField
                    id="standard-textarea"
                    label="Enter Identifier"
                    placeholder="Placeholder"
                    variant="standard"
                    name="identifier"
                    value={formValues.identifier}
                    onChange={handleInputChange}
                  />
                  <TextField
                    id="standard-textarea"
                    label="Description"
                    placeholder="Placeholder"
                    variant="standard"
                    name="shortDescription"
                    value={formValues.shortDescription}
                    onChange={handleInputChange}
                  />


                  <NodeDropdown selectedNode={selectedNode} setSelectedNode={setSelectedNode} /> 


                </div>
              </div>

              <div className="flex flex-row w-[100%] text-sm ">
                <div className="flex flex-col gap-5 w-full">
                  <div className="flex flex-row gap-5 w-full justify-between">

                    <div className="w-[33%]">
                      <DataRelation
                        setSelectedDataRelation={setSelectedDataRelation}
                        selectedDataRelation={selectedDataRelation}

                      />
                    </div>

                    <div className="w-[33%] mt-5">
                      {/* <NodeDropdown selectedNode={selectedNodeInterface} setSelectedNode={setSelectedNodeInterface} /> */}
                      <MultiSelectNode selectedNodes={selectedNodeInterface} setSelectedNodes={setSelectedNodeInterface}/>
                    </div>

                    <div className="flex flex-row  items-center mt-8 w-[33%] justify-end">
                      {ButtonActive ? (
                        <button
                          onClick={() => setButtonActive(!ButtonActive)}
                          className=" border-[#1581ed] bg-[#1581ed] text-center pt-0.5 border-2 border-solid rounded-md text-white text-xs px-2 py-0.5 w-[80px] animate__animated  animate__pulse"
                        >
                          Active
                        </button>
                      ) : (
                        <button
                          onClick={() => setButtonActive(!ButtonActive)}
                          className="border-2 border-solid bg-[#fff]  border-gray-400 rounded-md text-gray-500  text-xs px-2 py-0.5 w-[80px] animate__animated  animate__pulse"
                        >
                           Inactive
                        </button>
                      )}
                    </div>



                  </div>
                </div>


              </div>

            </div>
          </div>
        </div>

        <div className="flex flex-col mt-4 p-4 w-[100%]">
      <div className="flex-row gap-4 w-[100%] grid grid-cols-1">
        {params.map((param, index) => (
          <div
            key={index}
            className="items-center justify-between gap-5 grid grid-cols-5 w-[100%] p-2"
          >
            <TextField
              className="mt-5"
              placeholder="*Input the Report Header"
              variant="standard"
              size="small"
              value={param.name}
              onChange={(e) => handleInputFieldChange(index, "name", e.target.value)}
            />

            <Autocomplete
              options={datasourceData || []}
              getOptionLabel={(option) => option.identifier || ""}
              value={datasourceData.find((ds) => ds.recordId === param.dataSourceData) || null}
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
                onClick={() => toggleButtonState(index, "ButtonPivot")}
                className={`${
                  param.ButtonPivot ? "bg-[#1581ed] text-white" : "bg-[#fff] text-gray-700"
                } border-2 border-solid border-${param.ButtonPivot ? "#1581ed" : "gray-400"} rounded-md text-xs px-2 py-0.5 w-[70px] h-[25px]`}
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
        className="flex items-center justify-center mt-4 p-2 rounded-md text-white"
        onClick={() => {
          if (selectedDataRelation) {
            handleAddParamClick();
          } else {
            toast.error("Select DataRelation to Add Param");
            console.log("Select DataRelation to add param");
          }
        }}
        style={{
          width: "100px",
          height: "40px",
          backgroundColor: selectedDataRelation ? "black" : "grey",
          cursor: selectedDataRelation ? "pointer" : "not-allowed",
        }}
      >
        Add Param
      </button>
    </div>
      </div>
    </AddNewPageButtons>
  );
};

export default addCompiler;
