"use client";
import React, { useEffect, useState } from "react";
import { CircularProgress, TextField } from "@mui/material";
import axios from "axios";
import { api } from "@/envfile/api";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import AddNewPageButtons from "@/app/src/components/AddNewPageButtons/AddNewPageButtons";
import { useDispatch, useSelector } from "react-redux";
import TestPlan from "@/app/src/components/dropdown/TestPlan";
import Lottie from "react-lottie";
import * as animationData from "../../../../../assests/LoadingAnimation.json";
import { clearAllEditRecordIds } from "@/app/src/Redux/Slice/slice";


const EditMessages = () => {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const selectedID = useSelector((state) => state.tasks.multipleEditRecordId);
  const [editInputfields, setEditInputfields] = useState([]);
  const [buttonActiveList, setButtonActiveList] = useState([]);
  const [testPlan, setTestPlan] = useState([]);
  const [email, setEmail] = useState("");

  const dispatch = useDispatch();

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
    }
  }, []);

  const handleFetchData = async (jwtToken) => {
    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${jwtToken}` };
      const body = { messageResources: selectedID.map((id) => ({ recordId: id })) };

      const response = await axios.post(`${api}/admin/messages/getedits`, body, { headers });
      const messageResources = response.data.messageResources || [];
      console.log(response, "messages");
      setButtonActiveList(messageResources.map((plan) => plan.status === true));
      setEditInputfields(response.data.messageResources || []);
    } catch (err) {
      setError("Error fetching Datasource data");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    const updatedFields = editInputfields.map((item, i) => {
      if (i === index) {
        return { ...item, [name]: value };
      }
      return item;
    });
    setEditInputfields(updatedFields);
  };

  const handleTestPlanChange = (index, selectedTestPlanId) => {
    const updatedFields = editInputfields.map((item, i) => {
      if (i === index) {
        return { ...item, testPlanId: selectedTestPlanId }; // Update the testPlanId
      }
      return item;
    });
    setEditInputfields(updatedFields); // Update the state with the selected test plan
  };

  const handleSaveClick = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const body = {
        messageResources: editInputfields.map((item, index) => ({
          recordId: item.recordId,
          identifier: item.identifier || "-",
          shortDescription: item.shortDescription || "-",
          testPlanId: Number(item.testPlanId || "-"), 
          type: item.type || "-",
          percentFailure: item.percentFailure || "-",
          recipients: item.recipients || "-",
          status: buttonActiveList[index], 
        })),
      };
  
      await axios.post(`${api}/admin/messages/edit`, body, { headers });
      router.push("/cheil/admin/messages");
      dispatch(clearAllEditRecordIds());
    } catch (err) {
      setError("Error saving Datasource data");
    }
  };


  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  

  const breadscrums = "Admin > Messages";
  const pagename = "Edit";

  return (
    <AddNewPageButtons
      pagename={pagename}
      email={email}
      breadscrums={breadscrums}
      handleSaveClick={handleSaveClick}
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
              ) : (
                <>
                  <div
        className="flex flex-col w-full p-3 min-h-screen gap-5"
        style={{ fontFamily: "SamsungOne, sans-serif" }}
      >
        {editInputfields.map((item, index) => (
          <div key={item.recordId} className="flex flex-col bg-gray-200 rounded-md shadow mb-5">
            <div className="bg-white p-4 rounded-md shadow-md flex flex-col">
              <div className="grid grid-cols-3 gap-5 mb-4">
                <TextField
                  label="Identifier"
                  variant="standard"
                  fullWidth
                  name="identifier"
                  value={item.identifier}
                  onChange={(e) => handleInputChange(index, e)}
                />
                <TextField
                  label="Short Description"
                  variant="standard"
                  fullWidth
                  name="shortDescription"
                  value={item.shortDescription}
                  onChange={(e) => handleInputChange(index, e)}
                />
               <div className="bt-4">
               <TestPlan
                  setTestPlan={(selectedTestPlanId) => handleTestPlanChange(index, selectedTestPlanId)} // Pass index to TestPlan
                  testPlan={testPlan}
                  existingTestPlan={item.testPlanId} // Pass the current testPlanId to the component
                />
               </div>
                <TextField
                  label="channel type"
                  variant="standard"
                  fullWidth
                  name="type"
                  value={item.type}
                  onChange={(e) => handleInputChange(index, e)}
                />
                <TextField
                  label="Percent Failure"
                  variant="standard"
                  fullWidth
                  name="percentFailure"
                  value={item.percentFailure}
                  onChange={(e) => handleInputChange(index, e)}
                />
                <TextField
                  label="Recipients"
                  variant="standard"
                  fullWidth
                  name="recipients"
                  value={item.recipients}
                  onChange={(e) => handleInputChange(index, e)}
                />
              </div>

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
                  } border-2 border-blue-500 rounded-md text-xs px-2 py-0.5 w-[80px]`}
                >
                  {buttonActiveList[index] ? "Active" : "Inactive"}

                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
                </>
              )
            }
            </>)
      }



     
    </AddNewPageButtons>
  );
};

export default EditMessages;