"use client";
import React, { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import AddNewPageButtons from "@/app/src/components/AddNewPageButtons/AddNewPageButtons";
import axios from "axios";
import { api } from "@/envfile/api";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";

const CronjobProfile = () => {
  const [params, setParams] = useState([]);
  const [ButtonActive, setButtonActive] = useState(false);
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
  const [formValues, setFormValues] = useState({
    identifier: "",
    recipients: "",
  });

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
        cronJobProfiles: [
          {
            identifier: formValues.identifier,
            recipients: formValues.recipients,
            status: ButtonActive, // Use button active status (true or false)
          },
        ],
      };

      console.log(body, "req body from user");
      console.log(token, "token");

      const response = await axios.post(
        `${api}/admin/cronjobProfile/edit`,
        body,
        { headers }
      );
      console.log(response.data, "response from api");
      router.push("/cheil/admin/cronjobProfile");
    } catch (err) {
      setError("Error fetching cronjobProfile data");
    } finally {
      setLoading(false);
    }
  };

  const breadscrums = "Admin > cronjobProfile";
  const pagename = "Add New";

  return (
    <AddNewPageButtons
      pagename={pagename}
      email={email}
      breadscrums={breadscrums}
      handleSaveClick={handleSaveClick}
    >
      <div
        className="flex flex-col w-full  min-h-screen gap-5"
        style={{ fontFamily: "SamsungOne, sans-serif" }}
      >
        <div className="bg-gray-200 flex flex-col pb-5 rounded-md">
          <div className="  w-[100%] flex items-center flex-row justify-center ">
            <div className="bg-white  w-[98%] rounded-md shadow-md flex flex-col justify-center gap-2 pb-4">
              <div className=" w-full flex flex-row justisy-between gap-10 p-2 items-center "></div>

              <div className=" w-full flex flex-row   p-2">
                <TextField
                  fullWidth
                  label="Enter Identifier"
                  id="fullWidth"
                  size="small"
                  name="identifier"
                  value={formValues.identifier}
                  onChange={handleInputChange}
                />
              </div>

              <div className="p-2 flex flex-row gap-3 w-full">
                <div className="flex flex-col gap-2 w-full">
                  <div className="font-bold">Input Recipients</div>
                  <div className="flex flex-row gap-7 items-center">
                    <textarea
                      className="w-[100%] h-32 border-solid border-2 border-gray-300 rounded-md"
                      name="recipients"
                      value={formValues.recipients}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-row w-full justify-end pr-2">
                {ButtonActive ? (
                  <button
                    onClick={() => setButtonActive(ButtonActive)}
                    className="bg-[#fff] border-2 border-solid border-gray-400 rounded-md text-gray-500 text-xs px-2 py-0.5 w-[80px] animate__animated  animate__pulse"
                  >
                    Inactive
                  </button>
                ) : (
                  <button
                    onClick={() => setButtonActive(!ButtonActive)}
                    className="bg-[#1581ed] border-2 border-solid border-[#1581ed] rounded-md text-white text-xs px-2 py-0.5 w-[80px] animate__animated  animate__pulse"
                  >
                    Active
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

export default CronjobProfile;
