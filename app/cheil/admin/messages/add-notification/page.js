"use client";
import React, { useState, useEffect } from 'react';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { TextField } from '@mui/material';
import AddNewPageButtons from '@/app/src/components/AddNewPageButtons/AddNewPageButtons';
import axios from "axios";
import { api } from "@/envfile/api";
import { getCookie } from "cookies-next";
import TestPlan from "@/app/src/components/dropdown/TestPlan";
import { useRouter } from 'next/navigation';

const AddNotification = () => {
  const [params, setParams] = useState([]);
  const [ButtonActive, setButtonActive] = useState(false)
  const [token, setToken] = useState("");
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [testPlan, setTestPlan] = useState([]);
  const [selectedTestPlan, setSelectedTestPlan] = useState("");
  const router = useRouter();

  useEffect(() => {
    const storedEmail = localStorage.getItem("username");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);
  const [formValues, setFormValues] = useState({
    identifier: '',
    shortDescription: '',
    type: '',
    percentFailure: '',  
    recipients: '',       
  });

  useEffect(() => {
    const jwtToken = getCookie("jwtToken");
    if (jwtToken) {
      setToken(jwtToken);

    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value, 
    }));
  };


  const handleSaveClick = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const body = {
        messageResources:[ {
          identifier: formValues.identifier,
          shortDescription: formValues.shortDescription,
          testPlanId: testPlan,
          type:formValues.type,
          percentFailure:formValues.percentFailure,
          recipients:formValues.recipients,
          status: ButtonActive, // Use button active status (true or false)
        }]
      };

      console.log(body, "req body from user");
      console.log(token, "token");

      const response = await axios.post(`${api}/admin/messages/edit`, body, { headers });
      console.log(response.data, "response from api");
      router.push("/cheil/admin/messages");
    } catch (err) {
      setError("Error fetching messages data");
    } finally {
      setLoading(false);
    }
  };



  const breadscrums = "Admin > messages"
  const pagename = "Add New"


  return (
    <AddNewPageButtons pagename={pagename} email={email} breadscrums={breadscrums}
      handleSaveClick={handleSaveClick} >
      <div className="flex flex-col w-full p-4 min-h-screen gap-5" style={{ fontFamily: 'SamsungOne, sans-serif' }}>


        <div className='flex flex-col bg-gray-200  rounded-md shadow'>


          <div className="bg-white p-4 rounded-md shadow-md">
            <div className="grid grid-cols-3 gap-4 mb-4">

              <TextField
                label="Enter identification "
                variant="standard"
                className='text-xs'
                name="identifier"
                value={formValues.identifier}
                onChange={handleInputChange}
              />

              <TextField
                label="Enter Description"
                variant="standard"
                className='text-xs'
                name="shortDescription"
                value={formValues.shortDescription}
                onChange={handleInputChange}
              />

             <div className='mb-0.5'>
             <TestPlan
                setTestPlan={setTestPlan}
                testPlan={testPlan}
              />
             </div>

            </div>

            <div className='flex flex-col gap-3'>
            <div className='grid grid-cols-3 gap-4 mb-4'>
            <TextField
              label="Enter the channel type"
              variant="standard"
              className='text-xs'
              name='type' // Change this to match the state property
              value={formValues.type}
              onChange={handleInputChange}
            />
            <TextField
              label="Enter failure condition value"
              variant="standard"
              className='text-xs'
              name='percentFailure' // Add name attribute
              value={formValues.percentFailure} // Ensure value corresponds to state
              onChange={handleInputChange}
              inputProps={{
                inputMode: 'numeric', // Provides a numeric keyboard for mobile devices
                pattern: '[0-9]*'     // Ensures only digits are allowed
              }}
            />
            <TextField
              label="Enter the recipients"
              variant="standard"
              className='text-xs'
              name='recipients' // Add name attribute
              value={formValues.recipients} // Ensure value corresponds to state
              onChange={handleInputChange}
            />
          </div>

              <div className="flex gap-4 items-center w-[100%] justify-end">
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
                  style={{ width: '40px', height: '40px' }}
                >
                  <FaMinus />
                </button>
              </div>
            ))}
          </div>
          {/* <button
       className="flex items-center justify-center mt-4 p-2 rounded-md bg-black text-white"
       onClick={handleAddParamClick}
       style={{ width: '100px', height: '40px' }}
     >
       Add Param
     </button> */}
        </div>
        {/* <div>
   <button
   className="flex items-center justify-center p-2 rounded-md bg-black text-white"   
   >
   Add an input Field
   </button>
   </div> */}
      </div>
    </AddNewPageButtons>
  );
};

export default AddNotification;
