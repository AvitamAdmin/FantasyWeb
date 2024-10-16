"use client";
import React, { useState, useEffect } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { TextField } from "@mui/material";
import AddNewPageButtons from "@/app/src/components/AddNewPageButtons/AddNewPageButtons";
import axios from "axios";
import { api } from "@/envfile/api";
import { getCookie } from "cookies-next";
import { useRouter } from 'next/navigation';
import SingleSelectSubsidiary from "@/app/src/components/dropdown/Subsidiary";

const AddProfile = () => {
  const [params, setParams] = useState([]);
  const [nodes, setNode] = useState([]);
  const [ButtonActive, setButtonActive] = useState(false);
  const router = useRouter();
  const [token, setToken] = useState("");
  const [initialload, setInitialLoad] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSubsidiary, setSelectedSubsidiary] = useState([]);


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
        testProfiles: [{
          identifier: formValues.identifier,
          shortDescription: formValues.shortDescription,
          subsidiary: selectedSubsidiary,
          status: ButtonActive, // Use button active status (true or false)
        }]
      };

      console.log(body, "req body from user");
      console.log(token, "token");

      const response = await axios.post(`${api}/admin/profile/edit`, body, { headers });
      console.log(response.data, "response from api");
      router.push("/cheil/admin/profile");
    } catch (err) {
      setError("Error fetching profile data");
    } finally {
      setLoading(false);
    }
  };



  const breadscrums = "Admin > profile"
  const pagename = "Add New"
  const handleFieldInputChange = (index, field, value) => {
    const updatedInputs = [...siteInputs];
    updatedInputs[index][field] = value; // Update the specific field for the given site
    setSiteInputs(updatedInputs);
  };
  return (
    <AddNewPageButtons pagename={pagename}
      email={email}
      breadscrums={breadscrums}
      handleSaveClick={handleSaveClick}>
      <div
        className="flex flex-col w-full p-4 min-h-screen gap-5"
        style={{ fontFamily: "SamsungOne, sans-serif" }}
      >
        <div className="flex flex-col bg-gray-200  rounded-md shadow">
          <div className="bg-white p-4 rounded-md shadow-md">
            <div className="grid grid-cols-3 gap-2 mb-4">

              <TextField
                label=" Enter Identifier"
                variant="standard"
                className="text-xs"
                name="identifier"
                value={formValues.identifier}
                onChange={handleInputChange}
              />
              <TextField
                label="Enter Description"
                variant="standard"
                className="text-xs"
                name="shortDescription"
                value={formValues.shortDescription}
                onChange={handleInputChange}
              />

              <SingleSelectSubsidiary  initialload={initialload} selectedSubsidiary={selectedSubsidiary} setSelectedSubsidiary={setSelectedSubsidiary} />



            </div>

            <div className="flex flex-col gap-3">

              <div className="flex flex-row gap-3 items-center w-full justify-end">
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
        <div  className="w-full flex bg-white rounded-md flex-row justify-between gap-5 p-2 items-center">
        
        {/* Xpath Input */}
        <TextField
        
          placeholder="Identifier"
          variant="standard"
          className="text-xs w-[20%]"
          fullWidth
          // value={siteInputs[index]?.xpath || ''} // Bind the specific input value
          // onChange={(e) => handleFieldInputChange(index, 'xpath', e.target.value)} // Update the specific input field
        />
        
        {/* CSS Input */}
        <TextField
          placeholder="Short Description"
          variant="standard"
          className="text-xs w-[20%]"
          fullWidth
         
        />

        {/* ID Input */}
        <TextField
          placeholder="Data Type"
          variant="standard"
          className="text-xs w-[20%]"
          fullWidth
         
        />

        {/* Other Input */}
        <TextField
          placeholder="Input Value"
          variant="standard"
          className="text-xs w-[20%]"
          fullWidth
           />

        
      </div>



      </div>
    </AddNewPageButtons>
  );
};

export default AddProfile;
