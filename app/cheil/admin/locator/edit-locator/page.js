"use client";
import React, { useEffect, useState } from "react";
import { FaMinus } from "react-icons/fa";
import { TextField, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import axios from "axios";
import AddNewPageButtons from "@/app/src/components/AddNewPageButtons/AddNewPageButtons";
import { api } from "@/envfile/api";
import { useDispatch, useSelector } from "react-redux";
import { getCookie } from "cookies-next";
import NodeDropdown from "@/app/src/components/dropdown/Node";
import MethodsDropdown from "@/app/src/components/dropdown/MethodsDropdown";
import TestDataTypesDropDown from "@/app/src/components/dropdown/TestDataTypes";
import TestDataSubTypeDropDown from "@/app/src/components/dropdown/TestDataSubtype";
import { clearAllEditRecordIds } from "@/app/src/Redux/Slice/slice";
import Lottie from "react-lottie";
import * as animationData from "../../../../../assests/LoadingAnimation.json";

const EditLocator = () => {
  const [token, setToken] = useState("");
  const [params, setParams] = useState([]);
  const [ButtonActive, setButtonActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editInputFields, setEditInputFields] = useState([]);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [updateLabel, setUpdateLabel] = useState("");
  const [activeSection, setActiveSection] = useState("");
  const dispatch = useDispatch();
  const [initialload, setInitialLoad] = useState(true);


  const selectedID = useSelector((state) => state.tasks.multipleEditRecordId);
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  useEffect(() => {
    const jwtToken = getCookie("jwtToken");
    if (jwtToken) {
      setToken(jwtToken);
      handleFetchData(jwtToken);
      console.log(jwtToken, "jwtToken response");
    }
  }, []);

  useEffect(() => {
    const storedEmail = localStorage.getItem("username");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const handleAddParamClick = () => setParams([...params, ""]);

  const handleRemoveParamClick = (index) => {
    const newParams = params.filter((_, i) => i !== index);
    setParams(newParams);
  };

  const handleParamChange = (index, value) => {
    const newParams = [...params];
    newParams[index] = value;
    setParams(newParams);
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;

    const updatedFields = editInputFields.map((item, i) => {
      if (i === index) {
        if (name === "parentNode") {
          return {
            ...item,
            parentNode: { ...item.parentNode, identifier: value },
          };
        }
        return { ...item, [name]: value };
      }
      if (i === index) {
        if (name === "methodName") {
          return {
            ...item,
            methodName: { ...item.methodName, identifier: value },
          };
        }
        return { ...item, [name]: value };
      }
      if (i === index) {
        if (name === "testDataSubtype") {
          return {
            ...item,
            testDataSubtype: { ...item.testDataSubtype, recordId: value },
          };
        }
        return { ...item, [name]: value };
      }
      if (i === index) {
        if (name === "testDataType") {
          return {
            ...item,
            testDataType: { ...item.testDataType, recordId: value },
          };
        }
        return { ...item, [name]: value };
      }
      return item;
    });

    setEditInputFields(updatedFields);
  };

  const handlePostClick = async () => {
    setLoading(true);
    try {
      // console.log(testDataType,"selectedTestDataTypes selectedTestDataTypes");
      
      const headers = { Authorization: `Bearer ${token}` };
      const body = {
        testLocators: editInputFields.map((item) => ({
          recordId: item.recordId,
          identifier: item.identifier || "",
          shortDescription: item.shortDescription || "",
          // parentNode: { recordId: item.parentNode?.recordId || null },
          testDataType:   item.testDataType || null ,
          testDataSubtype: item.testDataSubtype || null ,
          methodName:  item.methodName || null,
          status: item.ButtonActive,
          labels: item.labels || [],
          errorMsg: item.errorMsg || "",
       
        })),
      };

      // Log the data being sent to the API
      console.log(body, "req body");

      const response = await axios.post(`${api}/admin/locator/edit`, body, { headers });

      // Log the response from the API
      console.log(response.data, "Response after submitting");
      dispatch(clearAllEditRecordIds());

      // Navigate after successful submission
      router.push("/cheil/admin/locator");
    } catch (err) {
      setError("Error saving locator data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const handleButtonClick = (index) => {
    const updatedFields = [...editInputFields];
    updatedFields[index].ButtonActive = !updatedFields[index].ButtonActive;
    setEditInputFields(updatedFields);
  };
  const handleFetchData = async (jwtToken) => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${jwtToken}` };
      const body = { testLocators: selectedID.map((id) => ({ recordId: id })) };
      const response = await axios.post(`${api}/admin/locator/getedits`, body, { headers });
      const testLocators = response.data.testLocators.map((item) => ({
        ...item,
        ButtonActive: item.status || false, // Ensure ButtonActive is properly initialized
        
      }));
      setEditInputFields(testLocators);
  
      // Set the selected test data types for each locator
      // const fetchedTestDataTypes = response.data.testLocators.map(
      //   (item) => item.testDataType?.recordId || ""
      // );
      // setTestDataTypes(fetchedTestDataTypes); // Set the selected test data 
      
      // // Set the selected test data Subtypes for each locator
      // const fetchedTestDataSubTypes = response.data.testLocators.map(
      //   (item) => item.testDataSubType?.recordId || ""
      // );
      // setTestDataSubtypes(fetchedTestDataSubTypes); // Set the selected test Subdata types

      // Set the selected methods for each locator
      // const fetchedMethods = response.data.testLocators.map(
      //   (item) => item.method?.recordId || ""
      // );
      // setMethods(fetchedMethods); // Set the selected Methods
  
      console.log(testLocators, "response from API");
    } catch (err) {
      setError("Error fetching locator data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleRunClick = () => alert("Run function executed from EditLocator!");

  const handleAddLabelBlur = (index) => {
    if (updateLabel.trim()) {
      const updatedFields = [...editInputFields];
      const labelsArray = updatedFields[index].labels || [];

      // Add the new label and update the array
      updatedFields[index].labels = [...labelsArray, updateLabel.trim()];
      setEditInputFields(updatedFields);

      // Clear the input field after updating the labels
      setUpdateLabel("");
    }
  };

  const pagename = "Edit Locator";
  const breadscrums = "Admin > Locator";

  return (
    <AddNewPageButtons
      pagename={pagename}
      email={email}
      breadscrums={breadscrums}
      handleSaveClick={handlePostClick}
      handleRunClick={handleRunClick}
    >
      <div className="p-2">
        {editInputFields.length < 1 ?  (
         <div className="w-full flex flex-col  h-40 justify-center items-center">
         <div className="opacity-35 ">
           <Lottie options={defaultOptions} height={100} width={100} />
         </div>
         <div>No data data found...</div>
       </div>
        ) : (
          <>
            <div className="flex flex-col bg-gray-200 min-h-96 p-2 gap-3 rounded-md">
            {editInputFields.map((item, index) => (
                  <div
                    key={item.recordId}
                    className="bg-white p-4 rounded-md shadow-md"
                  >
                    <div className="bg-white w-[98%] rounded-md  flex flex-col justify-center gap-2 pb-4">
                      <div className="w-full grid grid-cols-3 justify-between gap-10 p-2 items-center">
                        <TextField
                          label="Enter Identifier"
                          variant="standard"
                          className="text-xs"
                          fullWidth
                          name="identifier"
                          value={item.identifier}
                          onChange={(e) => handleInputChange(e, index)}
                        />
                        <TextField
                          label="Enter Description"
                          variant="standard"
                          className="text-xs"
                          fullWidth
                          name="shortDescription"
                          value={item.shortDescription}
                          onChange={(e) => handleInputChange(e, index)}
                        />
                        <MethodsDropdown
                              initialload={initialload}

                           setMethods={(value) => {
                            const updatedFields = [...editInputFields];
                            updatedFields[index].methodName = value;  // Set the value for the current locator
                            setEditInputFields(updatedFields);
                          }}
                          methods={editInputFields[index].methodName || ""}  // Fetch the current method
                         
                        />
                      
                      </div>

                      <div className="w-full grid grid-cols-3 justify-between gap-10 p-2">
                      <TestDataTypesDropDown
                            initialload={initialload}

  setSelectedTestDataTypes={(value) => {
    const updatedFields = [...editInputFields];
    updatedFields[index].testDataType = value;  // Set the value for the current locator
    setEditInputFields(updatedFields);
  }}
  selectedTestDataTypes={editInputFields[index].testDataType || ""}  // Fetch the current testDataType
/>

                        <TestDataSubTypeDropDown
                              initialload={initialload}


  setTestDataSubtypes={(value) => {
    const updatedFields = [...editInputFields];
    updatedFields[index].testDataSubtype = value;  // Set the value for the current locator
    setEditInputFields(updatedFields);
    
  }}
  testDataSubtypes={editInputFields[index].testDataSubtype || ""}    // Fetch the current test data subtype
/>

                        <TextField
                          label="Error Msg"
                          variant="standard"
                          className="text-xs mt-5"
                          fullWidth
                          name="errorMsg"
                          value={item.errorMsg}
                          onChange={(e) => handleInputChange(e, index)}
                        />
                       
                      </div>

                      <div className="w-full p-2 grid grid-cols-2 gap-10">
                      <TextField
                        label="Enter to add label"
                        variant="standard"
                        className="text-xs"
                        fullWidth
                        name="addLabel"
                        value={updateLabel}
                        onChange={(e) => setUpdateLabel(e.target.value)}
                        onBlur={() => handleAddLabelBlur(index)}
                      />

                      <TextField
                          label="Enter Label"
                          variant="standard"
                          className="text-xs"
                          fullWidth
                          name="labels" 
                          value={item.labels.join(", ")}  // Assuming labels is an array
                          onChange={(e) => {
                            const labelsArray = e.target.value.split(",").map(label => label.trim());
                            const updatedFields = [...editInputFields];
                            updatedFields[index].labels = labelsArray; // Update labels as an array
                            setEditInputFields(updatedFields);
                          }}
                      />
                      </div>

                      <div className="w-full flex flex-row justify-end ">
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
                  </div>
                ))}
            </div>
            <div className="flex gap-4  p-4">
          <button
            className={`p-2 rounded-md ${
              activeSection === "configureSelectors"
                ? "bg-black text-white"
                : "bg-gray-200 text-black border-2 border-gray-400"
            }`}
            onClick={() => setActiveSection("configureSelectors")}
          >
            Configure Selectors
          </button>

          <button
            className={`p-2 rounded-md  ${
              activeSection === "selectorGroups"
                ? "bg-black text-white"
                : "bg-gray-200 text-black border-2 border-gray-400"
            }`}
            onClick={() => setActiveSection("selectorGroups")}
          >
            Selector Groups
          </button>
        </div>
        {activeSection === "configureSelectors" && (
          <div className="p-4">
            <div className="bg-white w-full rounded-md shadow-md flex flex-col justify-center gap-2 pb-4">
              <div className="w-full flex flex-row justify-between gap-10 p-2 items-center">
                <div className="w-[15%]">allianz</div>
                <TextField
                  label="Xpath"
                  variant="standard"
                  className="text-xs w-[15%]"
                  fullWidth
                />
                <TextField
                  label="CSS"
                  variant="standard"
                  className="text-xs w-[15%]"
                  fullWidth
                />
                <TextField
                  label="ID"
                  variant="standard"
                  className="text-xs w-[15%]"
                  fullWidth
                />
                <TextField
                  label="Other"
                  variant="standard"
                  className="text-xs w-[15%]"
                  fullWidth
                />
                <TextField
                  label="Enter Input Data"
                  variant="standard"
                  className="text-xs w-[15%]"
                  fullWidth
                />
              </div>
              <div className="w-full flex flex-row justify-between gap-10 p-2 items-center">
                <div className="w-[15%]">be</div>
                <TextField
                  label="Xpath"
                  variant="standard"
                  className="text-xs w-[15%]"
                  fullWidth
                />
                <TextField
                  label="CSS"
                  variant="standard"
                  className="text-xs w-[15%]"
                  fullWidth
                />
                <TextField
                  label="ID"
                  variant="standard"
                  className="text-xs w-[15%]"
                  fullWidth
                />
                <TextField
                  label="Other"
                  variant="standard"
                  className="text-xs w-[15%]"
                  fullWidth
                />
                <TextField
                  label="Enter Input Data"
                  variant="standard"
                  className="text-xs w-[15%]"
                  fullWidth
                />
              </div>
              <div className="w-full flex flex-row justify-between gap-10 p-2 items-center">
                <div className="w-[15%]">be_fr</div>
                <TextField
                  label="Xpath"
                  variant="standard"
                  className="text-xs w-[15%]"
                  fullWidth
                />
                <TextField
                  label="CSS"
                  variant="standard"
                  className="text-xs w-[15%]"
                  fullWidth
                />
                <TextField
                  label="ID"
                  variant="standard"
                  className="text-xs w-[15%]"
                  fullWidth
                />
                <TextField
                  label="Other"
                  variant="standard"
                  className="text-xs w-[15%]"
                  fullWidth
                />
                <TextField
                  label="Enter Input Data"
                  variant="standard"
                  className="text-xs w-[15%]"
                  fullWidth
                />
              </div>
              <div className="w-full flex flex-row justify-between gap-10 p-2 items-center">
                <div className="w-[15%]">corporatebenefits</div>
                <TextField
                  label="Xpath"
                  variant="standard"
                  className="text-xs w-[15%]"
                  fullWidth
                />
                <TextField
                  label="CSS"
                  variant="standard"
                  className="text-xs w-[15%]"
                  fullWidth
                />
                <TextField
                  label="ID"
                  variant="standard"
                  className="text-xs w-[15%]"
                  fullWidth
                />
                <TextField
                  label="Other"
                  variant="standard"
                  className="text-xs w-[15%]"
                  fullWidth
                />
                <TextField
                  label="Enter Input Data"
                  variant="standard"
                  className="text-xs w-[15%]"
                  fullWidth
                />
              </div>
            </div>
          </div>
        )}
        {activeSection === "selectorGroups" && (
          <div className="p-4">
            <textarea className="w-full h-64 border-solid border-2 border-gray-300 rounded-md" />
          </div>
        )}
          </>
        )}

       
      </div>
    </AddNewPageButtons>
  );
};

export default EditLocator;

