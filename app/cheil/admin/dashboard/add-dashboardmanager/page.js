"use client";
import React, { useState, useEffect } from 'react';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { TextField } from '@mui/material';
import AddNewPageButtons from '@/app/src/components/AddNewPageButtons/AddNewPageButtons';
import NodeDropdown from "@/app/src/components/dropdown/Node";
import DashboardProfile from "@/app/src/components/dropdown/DashboardProfile";
import { useRouter } from "next/navigation";
import axios from "axios";
import { api } from "@/envfile/api";
import { getCookie } from "cookies-next";
import SingleSelectSubsidiary from '@/app/src/components/dropdown/Subsidiary';
import { SketchPicker } from 'react-color';

const AddDashboard = () => {
  const [params, setParams] = useState([]);
  const [selectedSubsidiary, setSelectedSubsidiary] = useState([]);
  const [ButtonActive, setButtonActive] = useState(false);
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedDashboardProfile, setSelectedDashboardProfile] = useState([]);
  

  const [formValues, setFormValues] = useState({
    identifier: '',
    themeColor: '#ffffff', // Default color to white
    template: '',
  });

  const [displayColorPicker, setDisplayColorPicker] = useState(false); // Add state for color picker display

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

  const handleColorChange = (color) => {
    setFormValues({
      ...formValues,
      themeColor: color.hex // Update themeColor with the selected color
    });
  };

  const handleSaveClick = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const body = {
        dashboards: [{
          identifier: formValues.identifier,
          themeColor: formValues.themeColor,
          template: formValues.template,
          subsidiary: selectedSubsidiary[0],
          node: selectedNode,
          dashboardProfile: selectedDashboardProfile,
          status: ButtonActive, // Use button active status (true or false)
        }]
      };

      console.log(body, "req body from user");
      console.log(token, "token");

      const response = await axios.post(`${api}/admin/dashboard/edit`, body, { headers });
      console.log(response.data, "response from api");
      router.push("/cheil/admin/dashboard");
    } catch (err) {
      setError("Error fetching dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const breadscrums = "Admin > dashboard";
  const pagename = "Add New";

  return (
    <AddNewPageButtons
      pagename={pagename}
      email={email}
      breadscrums={breadscrums}
      handleSaveClick={handleSaveClick}
    >
      <div className="flex flex-col w-full p-4 min-h-screen gap-5" style={{ fontFamily: 'SamsungOne, sans-serif' }}>
        <div className='flex flex-col bg-gray-200  rounded-md shadow'>
          <div className="bg-white p-4 rounded-md shadow-md">
            <div className="grid grid-cols-4 gap-4 mb-4">
              <TextField
                label="Enter identifier "
                variant="standard"
                className='text-xs'
                name="identifier"
                value={formValues.identifier}
                onChange={handleInputChange}
              />

              <NodeDropdown
                setSelectedNode={setSelectedNode}
                selectedNode={selectedNode}
                className="w-[45%] "
              />

              <div>
                <TextField
                  label="themeColor"
                  variant="standard"
                  className='text-xs'
                  name="themeColor"
                  value="" // Leave value empty to avoid showing the color code
                  onClick={() => setDisplayColorPicker(!displayColorPicker)} // Toggle color picker on click
                  InputProps={{
                    style: {
                      backgroundColor: formValues.themeColor, 
                      height: '40px' 
                    }
                  }}
                  readOnly
                />
                {displayColorPicker ? (
                  <div style={{ position: 'absolute', zIndex: '2' }}>
                    <div style={{ position: 'fixed', top: '0px', right: '0px', bottom: '0px', left: '0px' }} onClick={() => setDisplayColorPicker(false)} />
                    <SketchPicker color={formValues.themeColor} onChange={handleColorChange} />
                  </div>
                ) : null}
              </div>

              <TextField
                label="Enter Template"
                variant="standard"
                className='text-xs'
                name="template"
                value={formValues.template}
                onChange={handleInputChange}
              />
            </div>

            <div className='flex flex-col gap-3'>
              <div className='grid grid-cols-4 gap-4 mb-4'>
                <DashboardProfile selectedDashboardProfile={selectedDashboardProfile} setSelectedDashboardProfile={setSelectedDashboardProfile} />
                <SingleSelectSubsidiary selectedSubsidiary={selectedSubsidiary} setSelectedSubsidiary={setSelectedSubsidiary} />
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
        </div>
      </div>
    </AddNewPageButtons>
  );
};

export default AddDashboard;
