"use client";
import React, { useState, useEffect } from 'react';
import { FaMinus, } from 'react-icons/fa';
import { TextField } from '@mui/material';
import axios from "axios";
import { api } from "@/envfile/api";
import { getCookie } from "cookies-next";
import { useRouter } from 'next/navigation';
import AddNewPageButtons from '@/app/src/components/AddNewPageButtons/AddNewPageButtons';
import SelectTestLocatorGroup from '@/app/src/components/dropdown/TestLocatorGroup';
import SingleSelectSubsidiary from '@/app/src/components/dropdown/Subsidiary';

const AddQagroup = () => {
    const [params, setParams] = useState([]);
    const [selectedSubsidiary, setSelectedSubsidiary] = useState([]);
    const [ButtonActive, setButtonActive] = useState(false);
    const [token, setToken] = useState("");
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedTestLocatorGroup, setSelectedTestLocatorGroup] = useState([]);
    const router= useRouter();

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

    const handleAddParamClick = () => {
        setParams([...params, '']);
    };

    const handleRemoveParamClick = (index) => {
        const newParams = params.filter((_, i) => i !== index);
        setParams(newParams);
    };

    const handleParamChange = (index, value) => {
        const newParams = [...params];
        newParams[index] = value;
        setParams(newParams);
    };

    const handleSaveClick = async () => {
        try {
            const headers = { Authorization: `Bearer ${token}` };
            const body = {
                testPlans: [{
                    identifier: formValues.identifier,
                    shortDescription: formValues.shortDescription,
                    subsidiary: selectedSubsidiary,
                    testLocatorGroups: [selectedTestLocatorGroup],
                    status: ButtonActive, // Use button active status (true or false)
                }]
            };

            console.log(body, "req body from user");
            console.log(token, "token");

            const response = await axios.post(`${api}/admin/qa/edit`, body, { headers });
            console.log(response.data.testPlans, "response from api");
            router.push("/cheil/admin/qa");
        } catch (err) {
            setError("Error fetching qa data");
        } finally {
            setLoading(false);
        }
    };



    const breadscrums = "Admin > qa"
    const pagename = "Add New"


    return (
        <AddNewPageButtons pagename={pagename} email={email} breadscrums={breadscrums}
            handleSaveClick={handleSaveClick} >
            <div className="flex flex-col w-full p-3 min-h-screen gap-5" style={{ fontFamily: 'SamsungOne, sans-serif' }}>


                <div className='flex flex-col bg-gray-200 rounded-md shadow'>



                    <div className="bg-white p-4 rounded-md shadow-md">
                        <div className="grid grid-cols-3 gap-4 mb-4">

                            <TextField label="Enter Identifier"
                                variant="standard" fullWidth
                                className='mt-3'
                                name="identifier"
                                value={formValues.identifier}
                                onChange={handleInputChange}
                            />
                            <TextField label="Description"
                                variant="standard"
                                fullWidth className='mt-3'
                                name="shortDescription"
                                value={formValues.shortDescription}
                                onChange={handleInputChange}
                            />

                            <div className='mt-4'>
                            <SingleSelectSubsidiary selectedSubsidiary={selectedSubsidiary} setSelectedSubsidiary={setSelectedSubsidiary} />
                            </div>

                        </div>

                        <div className='flex flex-col gap-4'>
                            <div className='w-45%'>

                                <SelectTestLocatorGroup setSelectedTestLocatorGroup={setSelectedTestLocatorGroup} selectedTestLocatorGroup={selectedTestLocatorGroup}/>
                            </div>

                            <div className="flex gap-4 items-center w-[100%] justify-end">
                                <div className="flex flex-row gap-3 items-center">

                                    {ButtonActive ? (
                                        <button
                                            onClick={() => setButtonActive(!ButtonActive)}
                                            className="bg-[#1581ed] border-2 border-solid border-[#1581ed] rounded-md text-white text-xs px-2 py-0.5 w-[80px] animate__animated  animate__pulse"
                                        >
                                            Active
                                        </button>
                                    ) :  (
                                        <button
                                            onClick={() => setButtonActive(!ButtonActive)}
                                            className="bg-[#fff] border-2 border-solid border-gray-400 rounded-md text-gray-500 text-xs px-2 py-0.5 w-[80px] animate__animated  animate__pulse"
                                        >
                                            Inactive
                                        </button>
                                    ) }
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

                </div>
            </div>
        </AddNewPageButtons>
    );
};

export default AddQagroup;
