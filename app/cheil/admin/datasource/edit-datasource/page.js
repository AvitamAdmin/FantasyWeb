"use client";
import React, { useEffect, useState } from "react";
import { CircularProgress, MenuItem, Select, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import axios from "axios";
import { getCookie } from "cookies-next";
import AddNewPageButtons from "@/app/src/components/AddNewPageButtons/AddNewPageButtons";
import Fileformat from "@/app/src/components/dropdown/Fileformat";
import { api } from "@/envfile/api";
import { useDispatch, useSelector } from "react-redux";
import { clearAllEditRecordIds } from "@/app/src/Redux/Slice/slice";
import { FaMinus } from "react-icons/fa";
import Lottie from "react-lottie";
import * as animationData from "../../../../../assests/LoadingAnimation.json";
import { Button } from "antd";

const EditDataSource = () => {
  const dispatch = useDispatch();
  const [token, setToken] = useState("");
  const [editInputfields, setEditInputfields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const selectedID = useSelector((state) => state.tasks.multipleEditRecordId);
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
      handleFetchData(jwtToken);
    } else {
      setError("No token found");
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

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const updatedFields = [...editInputfields];
    updatedFields[index] = { ...updatedFields[index], [name]: value };
    setEditInputfields(updatedFields);
  };
  const datasourceInputschange = (e, index, inputIndex) => {
    const { name, value } = e.target;
    const updatedFields = [...editInputfields];
    updatedFields[index].dataSourceInputs[inputIndex] = {
      ...updatedFields[index].dataSourceInputs[inputIndex],
      [name]: value,
    };

    setEditInputfields(updatedFields);
  };

  const handleParamChange = (fieldIndex, paramIndex, value) => {
    const updatedFields = [...editInputfields];
    updatedFields[fieldIndex].params[paramIndex] = value;
    setEditInputfields(updatedFields);
  };

  const handleFormatChange = (format, index) => {
    const updatedFields = [...editInputfields];
    updatedFields[index].selectedFormat = format;
    setEditInputfields(updatedFields);
  };

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

  const handleButtonClick = (index) => {
    const updatedFields = [...editInputfields];
    updatedFields[index].ButtonActive = !updatedFields[index].ButtonActive;
    setEditInputfields(updatedFields);
  };
  const handlePostClick = async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const body = {
        dataSources: editInputfields.map((item) => ({
          recordId: item.recordId,
          identifier: item.identifier,
          shortDescription: item.shortDescription,
          separatorSymbol: item.separatorSymbol,
          format: item.selectedFormat,
          skuUrl: item.skuUrl,
          sourceAddress: item.sourceAddress,
          status: item.ButtonActive,
          srcInputParams: item.params,
          dataSourceInputs: item.dataSourceInputs,
        })),
      };

      console.log(body, "req body from user");
      const response = await axios.post(`${api}/admin/datasource/edit`, body, {
        headers,
      });
      console.log(response.data, "response from API");
      router.push("/cheil/admin/datasource");
      dispatch(clearAllEditRecordIds());
    } catch (err) {
      setError("Error saving data");
    } finally {
      setLoading(false);
    }
  };

  const handleFetchData = async (jwtToken) => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${jwtToken}` };
      const body = { dataSources: selectedID.map((id) => ({ recordId: id })) };

      const response = await axios.post(
        `${api}/admin/datasource/getedits`,
        body,
        {
          headers,
        }
      );

      const dataSources = response.data.dataSources.map((item) => ({
        ...item,
        ButtonActive: item.status || false,
        selectedFormat: item.format || "",
        params: item.srcInputParams || [],
        dataSourceInputs: item.dataSourceInputs.map((input) => ({
          ...input,
          comma: input.comma !== undefined ? input.comma : false,
          fixed: input.fixed !== undefined ? input.fixed : false,
          importBox: input.importBox !== undefined ? input.importBox : false,
          optional : input.optional !== undefined ? input.optional : false,
          fileName : input.fileName !== undefined ? input.fileName : false,
        })) || [],
      }));

      console.log(response.data.dataSources, "req body from edit-user");
      setEditInputfields(dataSources);
    } catch (err) {
      setError("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  const handleAddInputFieldClick = (index) => {
    const updatedFields = [...editInputfields];
    updatedFields[index].dataSourceInputs.push({
      comma: false,
      fieldName: "",
      fieldValue: "",
      fixed: false,
      importBox: false,
      inputFormat: "Site Loader", 
      optional: false,
      fileName:false,
    });
    setEditInputfields(updatedFields);
  };

  const handleRemoveInputFieldClick = (itemIndex, inputIndex) => {
    const updatedFields = [...editInputfields];
    updatedFields[itemIndex].dataSourceInputs.splice(inputIndex, 1);
    setEditInputfields(updatedFields);
  };

  const handleToggle = (dataSourceIndex, inputIndex, buttonType) => {
    const updatedFields = [...editInputfields];
    const input = updatedFields[dataSourceIndex].dataSourceInputs[inputIndex];

    if (buttonType === "comma") {
      input.comma = !input.comma;
    } else if (buttonType === "fixed") {
      input.fixed = !input.fixed;
    } else if (buttonType === "importBox") {
      input.importBox = !input.importBox;
    } else if (buttonType === "optional") {
      input.optional = !input.optional;
    }else if (buttonType === "fileName") {
      input.fileName = !input.fileName;
    }

    setEditInputfields(updatedFields);
  };

  const handleRunClick = () => {
    alert("Run function executed from EditDataSource!");
  };

  const pagename = "Edit";
  const breadscrums = "Admin > Datasource";

  return (
    <AddNewPageButtons
      pagename={pagename}
      email={email}
      breadscrums={breadscrums}
      handleSaveClick={handlePostClick}
      handleRunClick={handleRunClick}
    >
      {loading ? (
        <div className="flex flex-row justify-center items-center w-full h-40">
          <div className="gap-5 flex flex-col items-center justify-center">
            <CircularProgress size={36} color="inherit" />
            <div>Loading...</div>
          </div>
        </div>
      ) : (
        <>
          {editInputfields.length < 1 ? (
            <div className="w-full flex flex-col h-40 justify-center items-center">
              <div className="opacity-35">
                <Lottie options={defaultOptions} height={100} width={100} />
              </div>
              <div>No data found...</div>
            </div>
          ) : (
            <div className="p-2">
              <div className="flex flex-col bg-gray-200 p-2 gap-3 rounded-md">
                {editInputfields.map((item, index) => (
                  <div
                    key={item.recordId}
                    className="  gap-5 flex flex-col "
                  >
                    <div className="flex bg-white p-3 rounded-md flex-col gap-5 w-full">
                    <div className="grid  grid-cols-4 gap-5 mb-4">
                      <TextField
                        label="Identifier"
                        variant="standard"
                        className="text-xs"
                        name="identifier"
                        value={item.identifier || ""}
                        onChange={(e) => handleInputChange(e, index)}
                      />
                      <TextField
                        label="Short Description"
                        variant="standard"
                        className="text-xs"
                        name="shortDescription"
                        value={item.shortDescription || ""}
                        onChange={(e) => handleInputChange(e, index)}
                      />
                      <TextField
                        label="Separator Symbol"
                        variant="standard"
                        className="text-xs"
                        name="separatorSymbol"
                        value={item.separatorSymbol || ""}
                        onChange={(e) => handleInputChange(e, index)}
                      />
                      <Fileformat
                        setSelectedFormat={(format) =>
                          handleFormatChange(format, index)
                        }
                        selectedFormat={item.selectedFormat || ""}
                      />
                    </div>
                    <div className="flex flex-col gap-5 w-full">
                      <TextField
                        label="Source Address"
                        variant="standard"
                        className="text-xs w-full"
                        name="sourceAddress"
                        value={item.sourceAddress || ""}
                        onChange={(e) => handleInputChange(e, index)}
                      />
                      <TextField
                        label="SKU URL"
                        variant="standard"
                        className="text-xs w-full"
                        name="skuUrl"
                        value={item.skuUrl || ""}
                        onChange={(e) => handleInputChange(e, index)}
                      />
                    </div>
                    <div className="flex gap-4 items-center justify-end">
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
                    </div>
                    </div>

                    <div className="flex flex-col mt-3 gap-5 w-full">
                    <div className="grid grid-cols-3 w-full  justify-between ">
                      {item.params &&
                        item.params.map((param, paramIndex) => (
                          <div
                            key={paramIndex}
                            className="flex items-center gap-2 w-[100%] bg-white p-1 rounded-md"
                          >
                            <TextField
                            className="w-[100%] "
                              placeholder="Enter Param Here"
                              variant="outlined"
                              size="small"
                              value={param || ""}
                              onChange={(e) =>
                                handleParamChange(
                                  index,
                                  paramIndex,
                                  e.target.value
                                )
                              }
                            />
                            <button
                              className="flex items-center justify-center p-2 rounded-md w-[10%] bg-red-600 text-white"
                              onClick={() =>
                                handleRemoveParamClick(index, paramIndex)
                              }
                              style={{ width: "40px", height: "40px" }}
                            >
                              <FaMinus />
                            </button>
                          </div>
                        ))}
                    </div>
                    <div className="">
                      <button
                        className="flex items-center justify-center  p-2 rounded-md bg-black text-white"
                        onClick={() => handleAddParamClick(index)}
                        style={{ width: "100px", height: "40px" }}
                      >
                        Add Param
                      </button>
                    </div>
                    </div>
                    <div className=" gap-2 mt-4 flex flex-col rounded-md">
                      {item.dataSourceInputs &&
                      item.dataSourceInputs.length > 0 ? (
                        item.dataSourceInputs.map((input, inputIndex) => (
                          <div
                            key={inputIndex}
                            className="flex flex-row justify-between w-full bg-white p-2 rounded-md items-center"
                          >
                            <Button
                              onClick={() =>
                                handleToggle(index, inputIndex, "comma")
                              }
                              className={
                                input.comma
                                  ? "bg-[#1581ed] border-2 border-[#1581ed] text-white"
                                  : "bg-[#fff] border-2 border-gray-400 text-gray-700"
                              }
                            >
                              {input.comma ? "Comma" : " Comma"}
                            </Button>
                            <Button
                            onClick={() =>
                              handleToggle(index, inputIndex, "fixed")
                            }
                            className={
                              input.fixed
                                ? "bg-[#1581ed] border-2 border-[#1581ed] text-white"
                                : "bg-[#fff] border-2 border-gray-400 text-gray-700"
                            }
                          >
                            {input.fixed ? "Fixed" : "Fixed"}
                          </Button>

                          <Button
                          onClick={() =>
                            handleToggle(index, inputIndex, "importBox")
                          }
                          className={
                            input.importBox
                              ? "bg-[#1581ed] border-2 border-[#1581ed] text-white"
                              : "bg-[#fff] border-2 border-gray-400 text-gray-700"
                          }
                        >
                          {input.importBox ? "Import" : "Import"}
                        </Button>

                        <Button
                        onClick={() =>
                          handleToggle(index, inputIndex, "optional")
                        }
                        className={
                          input.optional
                            ? "bg-[#1581ed] border-2 border-[#1581ed] text-white"
                            : "bg-[#fff] border-2 border-gray-400 text-gray-700"
                        }
                      >
                        {input.optional ? "Optional" : "Optional"}
                      </Button>

                      <Button
                      onClick={() =>
                        handleToggle(index, inputIndex, "fileName")
                      }
                      className={
                        input.failename
                          ? "bg-[#1581ed] border-2 border-[#1581ed] text-white"
                          : "bg-[#fff] border-2 border-gray-400 text-gray-700"
                      }
                    >
                      {input.fileName ? "FileName" : "FileName"}
                    </Button>
                            <TextField
                              label="Field Name"
                              variant="standard"
                              value={input.fieldName || ""}
                              name="fieldName"
                              onChange={(e) =>
                                datasourceInputschange(e, index, inputIndex)
                              }
                            />
                            <TextField
                              label="Field Value"
                              variant="standard"
                              value={input.fieldValue || ""}
                              name="fieldValue"
                              onChange={(e) =>
                                datasourceInputschange(e, index, inputIndex)
                              }
                            />
                            <Select
                              value={input.inputFormat || ""}
                              name="inputFormat"
                              onChange={(e) =>
                                datasourceInputschange(e, index, inputIndex)
                              }
                              variant="standard"
                              displayEmpty
                              className="w-[25%]"
                            >
                              <MenuItem value="">
                                <em>Select Format</em>
                              </MenuItem>
                              <MenuItem value="Site Loader">
                                Site Loader
                              </MenuItem>
                              <MenuItem value="Input Box">Input Box</MenuItem>
                              <MenuItem value="Dropdown">Dropdown</MenuItem>
                              <MenuItem value="Formular">Formular</MenuItem>
                              <MenuItem value="Data and Time selector">
                                Data and Time selector
                              </MenuItem>
                            </Select>

                            <button
                              className="flex items-center justify-center p-2 rounded-md bg-red-600 text-white"
                              onClick={() =>
                                handleRemoveInputFieldClick(index, inputIndex)
                              }
                              style={{ width: "50px", height: "35px" }}
                            >
                              <FaMinus />
                            </button>
                          </div>
                        ))
                      ) : (
                        <div>No Data Source Inputs Available</div>
                      )}

                      <div className="w-[100%]">
                        <button
                          className="flex items-center justify-center p-2 rounded-md bg-black text-white"
                          onClick={() => handleAddInputFieldClick(index)}
                          style={{ width: "150px", height: "40px" }}
                        >
                          Add Input Field
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </AddNewPageButtons>
  );
};

export default EditDataSource;
