"use client";
import React, { useState, useEffect } from 'react';
import { FaMinus } from 'react-icons/fa';
import { TextField } from '@mui/material';
import AddNewPageButtons from '@/app/src/components/AddNewPageButtons/AddNewPageButtons';
import SelectCategory from "@/app/src/components/dropdown/Category";
import Models from "@/app/src/components/dropdown/Models";
import { useRouter } from 'next/navigation';
import axios from "axios";
import { api } from "@/envfile/api";
import { getCookie } from "cookies-next";
import SingleSelectSubsidiary from '@/app/src/components/dropdown/Subsidiary';

const Addvariant = () => {

    const [ButtonActive, setButtonActive] = useState(false);
    const [selectedSubsidiary, setSelectedSubsidiary] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedModel, setSelectedModel] = useState("");
    const [token, setToken] = useState("");
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedPageType, setSelectedPageType] = useState("");
    const [error, setError] = useState(null);
    const router = useRouter();

    const [formValues, setFormValues] = useState({
        identifier: '',
        shortDescription: '',
        externalProductUrl: '',
    });
    useEffect(() => {
        const storedEmail = localStorage.getItem('username');
        if (storedEmail) {
          setEmail(storedEmail);
        }
      }, []);

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

    const handlePageTypeChange = (e) => {
        const value = e.target.value;
        setSelectedPageType(value);
    };

    const handleSaveClick = async () => {
        try {
            const headers = { Authorization: `Bearer ${token}` };
            const body = {
                variants: [{
                    identifier: formValues.identifier,
                    shortDescription: formValues.shortDescription,
                    externalProductUrl: formValues.externalProductUrl,
                    category: {recordId: selectedCategory},
                   subsidiaries: selectedSubsidiary ? [selectedSubsidiary] : [],
                    model:{recordId: selectedModel} ,
                    pageType: selectedPageType,
                    status: ButtonActive, 
                }]
            };

            console.log(body, "req body from user");
            console.log(token, "token");

            const response = await axios.post(`${api}/admin/variant/edit`, body, { headers });
            console.log(response.data, "response from api");
            router.push("/cheil/data/variant");
        } catch (err) {
            setError("Error fetching variant data");
        } finally {
            setLoading(false);
        }
    };



    const breadscrums = "Admin > variant"
    const pagename = "Add New"

    const page = [
        {
            value: 'Select Page type',
            label: 'Select Page type',
        },
        {
            value: 'BC',
            label: 'BC',
        },
        {
            value: 'PD',
            label: 'PD',
        },

    ];

    return (
        <AddNewPageButtons pagename={pagename} email={email} breadscrums={breadscrums}
            handleSaveClick={handleSaveClick}>
            <div className="flex flex-col w-full p-4 min-h-screen gap-5" style={{ fontFamily: 'SamsungOne, sans-serif' }}>


                <div className='flex flex-col bg-gray-200  rounded-md shadow'>



                    <div className="bg-white p-4 rounded-md shadow-md">
                        <div className="grid grid-cols-3 gap-4 mb-4 items-center justify-center flex flex-col">

                            <TextField
                                label="Enter Identifier"
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

                            <SingleSelectSubsidiary
                            setSelectedSubsidiary={setSelectedSubsidiary}
                            selectedSubsidiary={selectedSubsidiary}
                          />


                        </div>

                        <div className="grid grid-cols-3 gap-2 mb-4 items-center justify-center flex flex-col">

                            <TextField
                                label="External ProductURL"
                                variant="standard" fullWidth
                                name="externalProductUrl"
                                value={formValues.externalProductUrl}
                                onChange={handleInputChange}
                            />


                            <SelectCategory selectedCategory={selectedCategory} setCategory={setSelectedCategory} />


                            <Models selectedModel={selectedModel} setModel={setSelectedModel} />


                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-4 items-center justify-center flex flex-col">

                            <TextField style={{ marginTop: '2.5vh' }}

                                className='text-xs w-[80%]'
                                select
                                defaultValue="Select Page type "
                                SelectProps={{
                                    native: true,
                                }}
                                variant="standard"
                                name="pageType"
                                value={formValues.pageType}
                                onChange={handlePageTypeChange}
                            >
                                {page.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </TextField>
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

            </div>
        </AddNewPageButtons>
    );
};

export default Addvariant;
