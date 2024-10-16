"use client";
import React, { useEffect, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { CircularProgress, TextField } from "@mui/material";
import { TbClockEdit, TbClockPlus } from "react-icons/tb";
import { useRouter } from "next/navigation";
import axios from "axios";
import AddNewPageButtons from "@/app/src/components/AddNewPageButtons/AddNewPageButtons";
import { api } from "@/envfile/api";
import { useDispatch, useSelector } from "react-redux";
import { getCookie } from "cookies-next";
import Lottie from "react-lottie";
import * as animationData from "../../../../../assests/LoadingAnimation.json";
import { clearAllEditRecordIds } from "@/app/src/Redux/Slice/slice";

const EditImpactConfig = () => {
  useEffect(() => {
    console.log("initial call");

    const jwtToken = getCookie("jwtToken");
    if (jwtToken) {
      setToken(jwtToken);
      handlefetchData(jwtToken);

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
  const [buttonActiveList, setButtonActiveList] = useState([]);

  const dispatch = useDispatch();

  const [formValues, setFormValues] = useState({
    identifier: "",
    shortDescription: "",
    displayPriority: "",
    path: "",
    parentNode: "",
  });

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  useEffect(() => {
    const storedEmail = localStorage.getItem("username");
    if (storedEmail) {
      setEmail(storedEmail);
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

  // Handle change for form inputs
  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    const updatedFields = editInputfields.map((item, i) => {
      if (i === index) {
        return { ...item, [name]: value };
      }
      return item;
    });
    seteditInputfields(updatedFields);
  };
  
  

  const handleFormatChange = (format) => {
    setSelectedFormat(format); // Capture the file format
  };

  const handlePostClick = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const body = {
        impactConfigs: editInputfields.map((item, index) => ({
          recordId: item.recordId,
          identifier: item.identifier || "-",
          status: buttonActiveList[index],
        })),
      };
  
      // Await the API call
      const response = await axios.post(`${api}/admin/impactConfig/edit`, body, { headers });
      
      console.log("Response from API:", response.data);
      
      // Navigate to another page after successful response
      router.push("/cheil/admin/impactConfig");
      dispatch(clearAllEditRecordIds());
    } catch (err) {
      console.error("Error saving data:", err);
      setError("Error saving Datasource data");
    } finally {
      setLoading(false); // Make sure to set loading false
    }
  };
  
  
  
  

  const selectedID = useSelector((state) => state.tasks.multipleEditRecordId);

  const handlefetchData = async (jwtToken) => {
    try {
      setLoading(true)
      const headers = { Authorization: `Bearer ${jwtToken}` };
      const body = { impactConfigs: selectedID.map((id) => ({ recordId: id })) };
  
      // Ensure that the API call is awaited
      const response = await axios.post(`${api}/admin/impactConfig/getedits`, body, { headers });
      setLoading(false)
      console.log(response.data.impactConfigs, "response from API");
  
      seteditInputfields(response.data.impactConfigs);
      setButtonActiveList(response.data.impactConfigs.map((config) => config.status || false));
    } catch (err) {
      setError("Error fetching Datasource data");
    } finally {
      setLoading(false);
    }
  };
  
  
  

    // Handle button toggle for active/inactive status
    const handleStatusToggle = (index) => {
      const updatedButtonActiveList = [...buttonActiveList];
      updatedButtonActiveList[index] = !updatedButtonActiveList[index];
      setButtonActiveList(updatedButtonActiveList);
    };

  const handleRunClick = () => {
    alert("Run function executed from EditImpactConfig!");
  };

  const pagename = "Edit";
  const breadscrums = "Admin > ImpactConfig";

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
              editInputfields.length < 1 ? (
                <div className="w-full flex flex-col  h-40 justify-center items-center">
                <div className="opacity-35 ">
                  <Lottie options={defaultOptions} height={100} width={100} />
                </div>
                <div>No data data found...</div>
              </div>
              ) :(
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
                  className="text-xs"
                  name="identifier"
                  value={item.identifier || ""}
                  onChange={(e) => handleInputChange(index, e)} // Pass index
                />
              
              </div>
              <div className="flex gap-4 items-center justify-end">
              <button
                  onClick={() => handleStatusToggle(index)}
                  className={`${
                    buttonActiveList[index]
                      ? "bg-blue-500 text-white"
                      : "bg-white text-blue-500"
                  } border-2 border-blue-500 rounded-md text-xs px-2 py-0.5 w-[80px]`}
                >
                  {buttonActiveList[index] ? "Active" : "Inactive"}
                </button>
              </div>
            </div>
          ))}
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
                    className="w-full"
                  />
                  <button
                    className="flex items-center justify-center p-2 rounded-md bg-red-600 text-white"
                    onClick={() => handleRemoveParamClick(index)}
                    style={{ width: "40px", height: "40px" }}
                  >
                    <FaMinus />
                  </button>
                </div>
              ))}
            </div>
            <button
              className="flex items-center justify-center mt-4 p-2 rounded-md bg-black text-white"
              onClick={handleAddParamClick}
              style={{ width: "100px", height: "40px" }}
            >
              Add Param
            </button>
          </div>
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

export default EditImpactConfig;
