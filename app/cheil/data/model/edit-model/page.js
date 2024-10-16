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
import SelectCategory from "@/app/src/components/dropdown/Category";
import MultiSelectSubsidiary from "@/app/src/components/multiSelectDropdown/Subsidiary";
import Lottie from "react-lottie";
import * as animationData from "../../../../../assests/LoadingAnimation.json";
import { clearAllEditRecordIds } from "@/app/src/Redux/Slice/slice";

const EditModel = () => {
  const [token, setToken] = useState("");
  const [params, setParams] = useState([]);
  const [ButtonActive, setButtonActive] = useState(false);
  const [selectedSubsidiary, setSelectedSubsidiary] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editInputFields, setEditInputFields] = useState([]);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [updateLabel, setUpdateLabel] = useState("");
  const [activeSection, setActiveSection] = useState("");
  const [buttonActiveList, setButtonActiveList] = useState([]);


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
        return { ...item, [name]: value };
      }  
      return item;
    });
  
    setEditInputFields(updatedFields);
  };
  
  const dispatch = useDispatch();
  const handlePostClick = async () => {
    setLoading(true);
    try {
      // console.log(testDataType,"selectedTestDataTypes selectedTestDataTypes");

      const headers = { Authorization: `Bearer ${token}` };
      const body = {
        models: editInputFields.map((item) => ({
          recordId: item.recordId,
          identifier: item.identifier || "-",
          shortDescription: item.shortDescription || "-",
          subsidiaries:item.subsidiaries,
          status: ButtonActive,
        })),
      };

      // Log the data being sent to the API
      console.log(body, "Submitting form data");

      const response = await axios.post(`${api}/admin/model/edit`, body, {
        headers,
      });

      // Log the response from the API
      console.log(response.data, "Response after submitting");
      dispatch(clearAllEditRecordIds());
      // Navigate after successful submission
      router.push("/cheil/data/model");
    } catch (err) {
      setError("Error saving model data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchData = async (jwtToken) => {
  setLoading(true);
  try {
    const headers = { Authorization: `Bearer ${jwtToken}` };
    const body = { models: selectedID.map((id) => ({ recordId: id })) };
    const response = await axios.post(`${api}/admin/model/getedits`, body, {
      headers,
    });
    const models = response.data.models.map((item) => ({
      ...item,
      subsidiaries: Array.isArray(item.subsidiaries) && item.subsidiaries.length > 0
          ? item.subsidiaries
          : [], // Ensure this is an array
  }));
  console.log(models, "models from API with subsidiaries"); // Log the models
  
  
  console.log(models,"models");
  
    // Set the fetched models to state
    setEditInputFields(models);

    // Set the selectedSubsidiary to pre-fill the dropdown (assuming only one model for simplicity)
    if (response.data.models.length > 0) {
      setSelectedSubsidiary(response.data.models[0].subsidiaries.map((sub) => sub.recordId));
    }
    setLoading(false);
    console.log(response.data.models, "response from API");
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

  const pagename = "Edit Model";
  const breadscrums = "Data > Model";

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
          </div></>) :(
            <>
            {
              editInputFields.length < 1 ? (
                <div className="w-full flex flex-col  h-40 justify-center items-center">
                <div className="opacity-35 ">
                  <Lottie options={defaultOptions} height={100} width={100} />
                </div>
                <div>No data data found...</div>
              </div>
              ) : (
                <>
                 <div className="p-2">
                 <div className="flex flex-col bg-gray-200 min-h-96 p-2 gap-3 rounded-md">
              {editInputFields.length > 0 ? (
                editInputFields.map((item, index) => (
                  <div key={item.recordId}>
                    <div className="flex flex-col bg-gray-200 p-2 rounded-md ">
                      <div className="bg-white p-4 rounded-md shadow-md">
                        <div className="grid grid-cols-4 gap-4 mb-4 items-center justify-center  flex-col">
                          <TextField
                            label="Model Id"
                            variant="standard"
                            fullWidth
                            name="identifier"
                            value={item.identifier}
                            onChange={(e) => handleInputChange(e, index)}
                          />
                          <TextField
                            label="Short Description"
                            variant="standard"
                            fullWidth
                            name="shortDescription"
                            value={item.shortDescription}
                            onChange={(e) => handleInputChange(e, index)}
                          />
                         <MultiSelectSubsidiary setSelectedSubsidiary={(newNode) => {
                    const updatedFields = editInputFields.map((field, i) => {
                      if (i === index) {
                        return { ...field, subsidiaries: newNode }; // Update node data
                      }
                      return field;
                    });
                    setEditInputFields(updatedFields); // Update state
                  }} selectedSubsidiary={item.subsidiaries} />

<SelectCategory
  selectedCategory={item.categories}
  setCategory={(newCategory) => {
    const updatedFields = editInputFields.map((field, i) => {
      if (i === index) {
        return { ...field, categories: newCategory }; // Update the specific category for this model
      }
      return field;
    });
    setEditInputFields(updatedFields); // Update the state
  }}
/>

                        </div>

                        <div className="flex flex-col gap-4">
                        <div className="flex gap-4 items-center justify-end">
                        <button
                  onClick={() => {
                    const updatedButtonActive = [...buttonActiveList];
                    updatedButtonActive[index] = !updatedButtonActive[index];
                    setButtonActiveList(updatedButtonActive);
                  }}
                  className={`${
                    buttonActiveList[index]
                      ? "bg-blue-500 text-white"
                      : "bg-white text-blue-500"
                  } border-2 border-blue-500 rounded-md text-xs px-2 py-0.5`}
                >
                  {buttonActiveList[index] ? "Active" : "Inactive"}
                </button>
                      </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No locator data available.</p>
              )}
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

export default EditModel;
