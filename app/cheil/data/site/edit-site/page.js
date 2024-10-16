"use client";
import React, { useEffect, useState } from "react";
import { CircularProgress, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import axios from "axios";
import { getCookie } from "cookies-next";
import AddNewPageButtons from "@/app/src/components/AddNewPageButtons/AddNewPageButtons";

import { api } from "@/envfile/api";
import { useDispatch, useSelector } from "react-redux";
import SingleSelectSubsidiary from "@/app/src/components/dropdown/Subsidiary";
import { clearAllEditRecordIds } from "@/app/src/Redux/Slice/slice";
import * as animationData from "../../../../../assests/LoadingAnimation.json";
import Lottie from "react-lottie";

const EditSite = () => {
  const [token, setToken] = useState("");
  const [editInputfields, setEditInputfields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const selectedID = useSelector((state) => state.tasks.multipleEditRecordId);
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
      handleFetchData(jwtToken);
    }
  }, []);
  useEffect(() => {
    const storedEmail = localStorage.getItem('username');
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const updatedFields = [...editInputfields];
    updatedFields[index] = { ...updatedFields[index], [name]: value };
    setEditInputfields(updatedFields);
  };

  const handleButtonClick = (index) => {
    const updatedFields = [...editInputfields];
    updatedFields[index].ButtonActive = !updatedFields[index].ButtonActive;
    setEditInputfields(updatedFields);
  };

  const handleSubsidiaryChange = (newSubsidiary, index) => {
    const updatedFields = [...editInputfields];
    updatedFields[index].subsidiary = newSubsidiary;
    setEditInputfields(updatedFields);
  };

  const handlePostClick = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const body = {
        sites: editInputfields.map((item) => ({
          recordId: item.recordId,
          identifier: item.identifier,
          shortDescription: item.shortDescription,
          affiliateId: item.affiliateId,
          affiliateName: item.affiliateName,
          siteChannel: item.siteChannel,
          secretKey: item.secretKey,
          subsidiary: item.subsidiary,
          status: item.ButtonActive,
        })),
      };

      console.log(body, "req body from user");
      const response = await axios.post(`${api}/admin/site/edit`, body, {
        headers,
      });
      console.log(response.data, "response from API");
      dispatch(clearAllEditRecordIds());

      router.push("/cheil/data/site");
    } catch (err) {
      setError("Error saving data");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data based on selected record IDs
  const handleFetchData = async (jwtToken) => {
    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${jwtToken}` };
      const body = { sites: selectedID.map((id) => ({ recordId: id })) };

      const response = await axios.post(`${api}/admin/site/getedits`, body, {
        headers,
      });
      setLoading(false);
      const sitesdata = response.data.sites.map((item) => ({
        ...item,
        ButtonActive: item.status || false,
      }));
      console.log(sitesdata, "req body from edit-user");

      setEditInputfields(sitesdata);
    } catch (err) {
      setError("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  const handleRunClick = () => {
    alert("Run function executed from EditSite!");
  };

  const pagename = "Edit";
  const breadscrums = "Data > Sites";

  return (
    <AddNewPageButtons
      pagename={pagename}
      email={email}
      breadscrums={breadscrums}
      handleSaveClick={handlePostClick}
      handleRunClick={handleRunClick}
    > {
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
            <div
              key={item.recordId}
              className="bg-white p-4 rounded-md shadow-md"
            >
              <div className="grid grid-cols-4 gap-4 mb-4 items-center justify-center  flex-col">
                <TextField
                  label="Enter Identifier"
                  variant="standard"
                  fullWidth
                  name="identifier"
                  value={item.identifier || ""}
                  onChange={(e) => handleInputChange(e, index)}
                />
                <TextField
                  label="Enter Description"
                  variant="standard"
                  fullWidth
                  name="shortDescription"
                  value={item.shortDescription || ""}
                  onChange={(e) => handleInputChange(e, index)}
                />
                <TextField
                  label="Affiliate ID"
                  variant="standard"
                  fullWidth
                  name="affiliateId"
                  value={item.affiliateId || ""}
                  onChange={(e) => handleInputChange(e, index)}
                />
                <TextField
                  label="Affiliate Name"
                  variant="standard"
                  fullWidth
                  name="affiliateName"
                  value={item.affiliateName || ""}
                  onChange={(e) => handleInputChange(e, index)}
                />
              </div>

              <div className="grid grid-cols-4 gap-4 mb-4 items-center justify-center  flex-col">
                <TextField
                  label="Secret Key"
                  variant="standard"
                  fullWidth
                  name="secretKey"
                  value={item.secretKey || ""}
                  onChange={(e) => handleInputChange(e, index)}
                />
                <TextField
                  label="Site Channel"
                  variant="standard"
                  fullWidth
                  name="siteChannel"
                  value={item.siteChannel || ""}
                  onChange={(e) => handleInputChange(e, index)}
                />

                <SingleSelectSubsidiary
                  selectedSubsidiary={item.subsidiary || []}
                  setSelectedSubsidiary={(newSubsidiary) =>
                    handleSubsidiaryChange(newSubsidiary, index)
                  }
                />
              </div>
              <div className="flex gap-4 items-center justify-end">
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
          ))}
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

export default EditSite;
