"use client";
import React, { useState, useEffect } from 'react';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { TextField } from '@mui/material';
import AddNewPageButtons from '@/app/src/components/AddNewPageButtons/AddNewPageButtons';
import SelectCategory from "@/app/src/components/dropdown/Category";
import { useRouter } from 'next/navigation';
import axios from "axios";
import { api } from "@/envfile/api";
import { getCookie } from "cookies-next";
import SingleSelectSubsidiary from '@/app/src/components/dropdown/Subsidiary';

const Addmodel = () => {
    const [params, setParams] = useState([]);
    const [ButtonActive, setButtonActive] = useState(false);
    const [selectedSubsidiary, setSelectedSubsidiary] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState([]);
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
    useEffect(() => {
        const storedEmail = localStorage.getItem('username');
        if (storedEmail) {
          setEmail(storedEmail);
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
        console.log("Save button clicked"); // Add this log
        try {
            setLoading(true); // Set loading state here
            const headers = { Authorization: `Bearer ${token}` };
            const body = {
                models: [{
                    identifier: formValues.identifier,
                    shortDescription: formValues.shortDescription,
                    categories: selectedCategory.recordId,
                    subsidiaries: selectedSubsidiary ? [selectedSubsidiary] : [],
                    status: ButtonActive, // Use button active status (true or false)
                }]
            };
    
            console.log(body, "req body from user");
            console.log(token, "token");
    
            const response = await axios.post(`${api}/admin/model/edit`, body, { headers });
            console.log(response.data, "response from api"); 
            router.push("/cheil/data/model");
        } catch (err) {
            setError("Error saving model data");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    


    const breadscrums = "Admin > model"
    const pagename = "Add New"





    return (
        <AddNewPageButtons pagename={pagename} email={email} breadscrums={breadscrums}
            handleSaveClick={handleSaveClick}>
            <div className="flex flex-col w-full p-4 min-h-screen gap-5" style={{ fontFamily: 'SamsungOne, sans-serif' }}>



                <div className='flex flex-col bg-gray-200 p-2 rounded-md shadow'>




                    <div className="bg-white p-4 rounded-md shadow-md">
                        <div className="grid grid-cols-4 gap-4 mb-4 items-center justify-center  flex-col">

                            <TextField 
                            label="Model Id" 
                            variant="standard" fullWidth
                            name="identifier"
                            value={formValues.identifier}
                            onChange={handleInputChange}
                            
                            />
                            <TextField
                             label="Short Description" 
                             variant="standard" fullWidth 
                             name="shortDescription"
                             value={formValues.shortDescription}
                             onChange={handleInputChange}
                             />
                            <SingleSelectSubsidiary selectedSubsidiary={selectedSubsidiary} setSelectedSubsidiary={setSelectedSubsidiary} />

                            <SelectCategory selectedCategory={selectedCategory} setCategory={setSelectedCategory} />

                        </div>





                        <div className='flex flex-col gap-4'>


                        <div className="flex flex-row gap-3 items-center w-full justify-end">
                        {ButtonActive == true ? (
                          <button
                            onClick={() => setButtonActive(!ButtonActive)}
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

                <div className="flex flex-col mt-4 w-[100%]">
                    <div className="grid grid-cols-2 gap-4">
                        {params.map((param, index) => (
                            <div key={index} className="flex items-center gap-5 p-4">
                                <TextField

                                    className='text-xs w-[80%]'
                                    select
                                    defaultValue="Select node "
                                    SelectProps={{
                                        native: true,
                                    }}
                                    variant="standard"
                                >
                                    {currencies.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </TextField>

                                <button
                                    className="flex items-center justify-center p-2 rounded-md bg-red-600 text-white  w-[30px]"
                                    onClick={() => handleRemoveParamClick(index)}

                                >
                                    <FaMinus />
                                </button>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </AddNewPageButtons>
    );
};

export default Addmodel;
