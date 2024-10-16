"use client";
import React, { useState, useEffect } from "react";
import {
  TextField,
} from "@mui/material";
import 'animate.css';
import AddNewPageButtons from "@/app/src/components/AddNewPageButtons/AddNewPageButtons";
import TestDataTypes from "@/app/src/components/dropdown/TestDataTypes";
import { useRouter } from 'next/navigation';
import axios from "axios";
import { api } from "@/envfile/api";
import { getCookie } from "cookies-next";
import SingleSelectSubsidiary from "@/app/src/components/dropdown/Subsidiary";


const addTestDataSubtype = () => {
 
  const [ButtonActive, setButtonActive] = useState(false);
  const [selectedSubsidiary, setSelectedSubsidiary] = useState([]);
  const [selectedTestDataTypes, setSelectedTestDataTypes] = useState("");
  const [token, setToken] = useState("");
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();


  const [formValues, setFormValues] = useState({
    identifier: '',
    shortDescription: '',
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
      [name]: value
    });
  };

  const handleSaveClick = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const body = {
        testDataSubtypes: [{
          identifier: formValues.identifier,
          shortDescription: formValues.shortDescription,
          subsidiaries: selectedSubsidiary ? [selectedSubsidiary] : [],
          testDataType: selectedTestDataTypes,
          status: ButtonActive, // Use button active status (true or false)
        }]
      };

      console.log(body, "req body from user");
      console.log(token, "token");

      const response = await axios.post(`${api}/admin/testdatasubtype/edit`, body, { headers });
      console.log(response.data, "response from api");
      router.push("/cheil/admin/testdatasubtype");
    } catch (err) {
      setError("Error fetching testdatasubtype data");
    } finally {
      setLoading(false);
    }
  };



  const breadscrums = "Admin > testdatasubtype"
  const pagename = "Add New"

  return (
    <AddNewPageButtons pagename={pagename} email={email} breadscrums={breadscrums}
      handleSaveClick={handleSaveClick} >
      <div
        className="flex flex-col w-full p-1 min-h-screen gap-5"
        style={{ fontFamily: "SamsungOne, sans-serif" }}
      >


        <div className="bg-gray-200 flex flex-col pb-5 rounded-md">


          <div className="  w-[100%] flex items-center flex-row justify-center ">
            <div className="bg-white gap-5 w-[98%] rounded-md shadow-md flex flex-col justify-center gap-3 pb-4 p-2">
              <div className="flex flex-col gap-4 rounded-lg bg-white border-solid border-2 border-white w-full">
                <div className="flex flex-row justify-between grid grid-cols-3 gap-3">

                  <TextField
                    id="standard-textarea"
                    label="Enter Identifier"
                    placeholder="Placeholder"
                    multiline
                    variant="standard"
                    className='mt-3'
                    name="identifier"
                    value={formValues.identifier}
                    onChange={handleInputChange}
                  />

                  <TextField
                    id="standard-textarea"
                    label="Description"
                    placeholder="Placeholder"
                    multiline
                    variant="standard"
                    className='mt-3'
                    name="shortDescription"
                    value={formValues.shortDescription}
                    onChange={handleInputChange}
                  />
                  <SingleSelectSubsidiary selectedSubsidiary={selectedSubsidiary} setSelectedSubsidiary={setSelectedSubsidiary} />

                </div>
              </div>

              <div className="flex flex-row w-[100%] text-sm ">
                <div className="flex flex-col gap-5 w-full">
                  <div className="flex flex-row gap-5 ">
                    <div className="w-[35%]">

                      <TestDataTypes
                        selectedTestDataTypes={selectedTestDataTypes}
                        setSelectedTestDataTypes={setSelectedTestDataTypes}

                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex flex-row gap-3 items-center">
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


                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AddNewPageButtons>
  );
};

export default addTestDataSubtype;
