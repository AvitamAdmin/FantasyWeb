"use client";
import React, { useEffect, useState } from "react";
import { CircularProgress, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import axios from "axios";
import AddNewPageButtons from "@/app/src/components/AddNewPageButtons/AddNewPageButtons";
import { api } from "@/envfile/api";
import { useDispatch, useSelector } from "react-redux";
import { getCookie } from "cookies-next";
import SingleSelectSubsidiary from "@/app/src/components/dropdown/Subsidiary";
import Lottie from "react-lottie";
import * as animationData from "../../../../../assests/LoadingAnimation.json";
import { clearAllEditRecordIds } from "@/app/src/Redux/Slice/slice";

const EditProfile = () => {
  useEffect(() => {
    const jwtToken = getCookie("jwtToken");
    if (jwtToken) {
      setToken(jwtToken);
      handlefetchData(jwtToken);
    }
  }, []);

  const [token, setToken] = useState("");
  const [editInputfields, setEditInputFields] = useState([]);
  const [buttonActiveList, setButtonActiveList] = useState([]); // For managing button states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initialload, setInitialLoad] = useState(true);
  const router = useRouter();
  const [email, setEmail] = useState("");
  
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
    const storedEmail = localStorage.getItem("username");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    const updatedFields = [...editInputfields];
    updatedFields[index][name] = value;
    setEditInputFields(updatedFields);
  };

  const handlePostClick = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };

      // Construct the request body with status
      const body = {
        testProfiles: editInputfields.map((item, index) => ({
          recordId: item.recordId,
          identifier: item.identifier || "",
          shortDescription: item.shortDescription || "",
          status: buttonActiveList[index] || false, // Use the corresponding button status
          subsidiary: item.subsidiary || "",
        })),
      };

      const response = await axios.post(`${api}/admin/profile/edit`, body, {
        headers,
      });
      dispatch(clearAllEditRecordIds());
      router.push("/cheil/admin/profile");
    } catch (err) {
      setError("Error saving profile data");
    } finally {
      setLoading(false);
    }
  };

  const selectedID = useSelector((state) => state.tasks.multipleEditRecordId);

  const handlefetchData = async (jwtToken) => {
    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${jwtToken}` };

      const body = { testProfiles: selectedID.map((id) => ({ recordId: id })) };
      const response = await axios.post(`${api}/admin/profile/getedits`, body, {
        headers,
      });
      setLoading(false);
      setEditInputFields(response.data.testProfiles);
      setButtonActiveList(response.data.testProfiles.map(() => true)); // Initialize with default active status
    } catch (err) {
      setError("Error fetching profile data");
    } finally {
      setLoading(false);
    }
  };

  const pagename = "Edit";
  const breadscrums = "Admin > Profile";

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
                  <div key={item.recordId}>
                    <div className="flex flex-col bg-gray-200 rounded-md">
                      <div className="bg-white p-4 rounded-md">
                        <div className="grid grid-cols-3 gap-2 mb-4">
                          <TextField
                            label="Enter Identifier"
                            variant="standard"
                            className="text-xs"
                            name="identifier"
                            value={item.identifier}
                            onChange={(e) => handleInputChange(index, e)}
                          />
                          <TextField
                            label="Enter Description"
                            variant="standard"
                            className="text-xs"
                            name="shortDescription"
                            value={item.shortDescription}
                            onChange={(e) => handleInputChange(index, e)}
                          />
                          <SingleSelectSubsidiary
                          initialload={initialload}
                            selectedSubsidiary={item.subsidiary}
                            setSelectedSubsidiary={(newNode) => {
                              const updatedFields = editInputfields.map(
                                (field, i) => {
                                  if (i === index) {
                                    return { ...field, subsidiary: newNode };
                                  }
                                  return field;
                                }
                              );
                              setEditInputFields(updatedFields);
                            }}
                          />
                        </div>

                        <div className="flex flex-row gap-3 items-center justify-end">
                          <button
                            onClick={() => {
                              const updatedButtonActive = [...buttonActiveList];
                              updatedButtonActive[index] =
                                !updatedButtonActive[index];
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

export default EditProfile;
