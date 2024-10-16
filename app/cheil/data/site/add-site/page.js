"use client";
import React, { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import AddNewPageButtons from "@/app/src/components/AddNewPageButtons/AddNewPageButtons";
import { useRouter } from "next/navigation";
import axios from "axios";
import { api } from "@/envfile/api";
import { getCookie } from "cookies-next";
import SingleSelectSubsidiary from "@/app/src/components/dropdown/Subsidiary";

const Addsite = () => {
  const [params, setParams] = useState([]);
  const [ButtonActive, setButtonActive] = useState(false);
  const [selectedSubsidiary, setSelectedSubsidiary] = useState([]);
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  useEffect(() => {
    const storedEmail = localStorage.getItem("username");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);
  const [formValues, setFormValues] = useState({});

  useEffect(() => {
    const jwtToken = getCookie("jwtToken");
    if (jwtToken) {
      setToken(jwtToken);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSaveClick = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const body = {
        sites: [
          {
            identifier: formValues.identifier,
            shortDescription: formValues.shortDescription,
            affiliateId: formValues.affiliateId,
            affiliateName: formValues.affiliateName,
            siteChannel: formValues.siteChannel,
            secretKey: formValues.secretKey,
            subsidiary: selectedSubsidiary,
            status: ButtonActive,
          },
        ],
      };

      console.log(body, "req body from user");
      console.log(token, "token");

      const response = await axios.post(`${api}/admin/site/edit`, body, {
        headers,
      });
      console.log(response.data, "response from api");
      router.push("/cheil/data/site");
    } catch (err) {
      setError("Error fetching site data");
    } finally {
      setLoading(false);
    }
  };

  const breadscrums = "Admin > site";
  const pagename = "Add New";

  return (
    <AddNewPageButtons
      pagename={pagename}
      email={email}
      breadscrums={breadscrums}
      handleSaveClick={handleSaveClick}
    >
      <div
        className="flex flex-col w-full p-4 min-h-screen gap-5"
        style={{ fontFamily: "SamsungOne, sans-serif" }}
      >
        <div className="flex flex-col bg-gray-200  rounded-md shadow">
          <div className="bg-white p-4 rounded-md shadow-md">
            <div className="grid grid-cols-4 gap-4 mb-4 items-center justify-center  flex-col">
              <TextField
                label="Enter Identifier"
                variant="standard"
                fullWidth
                name="identifier"
                value={formValues.identifier}
                onChange={handleInputChange}
              />
              <TextField
                label="Enter Description"
                variant="standard"
                fullWidth
                name="shortDescription"
                value={formValues.shortDescription}
                onChange={handleInputChange}
              />
              <TextField
                label="Affiliate ID"
                variant="standard"
                fullWidth
                name="affiliateId"
                value={formValues.affiliateId}
                onChange={handleInputChange}
              />
              <TextField
                label="Affiliate Name"
                variant="standard"
                fullWidth
                name="affiliateName"
                value={formValues.affiliateName}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-4 gap-4 mb-4 items-center justify-center  flex-col">
              <TextField
                label="Secret Key"
                variant="standard"
                fullWidth
                name="secretKey"
                value={formValues.secretKey}
                onChange={handleInputChange}
              />
              <TextField
                label="Site Channel"
                variant="standard"
                fullWidth
                name="siteChannel"
                value={formValues.siteChannel}
                onChange={handleInputChange}
              />

              <SingleSelectSubsidiary
                selectedSubsidiary={selectedSubsidiary}
                setSelectedSubsidiary={setSelectedSubsidiary}
              />
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-row gap-3 items-center w-full justify-end">
                {ButtonActive  ? (
                  <button
                  onClick={() => setButtonActive(!ButtonActive)}
                  className="bg-[#1581ed] border-2 border-solid border-gray-400 rounded-md text-white text-xs px-2 py-0.5 w-[80px] animate__animated animate__pulse"
                >
                  Active
                </button>
              ) : (
                <button
                  onClick={() => setButtonActive(!ButtonActive)}
                  className="bg-[#fff] border-2 border-solid border-[#1581ed] rounded-md text-gray-500 text-xs px-2 py-0.5 w-[80px] animate__animated animate__pulse"
                >
                  Inactive
                </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AddNewPageButtons>
  );
};

export default Addsite;
