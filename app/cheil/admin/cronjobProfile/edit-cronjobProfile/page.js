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

const EditCronjobProfile = () => {
 
  const [token, setToken] = useState("");
  const [params, setParams] = useState([]);
  const [buttonActiveList, setButtonActiveList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [selectedFormat, setSelectedFormat] = useState(""); 
  const [editInputfields, seteditInputfields] = useState([]);

  const [formValues, setFormValues] = useState({
    identifier: "",
    recipients:"",
  });

  const dispatch = useDispatch();

  useEffect(() => {
    const storedEmail = localStorage.getItem("username");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  useEffect(() => {
    console.log("initial call");
    const jwtToken = getCookie("jwtToken");
    if (jwtToken) {
      setToken(jwtToken);
      handleFetchData(jwtToken);
      console.log("JWT Token retrieved:", jwtToken);
    } else {
      console.log("No token found");
    }
  }, []);
  
  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    const updatedFields = [...editInputfields];
    updatedFields[index] = {
      ...updatedFields[index],
      [name]: value,
    };
    seteditInputfields(updatedFields);
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  
  
  const handleFormatChange = (format) => {
    setSelectedFormat(format); 
  };

  const handlePostClick = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
  
      
      const body = {
        cronJobProfiles: editInputfields.map((item,index) => ({
          recordId: item.recordId,
          identifier: item.identifier || "-",
          recipients: item.recipients || "-",
          status: item.ButtonActive 
        })),
      };
  
      console.log(body, "req body from user");
      console.log(token, "token");
  
      // Send the POST request
      const response = await axios.post(`${api}/admin/cronjobProfile/edit`, body, { headers });
  
      console.log(response.data, "response from API");
      router.push("/cheil/admin/cronjobProfile");
      dispatch(clearAllEditRecordIds());
    } catch (err) {
      setError("Error saving Datasource data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  

  const selectedID = useSelector((state) => state.tasks.multipleEditRecordId);

  const handleFetchData = async (jwtToken) => {
    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${jwtToken}` };
      const body = { cronJobProfiles: selectedID.map((id) => ({ recordId: id })) };

      const response = await axios.post(`${api}/admin/cronjobProfile/edit`, body, { headers });
      console.log(response, "cronjobprofiles");
      const cronJobProfiles = response.data.cronJobProfiles.map((item) => ({
        ...item,
        ButtonActive: item.status || false, 
       
       
      }));
      seteditInputfields(cronJobProfiles || []);
      
    } catch (err) {
      setError("Error fetching cronJobProfiles data");
    } finally {
      setLoading(false);
    }
  };

  const handleRunClick = () => {
    alert("Run function executed from EditCronjobProfile!");
  };

  const handleStatusToggle = (index) => {
    const updatedButtonActiveList = [...buttonActiveList];
    updatedButtonActiveList[index] = !updatedButtonActiveList[index];
    setButtonActiveList(updatedButtonActiveList);
  };

  const pagename = "Edit";
  const breadscrums = "Admin > CronjobProfile";

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
                 <div
        className="flex flex-col w-full  min-h-screen gap-5"
        style={{ fontFamily: "SamsungOne, sans-serif" }}
      >
      {editInputfields.map((item, index) => (
        <div className="bg-gray-200 flex flex-col pb-5 rounded-md" key={index}>
          <div className="w-[100%] flex items-center flex-row justify-center">
            <div className="bg-white w-[98%] rounded-md shadow-md flex flex-col justify-center gap-2 pb-4">
              <div className="w-full flex flex-row justify-between gap-10 p-2 items-center"></div>
      
              <div className="w-full flex flex-row p-2">
                <TextField
                  fullWidth
                  label="Enter Identifier"
                  id={`identifier-${index}`} 
                  size="small"
                  name="identifier"
                  value={item.identifier || ""}
                  onChange={(e) => handleInputChange(index, e)}
                />
              </div>
      
              <div className="p-2 flex flex-row gap-3 w-full">
                <div className="flex flex-col gap-2 w-full">
                  <div className="font-bold">Input Recipients</div>
                  <div className="flex flex-row gap-7 items-center">
                    <textarea
                      className="w-[100%] h-32 border-solid border-2 border-gray-300 rounded-md"
                      name="recipients"
                      value={item.recipients || ""}
                      onChange={(e) => handleInputChange(index, e)}
                    />
                  </div>
                </div>
              </div>
      
              <div className="flex gap-4 items-center justify-end">
             
            <button
              onClick={() => toggleButtonState(index, 'ButtonActive')}
              className={`${
                item.ButtonActive ? "bg-[#1581ed] text-white border-[#1581ed]"  : "bg-[#fff] text-gray-500 border-gray-400"
              } border-2 border-solid  rounded-md  text-xs px-2 py-0.5 w-[80px]`}
            >
              {item.ButtonActive ? "Active" : "Inactive"}
            </button>
              </div>
            </div>
          </div>
        </div>
      ))}
      
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

export default EditCronjobProfile;
