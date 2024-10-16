"use client";
import React, { useEffect, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { TextField } from "@mui/material";
import { TbClockEdit, TbClockPlus } from "react-icons/tb";
import Link from "next/link";
import AddNewPageButtons from "@/app/src/components/AddNewPageButtons/AddNewPageButtons";
import NodeDropdown from "@/app/src/components/dropdown/Node";
import SelectRole from "@/app/src/components/dropdown/Role";
import axios from "axios";
import { api } from "@/envfile/api";
import toast, { Toaster } from "react-hot-toast";
import { getCookie } from "cookies-next";
import LocalesDropdown from "@/app/src/components/dropdown/Locales";
import { useRouter } from "next/navigation";
import SingleSelectSubsidiary from "@/app/src/components/dropdown/Subsidiary";
import MultiSelectSubsidiary from "@/app/src/components/multiSelectDropdown/Subsidiary";
import MultiSelectRole from "@/app/src/components/multiSelectDropdown/MultiSelectRole";

const Adduser = () => {
  const router = useRouter();
  const [params, setParams] = useState([]);
  const [token, setToken] = useState("");
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedSubsidiary, setSelectedSubsidiary] = useState([]);
  const [locales, setLocales] = useState([]);
  const [selectedRole, setSelectedRole] = useState([]);
  const [ButtonActive, setButtonActive] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const jwtToken = getCookie("jwtToken");
    if (jwtToken) {
      setToken(jwtToken);
    }
  }, []);

  useEffect(() => {
    const storedEmail = localStorage.getItem("username");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const [formValues, setFormValues] = useState({
    email: "",
    username: "",
    password: "welcome12345",
    confirmpassword: "",
  });

  // Handle change for form inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSaveClick = async () => {
    // Check if password and confirm password match
    if (formValues.password !== formValues.confirmpassword) {
      toast.error("Password and Confirm Password do not match!");
      return; // Exit the function if the passwords don't match
    }

    try {
      const headers = { Authorization: `Bearer ${token}` };
      const body = {
        users: [
          {
            email: formValues.email,
            username: formValues.username,
            node: selectedNode,
            subsidiaries: selectedSubsidiary.map((id) => ({ recordId: id })),
            roles: selectedRole,
            password: formValues.password,
            passwordConfirm: formValues.confirmpassword,
            status: ButtonActive,
            locale: locales,
          },
        ],
      };
      

      console.log(body, "req body from user");
      console.log(selectedRole, "selectedRole selectedRole");

      const response = await axios.post(`${api}/admin/user/edit`, body, {
        headers,
      });

      if (response.data) {
        toast.success("User added successfully!");
        router.push("/cheil/roleandusers/user");
      }
    } catch (err) {
      toast.error("Error adding user. Please try again.");
      console.error("Error fetching data:", err);
    } 
    // finally {
    //   setLoading(false);
    // }
  };

  const handleRunClick = () => {
    alert("Run function executed from AddDataSource!");
  };

  const breadscrums = "RoleandUser > Add User";
  const pagename = "Add New";
  return (
    <AddNewPageButtons
      pagename={pagename}
      email={email}
      breadscrums={breadscrums}
      handleSaveClick={handleSaveClick}
      handleRunClick={handleRunClick}
    >
      <Toaster />
      <div
        className="flex flex-col w-full p-4 max-h-screen gap-5"
        style={{ fontFamily: "SamsungOne, sans-serif" }}
      >
        <div className="bg-white p-4 gap-3 rounded-md shadow-md">
          <div className="w-full grid grid-cols-4 justify-between items-center gap-5">
            <TextField
              label="Email"
              variant="standard"
              className="text-xs"
              name="email" // Correct name for email input
              value={formValues.email}
              onChange={handleInputChange}
            />
            <TextField
              label="User Name"
              variant="standard"
              className="text-xs"
              name="username" // Correct name for username input
              value={formValues.username}
              onChange={handleInputChange}
            />
            <TextField
              type="password"
              label="Password"
              variant="standard"
              className="text-xs"
              name="password" // Correct name for password input
              value={formValues.password}
              onChange={handleInputChange}
            />
            <TextField
              type="password"
              label="Confirm Password"
              variant="standard"
              className="text-xs"
              name="confirmpassword" // Correct name for confirm password input
              value={formValues.confirmpassword}
              onChange={handleInputChange}
            />

           <div className="mt-6"> <NodeDropdown setSelectedNode={setSelectedNode} selectedNode={selectedNode} /></div>
           <div className="mt-6"> <MultiSelectSubsidiary
              selectedSubsidiary={selectedSubsidiary}
              setSelectedSubsidiary={setSelectedSubsidiary}
            /></div>
           <div className="mt-6"><MultiSelectRole
              selectedRoles={selectedRole}
              setSelectedRoles={setSelectedRole}
            /></div>
           <div> <LocalesDropdown setLocales={setLocales} locales={locales} /></div>
           
            
           
          </div>
          <div className="flex gap-4 items-center w-[100%] mt-4 justify-end">
            <div className="flex flex-row gap-3 items-center">
              {ButtonActive == false ? (
                <button
                  onClick={() => setButtonActive(!ButtonActive)}
                  className="bg-[#fff] border-2 border-solid border-gray-400  rounded-md text-gray-700 text-xs px-2 py-0.5 w-[80px] animate__animated  animate__pulse"
                >
                  InActive
                </button>
              ) : (
                <button
                  onClick={() => setButtonActive(!ButtonActive)}
                  className=" bg-[#1581ed] border-2 border-solid border-[#1581ed] rounded-md text-white text-xs px-2 py-0.5 w-[80px] animate__animated  animate__pulse"
                >
                  Active
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </AddNewPageButtons>
  );
};

export default Adduser;
