"use client";
import React, { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import AddNewPageButtons from "@/app/src/components/AddNewPageButtons/AddNewPageButtons";
import { useRouter } from 'next/navigation';
import axios from "axios";
import { api } from "@/envfile/api";
import { getCookie } from "cookies-next";
import NodeDropdown from "@/app/src/components/dropdown/Node";

const AddInterface = () => {
  const [token, setToken] = useState("");
  const [selectedNode, setSelectedNode] = useState(null); // Store selected node
  const [email, setEmail] = useState('');
  const [ButtonActive, setButtonActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const [initialload, setInitialLoad] = useState(false);

  const [formValues, setFormValues] = useState({
    identifier: '',
    shortDescription: '',
    path: '',
    displayPriority: ''
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

  // Handle change for form inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };

  // Ensure `selectedNode` is used properly
  const handleSaveClick = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      
      // Ensure selectedNode has a valid `recordId`
      const parentNodeRecordId = selectedNode;
         
      console.log(selectedNode, "Selected node");


      if (!parentNodeRecordId) {
        console.error("No valid recordId found for parentNode");
        return;
      }

      const body = {
        nodes: [
          {
            identifier: formValues.identifier,
            shortDescription: formValues.shortDescription,
            path: formValues.path,
            parentNode: { recordId: parentNodeRecordId }, // Pass only the recordId
            displayPriority: formValues.displayPriority,
            status: ButtonActive,
          }
        ]
      };

      const response = await axios.post(`${api}/admin/interface/edit`, body, { headers });
      router.push("/cheil/admin/interface");
    } catch (err) {
      console.error(err, "Error occurred while saving");
      setError("Error saving interface data");
    } finally {
      setLoading(false);
    }
  };

  const breadscrums = "Admin > interface";
  const pagename = "Add New";

  return (
    <AddNewPageButtons pagename={pagename} email={email} breadscrums={breadscrums}
      handleSaveClick={handleSaveClick}>
      <div className="flex flex-col w-full p-4 min-h-screen gap-5">
        <div className="flex flex-col bg-gray-200 min-h-96 rounded-md ">
          <div className="bg-white p-4 rounded-md shadow-md">
            <div className="grid grid-cols-4 gap-2 mb-4">
              <TextField
                label="Enter Identifier"
                variant="standard"
                className="text-xs mt-1"
                name="identifier"
                value={formValues.identifier}
                onChange={handleInputChange}
              />
              <TextField
                label="Enter Description"
                variant="standard"
                className="text-xs mt-1"
                name="shortDescription"
                value={formValues.shortDescription}
                onChange={handleInputChange}
              />
              <TextField
                label="Enter Path"
                variant="standard"
                className="text-xs mt-1"
                name="path"
                value={formValues.path}
                onChange={handleInputChange}
              />

              <NodeDropdown initialload={initialload} selectedNode={selectedNode} setSelectedNode={setSelectedNode} /> 

              <TextField
                label="Display order"
                variant="standard"
                className="text-xs"
                type="number"
                name="displayPriority"
                value={formValues.displayPriority}
                onChange={handleInputChange}
              />
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex flex-row gap-3 items-center w-full justify-end">
                {ButtonActive ? (
                  <button
                    onClick={() => setButtonActive(!ButtonActive)}
                    className="bg-[#1581ed] border-2 border-solid border-gray-400 rounded-md text-white text-xs px-2 py-0.5 w-[80px]"
                  >
                    Active
                  </button>
                ) : (
                  <button
                    onClick={() => setButtonActive(!ButtonActive)}
                    className="bg-[#fff] border-2 border-solid border-[#1581ed] rounded-md text-gray-500 text-xs px-2 py-0.5 w-[80px]"
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

export default AddInterface;
