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
import environment from "../page";
import SingleSelectSubsidiary from "@/app/src/components/dropdown/Subsidiary";
import { clearAllEditRecordIds } from "@/app/src/Redux/Slice/slice";
import MultiSelectSubsidiary from "@/app/src/components/multiSelectDropdown/Subsidiary";
import Lottie from "react-lottie";
import * as animationData from "../../../../../assests/LoadingAnimation.json";


const EditEnvironment = () => {
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

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

const dispatch = useDispatch();
  const [token, setToken] = useState("");
  const [params, setParams] = useState([]);
  const [ButtonActive, setButtonActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [selectedFormat, setSelectedFormat] = useState(""); // For the file format dropdown
  const [editInputfields, seteditInputfields] = useState([]);
  const [initialload, setInitialLoad] = useState(true);


  const [formValues, setFormValues] = useState({
    identifier: "",
    shortDescription: "",
    
  });
  const {identifier,shortDescription} = formValues;

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
  
      // Construct the request body
      const body = {
        environments: editInputfields.map((item) => ({
          recordId: item.recordId,
          identifier: item.identifier || "-",
          shortDescription: item.shortDescription || "-",
          status: item.status, // Use the item's current status
          subsidiaries: item.subsidiaries
        })),
      };
  
      console.log(body, "req body from user");
      console.log(token, "token");
  
      // Send the POST request
      const response = await axios.post(`${api}/admin/environment/edit`, body, { headers });
       router.push("/cheil/admin/environment");
      dispatch(clearAllEditRecordIds());

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
      const body =
      { environments: selectedID.map((id) => ({ recordId: id })) };

      // // Use the correct method and pass params in the config for GET request
      const response = await axios.post(
        `${api}/admin/environment/getedits`,
        body,
        {
          headers,
        }
      );
      setLoading(false)
      console.log(response.data.environments, "response from API");
      seteditInputfields(response.data.environments);
    } catch (err) {
      setError("Error fetching Datasource data");
    } finally {
      setLoading(false);
    }
  };

  const handleRunClick = () => {
    alert("Run function executed from EditEnvironment!");
  };

  const pagename = "Edit";
  const breadscrums = "Admin > Environment";

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
              <div className="grid grid-cols-4 gap-5 mb-4 items-center">
                <TextField
                  label="Identifier"
                  variant="standard"
                  className="text-xs"
                  name="identifier"
                  value={item.identifier ||""}
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
                 <MultiSelectSubsidiary
                initialload={initialload}
                selectedSubsidiary={item.subsidiaries}
                setSelectedSubsidiary={(newNode) => {
                  const updatedFields = editInputfields.map((field, i) => {
                    if (i === index) {
                      return { ...field, subsidiaries: newNode }; // Update node data
                    }
                    return field;
                  });
                  seteditInputfields(updatedFields); // Update state
                }}
              />
             {item.status ? (
  <button
    onClick={() => {
      const updatedFields = editInputfields.map((field, i) =>
        i === index ? { ...field, status: !field.status } : field
      );
      seteditInputfields(updatedFields);
    }}
    className="bg-[#1581ed] border-2 border-solid border-gray-400 rounded-md text-white text-xs px-2 py-0.5 w-[80px] animate__animated  animate__pulse"
  >
    Active
  </button>
) : (
  <button
    onClick={() => {
      const updatedFields = editInputfields.map((field, i) =>
        i === index ? { ...field, status: !field.status } : field
      );
      seteditInputfields(updatedFields);
    }}
    className="bg-[#fff] border-2 border-solid border-[#1581ed] rounded-md text-gray-500 text-xs px-2 py-0.5 w-[80px] animate__animated  animate__pulse"
  >
    Inactive
  </button>
)}

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
              style={{ width: "250px", height: "40px" }}
            >
              Add environment configuration
            </button>
          </div>
        </div>
      </div>
                </>
              )
            }
            </>)
      }


     
    </AddNewPageButtons>
  );
};

export default EditEnvironment;
