"use client";
import React, { useState,useEffect } from 'react';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { Autocomplete, TextField } from '@mui/material';
import AddNewPageButtons from '@/app/src/components/AddNewPageButtons/AddNewPageButtons';
import { useRouter } from 'next/navigation';
import axios from "axios";
import { getCookie } from "cookies-next";
import { api } from "@/envfile/api";

const AddDataRelation = () => {
  const [token, setToken] = useState("");
  const [ButtonActive, setButtonActive] = useState(false);
  const [EnableGenerator, setenableGenerator] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [selectedFormat, setSelectedFormat] = useState(''); // For the file format dropdown
  const [params, setParams] = useState([
  ]);
  

  const [formValues, setFormValues] = useState({
    identifier: '',
    shortDescription: '',

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
      // getfetchInputFields(jwtToken);
      getDataSourceData(jwtToken);
    }
  }, []);

  const handleAddParamClick = () => {
    setParams([...params, { fetchInputFields: [], selectedNode: "" }]);
  };
  
  

  const handleRemoveParamClick = (index) => {
    const newParams = params.filter((_, i) => i !== index);
    setParams(newParams);
  };

  const handleParamChange = (index, selectedValue) => {
    const newParams = [...params];
    newParams[index].selectedNode = selectedValue;
    setParams(newParams);
  };
  

  // Handle change for form inputs
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
  
      // Construct the dataRelationParams array by mapping over the params
      const dataRelationParams = params.map(param => ({
        sourceKeyOne: param.selectedNode,        // Use selectedNode as sourceKeyOne
        dataSource: param.selectedDataSource     // Use selectedDataSource as dataSource
      }));
  
      const body = {
        dataRelations: [{
          identifier: formValues.identifier,
          shortDescription: formValues.shortDescription,
          enableGenerator: EnableGenerator,
          status: ButtonActive, // Use button active status (true or false)
          dataRelationParams: dataRelationParams  // Pass the constructed dataRelationParams array
        }]
      };
  
      console.log(body, "req body from user");
      console.log(token, "token");
  
      const response = await axios.post(`${api}/admin/dataRelation/edit`, body, { headers });
      console.log(response.data, "response from api");
      router.push("/cheil/admin/dataRelation");
    } catch (err) {
      setError("Error fetching Datarelation data");
    } finally {
      setLoading(false);
    }
  };
  

  const handleRunClick = () => {
    alert("Run function executed from AddDataRelation!");
  };

  const breadscrums = "Admin > DataRelation"
  const pagename = "Add New"

  const inputFields =[
    {
      value:'Input Box',
      label:'Input Box'
    },
  
    {
      value:'Dropdown',
      label:'Dropdown '
    },
    {
      value:'Formular',
      label:'Formular '
    },
    {
      value:'Site Loader',
      label:'Site Loader '
    },
    {
      value:'Data and Time selector',
      label:'Data and Time selector'
    },
  
   ];



   const [selectedDataSource, setSelectedDataSource] = useState('');
   console.log(selectedDataSource," l ");
   const [dataSourceList, setDataSourceList] = useState([]);

   const getDataSourceData = async (jwtToken) => {
    try {
      const headers = { Authorization: "Bearer " + jwtToken };
      const response = await axios.get(api + "/admin/datasource/get", {
        headers,
      });
      setDataSourceList(response.data.dataSources); // Update the local node list statemonisha
      console.log(response.data.dataSources);
    } catch (error) {
      console.log(error, "Error fetching nodes");
    }
  };
