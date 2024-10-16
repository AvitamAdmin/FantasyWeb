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
import NodeDropdown from "@/app/src/components/dropdown/Node";
import MappingDropdown from "@/app/src/components/dropdown/Mapping";
import SitesDropdown from "@/app/src/components/dropdown/Sites";
import CronjobExpression from "@/app/src/components/modal/CronjobExpression";
import SingleSelectSubsidiary from "@/app/src/components/dropdown/Subsidiary";
import Models from "@/app/src/components/dropdown/Models";
import { clearAllEditRecordIds } from "@/app/src/Redux/Slice/slice";
import Lottie from "react-lottie";
import * as animationData from "../../../../../assests/LoadingAnimation.json";

const EditScheduler = () => {
  useEffect(() => {
    console.log("initial call");

    const jwtToken = getCookie("jwtToken");
    if (jwtToken) {
      setToken(jwtToken);
      handlefetchData(jwtToken);

      // console.log("JWT Token retrieved:", jwtToken);
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
  const [token, setToken] = useState("");
  const [params, setParams] = useState([]);
  const [ButtonActive, setButtonActive] = useState(false);
  const [HistoryActive, sethistoryActive] = useState(false);
  const [initialload, setInitialLoad] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [selectedFormat, setSelectedFormat] = useState(""); // For the file format dropdown
  const [editInputfields, seteditInputfields] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [mapping, setMapping] = useState([]);
  const [selectedSubsidiary, setSelectedSubsidiary] = useState([]);
  const [sites, setSites] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reset, setReset] = useState(false);
  const [Model, setModel] = useState([]);

  const dispatch = useDispatch();

  const [formValues, setFormValues] = useState({
    identifier: "",
    shortDescription: "",
    displayPriority: "",
    path: "",
    parentNode: "",
    skus: "",
    mapping:""
  });
 const {identifier,skus} = formValues
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

  const openModal = () => {
    setIsModalOpen(true);
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
        

        schedulerJob: {
          identifier: identifier || "-",
          cronId: "",
          cronExpression: "",
          sites:sites,
          shortcuts: "",
          subsidiary: selectedSubsidiary,
          mapping: mapping,
          // emails: "",
          // nodePath: "",
          skus:skus,
          // voucherCode: "",
          // jobStatus: "",
          enableHistory: HistoryActive,
          // interfaceName: "",
          status: ButtonActive,
        },
      };

      console.log(body, "req body from user");
      console.log(token, "token");

      // Send the POST request
      const response = await axios.post(`${api}/admin/scheduler/edits`, body, {
        headers,
      });
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
      const headers = { Authorization: `Bearer ${jwtToken}` };
      console.log(selectedID, "selectedID:");
      // Convert selectedID array to a comma-separated string
      const body = {
        schedulerJobs: selectedID.map((id) => ({ recordId: id })),
      };

      // // Use the correct method and pass params in the config for GET request
      const response = await axios.post(
        `${api}/admin/scheduler/getedits`,
        body,
        {
          headers,
        }
      );
      const schedulerJobs = response.data.schedulerJobs.map((item) => ({
        ...item,
        ButtonActive: item.status || false, // Ensure ButtonActive is properly initialized
         }));
      console.log(schedulerJobs, "response from API");
      seteditInputfields(schedulerJobs);
    } catch (err) {
      setError("Error fetching Datasource data");
    } finally {
      setLoading(false);
    }
  };

  const handleRunClick = () => {
    alert("Run function executed from EditScheduler!");
  };

  const pagename = "Edit";
  const breadscrums = "Admin > Scheduler";

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
                ) : (
                  <>
                   <div className="p-2">
        <div className="flex flex-col bg-gray-200 p-2 gap-3 rounded-md">
          {editInputfields.map((item, index) => (
            <div className="bg-gray-200 flex flex-col pb-5 rounded-md">
              <div className="  w-[100%] flex items-center flex-row justify-center ">
                <div className="bg-white  w-[98%] rounded-md shadow-md flex flex-col justify-center gap-2 pb-4">
                  <div className=" w-full grid grid-cols-4  gap-10 p-2 ">
                  <div className="mt-6">                    <NodeDropdown  initialload={initialload} setSelectedNode={setSelectedNode} selectedNode={item.cronId}/>
                  </div>
                  <div className="mt-6"> <MappingDropdown  initialload={initialload}
                      setMapping={item.mapping}
                      mapping={mapping}
                    /></div>

                  <div className="mt-6"> <SingleSelectSubsidiary  initialload={initialload}
                      selectedSubsidiary={item.subsidiary}
                      setSelectedSubsidiary={setSelectedSubsidiary}
                    /></div>
                  <div> <SitesDropdown  initialload={initialload} setSites={setSites} sites={item.sites} /></div>

                   
                   
                   
                  </div>

                  <div className="p-2 flex flex-row gap-3 w-full">
                    <div className="flex flex-col gap-2 w-full">
                      <div className="font-bold">Input Recipients</div>
                      <div className="flex flex-row gap-7 items-center">
                        <textarea   value={item.identifier || ""}
                  onChange={(e) => handleInputChange(e, index)} className="h-32 border-solid border-2 border-gray-300 rounded-md w-full" />
                      </div>
                    </div>
                  </div>

                  <div className=" gap-4 mb-4 items-center w-full justify-between flex-row flex p-2">
                    <div className="w-full items-center flex-row flex">
                      <TextField
                        id="standard-textarea"
                        label="Cronjob Expression"
                        placeholder="Placeholder"
                        multiline
                        variant="standard"
                        onClick={openModal}
                        name="cronExpression"
                        value={item.cronExpression || ""}
                        onChange={handleInputChange}
                        fullWidth
                      />

                      <CronjobExpression
                        isOpen={isModalOpen}
                        setIsModalOpen={setIsModalOpen}
                      />
                    </div>
                    <div className=" flex flex-row items-center justify-center gap-7">
                      <div>
                        {ButtonActive ? (
                          <button
                            onClick={() => setButtonActive(!ButtonActive)}
                            className="bg-[#1581ed] border-2 border-solid border-gray-400 rounded-md text-white text-xs px-2 py-0.5 w-[80px] animate__animated  animate__pulse"
                          >
                            Active
                          </button>
                        ) : (
                          <button
                            onClick={() => setButtonActive(!ButtonActive)}
                            className="bg-[#fff] border-2 border-solid border-[#1581ed] rounded-md text-gray-500 text-xs px-2 py-0.5 w-[80px] animate__animated  animate__pulse"
                          >
                            Inactive
                          </button>
                        )}
                      </div>
                      <div>
                        {HistoryActive ? (
                          <button
                            onClick={() => sethistoryActive(!HistoryActive)}
                            className="bg-[#1581ed] border-2 border-solid border-gray-400 rounded-md text-white text-xs px-2 py-0.5 w-[100px] animate__animated  animate__pulse"
                          >
                            Save History
                          </button>
                        ) : (
                          <button
                            onClick={() => sethistoryActive(!HistoryActive)}
                            className="bg-[#fff] border-2 border-solid border-[#1581ed] rounded-md text-gray-500 text-xs px-2 py-0.5 w-[100px] animate__animated  animate__pulse"
                          >
                            UnSave
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 flex flex-col gap-3">
            <div className="flex flex-col gap-3">
              <div className="font-bold">Please enter SKU's</div>
              <div className="flex flex-row gap-7 items-center">
                <textarea
                  name="skus"
                  value={item.skus || ""}
                  onChange={(e) => handleInputChange(e, index)}
                  className="w-[100%] h-52 border-solid border-2 border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div className="p-2">
              <Models  initialload={initialload} Model={item.shortcuts} setModel={setModel} />
            </div>
          </div>

              <div className="p-4 flex flex-col gap-3 w-full">
                {reset && (
                  <div className="flex flex-col w-full justify-center items-center">
                    <button
                      className="bg-[#cc0001]  py-1 w-[100px] rounded-md text-white justify-center items-center"
                      onClick={() => setReset(!reset)}
                    >
                      Reset all
                    </button>
                  </div>
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
            {/* <button
              className="flex items-center justify-center mt-4 p-2 rounded-md bg-black text-white"
              onClick={handleAddParamClick}
              style={{ width: "100px", height: "40px" }}
            >
              Add Param
            </button> */}
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

export default EditScheduler;
