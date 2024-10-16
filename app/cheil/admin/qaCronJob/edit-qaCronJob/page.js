"use client";
import React, { useEffect, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import axios from "axios";
import AddNewPageButtons from "@/app/src/components/AddNewPageButtons/AddNewPageButtons";
import { api } from "@/envfile/api";
import { useDispatch, useSelector } from "react-redux";
import { getCookie } from "cookies-next";
import { clearAllEditRecordIds } from "@/app/src/Redux/Slice/slice";
import Lottie from "react-lottie";
import * as animationData from "../../../../../assests/LoadingAnimation.json";
import Dashboard from "@/app/src/components/dropdown/Dashboard";
import CronJobProfile from "@/app/src/components/dropdown/CronJobProfile";
import CronjobExpression from "@/app/src/components/modal/CronjobExpression";

const EditQACronJob = () => {
  const [token, setToken] = useState("");
  const [params, setParams] = useState([]);
  const [ButtonActive, setButtonActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [editInputfields, seteditInputfields] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cronJobProfile, setCronJobProfile] = useState([]);
  const [selectedDashboard, setSelectedDashboard] = useState("");

  const dispatch = useDispatch();

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
      handlefetchData(jwtToken);
      
    } else {
      console.log("No token found");
    }
  }, []);

  useEffect(() => {
    const storedEmail = localStorage.getItem("username");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;

    const updatedFields = editInputfields.map((item, i) => {
      if (i === index) {
        if (name === "parentNode") {
          return {
            ...item,
            parentNode: { ...item.parentNode, identifier: value },
          };
        }

        if (name === "envProfiles") {
          return {
            ...item,
            envProfiles: value,
          };
        }

        return { ...item, [name]: value };
      }
      return item;
    });

    seteditInputfields(updatedFields);
  };

  const handlePostClick = async () => {
    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${token}` };

      const body = {
        cronJobs: editInputfields.map((item) => ({
          recordId: item.recordId,
          identifier: item.identifier || "-",
          emailSubject: item.emailSubject || "-",
          dashboard: item.dashboard || "-",
          cronExpression: item.cronExpression || "-",
          cronProfileId: item.cronProfileId || "-",
          envProfiles: item.envProfiles || "-",
          skus: item.skus || "-",
          campaign: item.campaign || "-",
          status: item.ButtonActive,
        })),
      };

      console.log(body, "req body from user");

      const response = await axios.post(`${api}/admin/qaCronJob/edit`, body, {
        headers,
      });

      dispatch(clearAllEditRecordIds());
      router.push("/cheil/admin/qaCronJob");
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
      setLoading(true);
      const headers = { Authorization: `Bearer ${jwtToken}` };

      const body = { cronJobs: selectedID.map((id) => ({ recordId: id })) };

      const response = await axios.post(
        `${api}/admin/qaCronJob/getedits`,
        body,
        {
          headers,
        }
      );
      setLoading(false);

      console.log("Response from API:", response.data.cronJobs);

      if (Array.isArray(response.data.cronJobs)) {
        const cronJobs = response.data.cronJobs.map((item) => ({
          ...item,
          ButtonActive: item.status || false, 
         
         
        }));
        seteditInputfields(cronJobs);
      } else {
        console.error("cronJobs is not an array:", response.data.cronJobs);
        seteditInputfields([]);
      }
    } catch (err) {
      console.error("Error fetching Datasource data", err);
      setError("Error fetching Datasource data");
    } finally {
      setLoading(false);
    }
  };

  const pagename = "Edit";
  const breadscrums = "Admin > QACronJob";

  const enviromentFields = [
    {
      value: "stag",
      label: "Stag",
    },
    {
      value: "prod-two",
      label: "Prod-two ",
    },
    {
      value: "prod",
      label: "Prod ",
    },
    {
      value: "dashboard",
      label: "Dashboard",
    },
  ];

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
    >
      {loading ? (
        <div className="flex flex-row justify-center items-center w-full h-40">
          <div className="gap-5 flex flex-col items-center justify-center">
            <CircularProgress size={36} color="inherit" />
            <div>Loading...</div>
          </div>
        </div>
      ) : (
        <div className="p-2">
          {!editInputfields || editInputfields.length < 1 ? (
            <div className="w-full flex flex-col h-40 justify-center items-center">
              <div className="opacity-10 ">
                <Lottie options={defaultOptions} height={100} width={100} />
              </div>
              <div>No data found...</div>
            </div>
          ) : (
            <div className="p-2">
              <div className="flex flex-col bg-gray-200 p-2 gap-3 rounded-md">
                {(editInputfields || []).map((item, index) => (
                  <div
                    key={item.recordId || index}
                    className="bg-white p-4 rounded-md shadow-md"
                  >
                    <div className="grid grid-cols-3 gap-5 mb-4">
                      <TextField
                        label="Identifier"
                        variant="standard"
                        className="text-xs"
                        name="identifier"
                        value={item.identifier || ""}
                        onChange={(e) => handleInputChange(e, index)}
                      />
                      <TextField
                        label="Email Subject"
                        variant="standard"
                        className="text-xs"
                        name="emailSubject"
                        value={item.emailSubject || ""}
                        onChange={(e) => handleInputChange(e, index)}
                      />
                      <Dashboard
                        selectedDashboard={item.dashboard}
                        setSelectedDashboard={(newNodes) => {
                          const updatedFields = editInputfields.map(
                            (field, i) => {
                              if (i === index) {
                                return { ...field, dashboard: newNodes };
                              }
                              return field;
                            }
                          );
                          seteditInputfields(updatedFields);
                        }}
                      />
                      <TextField
                        label="Cronjob Expression"
                        variant="standard"
                        className="text-xs"
                        name="cronExpression"
                        value={item.cronExpression || ""}
                        onChange={(e) => handleInputChange(e, index)}
                      />
                      <CronjobExpression
                        isOpen={isModalOpen}
                        setIsModalOpen={setIsModalOpen}
                      />

                      <CronJobProfile
                        selectedCronJobProfile={item.cronProfileId}
                        setSelectedCronJobProfile={(newNodes) => {
                          const updatedFields = editInputfields.map(
                            (field, i) => {
                              if (i === index) {
                                return { ...field, cronProfileId: newNodes };
                              }
                              return field;
                            }
                          );
                          seteditInputfields(updatedFields);
                        }}
                      />
                      <Autocomplete
                        multiple
                        size="small"
                        options={enviromentFields}
                        getOptionLabel={(option) => option.label}
                        value={
                          item.envProfiles
                            ? enviromentFields.filter((option) =>
                                item.envProfiles.includes(option.value)
                              )
                            : []
                        }
                        isOptionEqualToValue={(option, value) =>
                          option.value === value.value
                        }
                        onChange={(event, newValue) => {
                          const selectedValues = newValue.map(
                            (option) => option.value
                          );

                          const updatedFields = editInputfields.map(
                            (field, i) => {
                              if (i === index) {
                                return {
                                  ...field,
                                  envProfiles: selectedValues,
                                };
                              }
                              return field;
                            }
                          );

                          seteditInputfields(updatedFields);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="standard"
                            label="Select Environment Type"
                          />
                        )}
                      />
                       


                    </div>
                    <div className="flex flex-row w-full  p-3 justify-between gap-5">
                       <div className="flex flex-row w-[50%]">
                     <textarea
  placeholder="Enter SKU's"
  className="w-full h-44 border-solid border-2 border-gray-300 rounded-md p-2"
  name="skus"
  value={item.skus || ""}
  onChange={(e) => handleInputChange(e, index)}
/></div>
<div className="flex flex-row w-[50%]">
<textarea
  placeholder="Enter Campaign"
  className="w-full h-44 border-solid border-2 border-gray-300 rounded-md p-2"
  name="campaign"
  value={item.campaign || ""}
  onChange={(e) => handleInputChange(e, index)}
/>
</div>
</div>
                    <div className="flex gap-4 mt-4 items-center justify-end">
             
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
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </AddNewPageButtons>
  );
};

export default EditQACronJob;
