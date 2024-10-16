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
import DataRelation from "@/app/src/components/dropdown/DataRelation";
import NodeDropdown from "@/app/src/components/dropdown/Node";
import MultiSelectNode from "@/app/src/components/multiSelectDropdown/MultiSelectNode";
import Lottie from "react-lottie";
import * as animationData from "../../../../../assests/LoadingAnimation.json";
import { clearAllEditRecordIds } from "@/app/src/Redux/Slice/slice";

const EditReportCompiler = () => {
  useEffect(() => {
    console.log("initial call");

    const jwtToken = getCookie("jwtToken");
    if (jwtToken) {
      setToken(jwtToken);
      handlefetchData(jwtToken);
      getDataSources(jwtToken);

      console.log("JWT Token retrieved:", jwtToken);
    } else {
      console.log("No token found");
    }
  }, []);
  const [token, setToken] = useState("");
  const [params, setParams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [selectedFormat, setSelectedFormat] = useState(""); // For the file format dropdown
  const [editInputfields, seteditInputfields] = useState([]);
  // const [dataRelation, setDataRelation] = useState([]);

  const [datasourceData, setDatasourceData] = useState([]); // For storing dataSources
  const [datasourceDataParams, setDatasourceDataParams] = useState([]); // For storing datasource params
  const [selectedDataRelation, setSelectedDataRelation] = useState(null); // For selected DataRelation
  const [selectedDatasource, setSelectedDatasource] = useState(null); // For selected DataSource

  const dispatch = useDispatch();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
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

  // Fetch params when datasource changes
  const getDataSourcesParams = async (datasourceId) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const body = { recordId: datasourceId };

      const response = await axios.post(
        `${api}/admin/mapping/getDataSourceParamsById`,
        body,
        { headers }
      );
      setDatasourceDataParams(response.data);
    } catch (error) {
      console.log("Error fetching dataSource params", error);
    }
  };
  const [formValues, setFormValues] = useState({
    identifier: "",
    shortDescription: "",
    displayPriority: "",
    path: "",
    parentNode: "",
  });

  useEffect(() => {
    const storedEmail = localStorage.getItem("username");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const handleParamChange = (index, value) => {
    const newParams = [...params];
    newParams[index] = value;
    setParams(newParams);
  };

  // Handle change for form inputs
  const handleInputChange = (e, index) => {
    const { name, value } = e.target;

    const updatedFields = editInputfields.map((item, i) => {
      if (i === index) {
        if (name === "parentNode") {
          return {
            ...item,
            parentNode: { ...item.parentNode, identifier: value }, // Only update the identifier field of parentNode
          };
        }
        return { ...item, [name]: value }; // Update other fields normally
      }
      return item;
    });

    seteditInputfields(updatedFields); // Update the state with modified fields
  };

  const handleFormatChange = (format) => {
    setSelectedFormat(format); // Capture the file format
  };

  const handlePostClick = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };

      // Construct the request body by using data from each item in editInputfields
      const body = {
        reportCompilers: editInputfields.map((item) => ({
          recordId: item.recordId,
          identifier: item.identifier || "-", // Use identifier value
          shortDescription: item.shortDescription || "-", // Use shortDescription value
          reportInterfaces: item.reportInterfaces || [], // Use item's reportInterfaces
          dataRelation: item.dataRelation || "-", // Use item's dataRelation
          node: item.node || [], // Use item's reportInterfaces
          status: item.ButtonActive,
        })),
      };

      console.log(body, "req body from user");
      console.log(token, "token");

      // Send the POST request
      const response = await axios.post(
        `${api}/admin/reportCompiler/edit`,
        body,
        {
          headers,
        }
      );

      console.log(response.data, "response from API");
      dispatch(clearAllEditRecordIds());
      router.push("/cheil/admin/reportCompiler");
    } catch (err) {
      setError("Error saving Datasource data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const selectedID = useSelector((state) => state.tasks.multipleEditRecordId);

  const handlefetchData = async (jwtToken) => {
    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${jwtToken}` };
      console.log(jwtToken, "jwtToken from API");

      // Convert selectedID array to a comma-separated string
      const body = {
        reportCompilers: selectedID.map((id) => ({ recordId: id })),
      };

      // // Use the correct method and pass params in the config for GET request
      const response = await axios.post(
        `${api}/admin/reportCompiler/getedits`,
        body,
        {
          headers,
        }
      );
      console.log(response, "response from api");

      const reportCompilers = response.data.reportCompilers.map((item) => ({
        ...item,
        ButtonActive: item.status || false,
        params: item.reportCompilerMappings || [],
      }));
      setLoading(false);

      console.log(reportCompilers, "response from API");
      seteditInputfields(reportCompilers);
    } catch (err) {
      setError("Error fetching Datasource data");
    }
  };

  const handleRunClick = () => {
    alert("Run function executed from EditReportCompiler!");
  };

  const pagename = "Edit";
  const breadscrums = "Admin > Compiler";

  const handleAddParamClick = (index) => {
    const updatedFields = [...editInputfields];
    if (!updatedFields[index].params) {
      updatedFields[index].params = [];
    }

    updatedFields[index].params.push("");
    seteditInputfields(updatedFields);
  };

  const handleRemoveParamClick = (fieldIndex, paramIndex) => {
    const updatedFields = [...editInputfields];
    updatedFields[fieldIndex].params.splice(paramIndex, 1);
    seteditInputfields(updatedFields);
  };

  const toggleButtonState = (index, buttonName) => {
    const updatedFields = editInputfields.map((item, i) => {
      if (i === index) {
        return { ...item, [buttonName]: !item[buttonName] }; // Toggle button state
      }
      return item;
    });
    seteditInputfields(updatedFields);
    const newInputs = [...params];

    // Toggle only the specific button for this row
    newInputs[index][buttonType] = !newInputs[index][buttonType];

    setParams(newInputs);
  };
 
  const getDataSources = async (dataRelationId) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const body = { recordId: dataRelationId };

      const response = await axios.post(
        `${api}/admin/mapping/getDataSourcesByRelationId`,
        body,
        { headers }
      );
      setDatasourceData(response.data.dataSources);
    } catch (error) {
      console.log("Error fetching dataSources", error);
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
        <div className="p-2">
          {editInputfields.length < 1 ? (
            <div className="w-full flex flex-col  h-40 justify-center items-center">
              <div className="opacity-10 ">
                <Lottie options={defaultOptions} height={100} width={100} />
              </div>
              <div>No data data found...</div>
            </div>
          ) : (
            <div className="flex flex-col bg-gray-200 px-2 gap-3 rounded-md">
              {editInputfields.map((item, index) => (
                <div className="">
                  <div
                    key={item.recordId}
                    className="bg-white flex flex-col p-4 rounded-md shadow-md"
                  >
                    <div className="grid grid-cols-3 gap-5 mb-4">
                      <TextField
                        label="Identifier"
                        variant="standard"
                        className="text-xs"
                        name="identifier"
                        value={item.identifier || ""}
                        onChange={(e) => handleInputChange(e, index)} // Pass index
                      />
                      <TextField
                        label="Short Description"
                        variant="standard"
                        className="text-xs"
                        name="shortDescription"
                        value={item.shortDescription || ""}
                        onChange={(e) => handleInputChange(e, index)} // Pass index
                      />
                      <NodeDropdown
                        selectedNode={item.node || []} // Pass selected node
                        setSelectedNode={(newNode) => {
                          const updatedFields = editInputfields.map(
                            (field, i) => {
                              if (i === index) {
                                return { ...field, node: newNode }; // Update node data
                              }
                              return field;
                            }
                          );
                          seteditInputfields(updatedFields); // Update state
                        }}
                      />
                    </div>
                    <div className="flex flex-row gap-5 w-full justify-between">
                      <div className="w-full">
                      <DataRelation
              selectedDataRelation={item.dataRelation}
              setSelectedDataRelation={(newNodes) => {
                const updatedFields = editInputfields.map((field, i) => {
                  if (i === index) {
                    return { ...field, dataRelation: newNodes }; // Update dataRelation
                  }
                  return field;
                });
                setSelectedDataRelation(newNodes?.recordId || null); 
          if (newNodes?.recordId) {
            getDataSources(newNodes.recordId); // Fetch dataSources on dataRelation change
          }
                seteditInputfields(updatedFields); // Update state
              }}
            />
                      </div>
                      <div className="w-full mt-5">
                        <MultiSelectNode
                          selectedNodes={item.reportInterfaces || []} // Pass the reportInterfaces array
                          setSelectedNodes={(newNodes) => {
                            const updatedFields = editInputfields.map(
                              (field, i) => {
                                if (i === index) {
                                  return {
                                    ...field,
                                    reportInterfaces: newNodes,
                                  }; // Update reportInterfaces
                                }
                                return field;
                              }
                            );
                            seteditInputfields(updatedFields); // Update state
                          }}
                        />
                      </div>
                      <div className="flex flex-row w-full items-end justify-end">
                        <button
                          onClick={() =>
                            toggleButtonState(index, "ButtonActive")
                          }
                          className={`${
                            item.ButtonActive
                              ? "bg-[#1581ed] text-white border-[#1581ed]"
                              : "bg-[#fff] text-gray-500 border-gray-400"
                          } border-2 border-solid  rounded-md  text-xs px-2 h-6 py-0.5 w-[80px]`}
                        >
                          {item.ButtonActive ? "Active" : "Inactive"}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex-row gap-4 w-[100%] grid grid-cols-1">
                    {item.params &&
                      item.params.map((param, paramIndex) => (
                        <div
                          key={paramIndex}
                          className="items-center justify-between gap-5 grid grid-cols-5 w-[100%] p-2"
                        >
                          <TextField
                            className="mt-5"
                            placeholder="*Input the Report Header"
                            variant="standard"
                            size="small"
                            value={param.header}
                            onChange={(e) =>
                              handleInputFieldChange(
                                index,
                                "name",
                                e.target.value
                              )
                            }
                          />

                          <Autocomplete
                            options={datasourceData}
                            getOptionLabel={(option) => option.identifier || ""}
                            value={
                              datasourceData.find(
                                (ds) => ds.recordId === selectedDatasource
                              ) || null
                            }
                            onChange={(event, newValue) => {
                              setSelectedDatasource(newValue?.recordId || null);
                              if (newValue?.recordId) {
                                getDataSourcesParams(newValue.recordId); // Fetch params on datasource change
                              }
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Select Datasource"
                                variant="standard"
                              />
                            )}
                          />

                          <Autocomplete
                            options={datasourceDataParams}
                            getOptionLabel={(option) => option || ""}
                            value={selectedDatasource?.dataSourceParams || null}
                            onChange={(event, newValue) => {
                              // Handle Param selection logic here
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Select Params"
                                variant="standard"
                              />
                            )}
                          />

                          <div className="flex flex-row gap-5 justify-center items-end">
                            <button
                              onClick={() =>
                                toggleButtonState(index, "ButtonPivot")
                              }
                              className={`${
                                param.ButtonPivot
                                  ? "bg-[#1581ed] text-white"
                                  : "bg-[#fff] text-gray-700"
                              } border-2 border-solid border-${
                                param.ButtonPivot ? "#1581ed" : "gray-400"
                              } rounded-md text-xs px-2 py-0.5 w-[70px] h-[25px]`}
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
              ))}
            </div>
          )}
        </div>
      )}
    </AddNewPageButtons>
  );
};

export default EditReportCompiler;
