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
import { TextFields } from "@mui/icons-material";
import SelectSubsidiary from "@/app/src/components/dropdown/Subsidiary";
import { clearAllEditRecordIds } from "@/app/src/Redux/Slice/slice";
import Lottie from "react-lottie";
import * as animationData from "../../../../../assests/LoadingAnimation.json";


const EditLocatorGroup = () => {
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

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
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
  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
  
    const updatedFields = editInputfields.map((item, i) => {
      if (i === index) {
        if (name === "subsidiary") {
          return {
            ...item,
            subsidiary: { ...item.subsidiary, identifier: value }, // Only update the identifier field of parentNode
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
  const dispatch = useDispatch();

  const handlePostClick = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
  
      // Construct the request body
      const body = {
        testLocatorGroups: editInputfields.map((item) => ({
          recordId: item.recordId,
          identifier: item.identifier || "",
          shortDescription: item.shortDescription || "",
          subsidiary:item.subsidiary || "",
          // displayPriority: item.displayPriority || "-",
          // path: item.path || "-",
          // parentNode: {identifier :item.parentNode?.identifier || "-"}, // Ensure parentNode.identifier exists
          status: item.ButtonActive, // Use button active status (true or false)
          checkEppSso:item.ButtonEppssocheck,
          takeAScreenshot:item.ButtonScreenshot,
          published:item.ButtonPublished
        })),
      };
  
      console.log(body, "req body from user");
      console.log(token, "token");
  
      // Send the POST request
      const response = await axios.post(`${api}/admin/locatorGroup/edit`, body, { headers });
      dispatch(clearAllEditRecordIds());
      router.push("/cheil/admin/locatorGroup");
      console.log(response.data, "response from API");
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
      setLoading(true)
      const headers = { Authorization: `Bearer ${jwtToken}` };

      // Convert selectedID array to a comma-separated string
      const body = {
        testLocatorGroups: selectedID.map((id) => ({ recordId: id })) 
      };

      // // Use the correct method and pass params in the config for GET request
      const response = await axios.post(
        `${api}/admin/locatorGroup/getedits`,
        body,
        {
          headers,
        }
      );
      setLoading(false)
      const testLocatorGroups = response.data.testLocatorGroups.map((item) => ({
        ...item,
        ButtonActive: item.status || false, 
        ButtonEppssocheck: item.checkEppSso || false, 
        ButtonScreenshot: item.takeAScreenshot || false, 
        ButtonPublished: item.published || false, 
       
      }));
      console.log(testLocatorGroups, "response from API");
      seteditInputfields(testLocatorGroups);
    } catch (err) {
      setError("Error fetching Datasource data");
    } finally {
      setLoading(false);
    }
  };

  const handleRunClick = () => {
    alert("Run function executed from EditLocatorGroup!");
  };

  const pagename = "Edit";
  const breadscrums = "Admin > LocatorGroup";
  const toggleButtonState = (index, buttonName) => {
    const updatedFields = editInputfields.map((item, i) => {
      if (i === index) {
        return { ...item, [buttonName]: !item[buttonName] }; // Toggle button state
      }
      return item;
    });
  
    seteditInputfields(updatedFields);
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
            </div></>) :(<>
            {
              editInputfields.length < 1 ? (
                <div className="w-full flex flex-col  h-40 justify-center items-center">
                <div className="opacity-5 ">
                  <Lottie options={defaultOptions} height={100} width={100} />
                </div>
                <div>No data data found...</div>
              </div>
              ) : (<>

<div className="p-2">
<div className="flex flex-col bg-gray-200 p-2 gap-3 rounded-md">
      {editInputfields.map((item, index) => (
  <div key={item.recordId} className="bg-white p-4 rounded-md shadow-md">
    <div className="flex flex-col w-[100%] bg-white rounded-lg p-3 gap-4 text-sm">
      <div className="flex flex-col gap-4 rounded-lg bg-white border-solid border-2 border-white w-full">
        <div className="flex-row justify-between grid grid-cols-3 gap-3">
          <TextField
            id="standard-textarea"
            label="Enter Identifier"
            placeholder="Placeholder"
            multiline
            variant="standard"
            className="mt-3"
            name="identifier"
            value={item.identifier}
            onChange={(e) => handleInputChange(e, index)}
          />
          <TextField
            id="standard-textarea"
            label="Enter Description"
            placeholder="Placeholder"
            multiline
            variant="standard"
            className="mt-3"
            name="shortDescription"
            value={item.shortDescription}
            onChange={(e) => handleInputChange(e, index)}
          />
          <div className="mt-3.5">
            <SelectSubsidiary
              selectedSubsidiary={item.subsidiary}
              setSelectedSubsidiary={(newNode) => {
                const updatedFields = editInputfields.map((field, i) => {
                  if (i === index) {
                    return { ...field, subsidiary: newNode };
                  }
                  return field;
                });
                seteditInputfields(updatedFields);
              }}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-row w-[100%] justify-between text-sm">
        <div className="flex flex-col gap-5">
          <div className="flex flex-row gap-5">
            <div>
              <button className="bg-black border-2 border-solid rounded-md border-black py-1 px-3 text-white font-bold text-sm">
                Load
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          <div className="flex flex-row gap-3 items-center">
            <button
              onClick={() => toggleButtonState(index, 'ButtonPublished')}
              className={`${
                item.ButtonPublished ? "bg-[#1581ed] text-white border-[#1581ed]"  : "bg-[#fff] text-gray-500 border-gray-400"
              } border-2 border-solid rounded-md text-xs px-2 py-0.5 w-[90px]`}
            >
              {item.ButtonPublished ? "Published" : "Unpublished"}
            </button>
          </div>

          <div className="flex flex-row gap-3 items-center">
            <button
              onClick={() => toggleButtonState(index, 'ButtonScreenshot')}
              className={`${
                item.ButtonScreenshot ? "bg-[#1581ed] text-white border-[#1581ed]"  : "bg-[#fff] text-gray-500 border-gray-400"
              } border-2 border-solid rounded-md text-xs px-2 py-0.5 w-[100px]`}
            >
              {item.ButtonScreenshot ? "Screenshot" : "No Screenshot"}
            </button>
          </div>

          <div className="flex flex-row gap-3 items-center">
            <button
              onClick={() => toggleButtonState(index, 'ButtonEppssocheck')}
              className={`${
                item.ButtonEppssocheck ? "bg-[#1581ed] text-white border-[#1581ed]"  : "bg-[#fff] text-gray-500 border-gray-400"
              } border-2 border-solid rounded-md text-xs px-2 py-0.5 w-[100px]`}
            >
              Epp sso check
            </button>
          </div>

          <div className="flex flex-row gap-3 items-center">
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
  </div>
))}

    </div>
</div>

              </>)
            }
            </>)
      }



     

    </AddNewPageButtons>
  );
};

export default EditLocatorGroup;