//   const [fetchInputFields, setFetchInputFields] = useState([]);
//   const getfetchInputFields = async (value) => {
//    try {
//      const headers = { Authorization: "Bearer " + token };
//      const body = {
//        recordId: value,
//      };
//      const response = await axios.post(api + "/admin/dataRelation/getDatasourceParamsForId",body, {
//        headers,
//      });
//      setFetchInputFields(response.data.params);
//      console.log(response.data, "dataSources dataSources fetched");
//    } catch (error) {
//      console.log("Error fetching environments", error);
//    }
//  };


  // const [dataSourceParams, setdataSourceParams] = useState([]);
  const handleDatasourceChange = async (index, value) => {
    const updatedParams = [...params];
    updatedParams[index].selectedDataSource = value; // Update specific param's selectedDataSource
  
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const body = { recordId: value };
      const response = await axios.post(`${api}/admin/dataRelation/getDatasourceParamsForId`, body, { headers });
  
      updatedParams[index].fetchInputFields = response.data.params; // Set fetched input fields for this param
    } catch (error) {
      console.log("Error fetching input fields", error);
    }
  
    setParams(updatedParams); // Update the state with the modified params
  };
  
  
  
  return (
    <AddNewPageButtons pagename={pagename} email={email} breadscrums={breadscrums}
    handleSaveClick={handleSaveClick}>
      <div className="flex flex-col w-full p-3 min-h-screen gap-5" style={{ fontFamily: 'SamsungOne, sans-serif' }}>


        <div className='flex flex-col bg-gray-200 rounded-md shadow'>



          <div className="bg-white p-4 rounded-md shadow-md">
            <div className="grid grid-cols-3 gap-5 mb-4">

              <TextField label="Enter Identifier" variant="standard" fullWidth 
              className='text-xs w-full'
              name="identifier"
              value={formValues.identifier}
              onChange={handleInputChange}/>
              <TextField label="Description" variant="standard" fullWidth 
              className='text-xs w-full'
              name="shortDescription"
              value={formValues.shortDescription}
              onChange={handleInputChange}/>
              <div className="flex flex-row gap-6 justify-end items-end">
              <div>
                {EnableGenerator ? (
                  <button
                    onClick={() => setenableGenerator(!EnableGenerator)}
                    className="bg-[#1581ed] border-2 border-solid border-[#1581ed] rounded-md text-white text-xs px-2 py-0.5 w-[80px] animate__animated  animate__pulse"
                  >
                    Generator
                  </button >
                ) : (
                  <button
                    onClick={() => setenableGenerator(!EnableGenerator)}
                    className="bg-[#fff] border-2 border-solid border-gray-400 rounded-md text-gray-500 text-xs px-2 py-0.5 w-[80px] animate__animated  animate__pulse"
                  >
                    Generator
                  </button>
                )}
              </div>

              <div>
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
        <div className="grid grid-cols-1 gap-4">
  {params.map((param, index) => (
    <div key={index} className="flex items-center gap-5 p-4 w-full">
     <Autocomplete
  className="text-xs w-full"
  style={{ marginTop: "2.5vh" }}
  options={dataSourceList || []} // Options list from dataSourceList
  getOptionLabel={(option) => option.identifier || ""} // Display identifier
  value={
    dataSourceList.find((option) => option.recordId === param.selectedDataSource) || null // Find the selected dataSource
  }
  onChange={(event, newValue) => {
    handleDatasourceChange(index, newValue?.recordId || ""); // Pass index and update dataSource
  }}
  isOptionEqualToValue={(option, value) => option.recordId === value?.recordId} // Compare by recordId
  renderInput={(params) => (
    <TextField 
      {...params}
      label="Please Select the DataSource"
      variant="standard"
    /> 
  )}
/>



      {/* Display fetchInputFields for the selected DataSource */}
      <Autocomplete
  className="text-xs w-[80%] mt-5"
  options={param.fetchInputFields || []} // Options list from fetchInputFields
  getOptionLabel={(option) => option || ""} // Display the option itself
  value={param.selectedNode || null} // Use param.selectedNode for value
  onChange={(event, newValue) => handleParamChange(index, newValue || "")} // Pass the index and new value
  renderInput={(params) => (
    <TextField
      {...params}
      label="Select Params" // Label for the Autocomplete
      variant="standard"
    />
  )}
/>


      <button
        className="flex items-center justify-center p-2 rounded-md bg-red-600 text-white w-[30px]"
        onClick={() => handleRemoveParamClick(index)}
      >
        <FaMinus />
      </button>
    </div>
  ))}
</div>

          <button
            className="flex items-center justify-center mt-4 p-2 rounded-md bg-black text-white w-[150px] h-[40px]"
            onClick={handleAddParamClick}

          >
            Add an input field
          </button>
        </div>
      </div>
    </AddNewPageButtons>
  );
};

export default AddDataRelation;
