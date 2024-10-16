"use client";
import React, { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import AddNewPageButtons from "@/app/src/components/AddNewPageButtons/AddNewPageButtons";
import SelectCategory from "@/app/src/components/dropdown/Category";
import { useRouter } from "next/navigation";
import axios from "axios";
import { api } from "@/envfile/api";
import { getCookie } from "cookies-next";
import SingleSelectSubsidiary from "@/app/src/components/dropdown/Subsidiary";

const AddCategory = () => {
  const [ButtonActive, setButtonActive] = useState(false);
  const [selectedSubsidiary, setSelectedSubsidiary] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCategories, setSelectedCategories] = useState("");
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [initialload, setInitialLoad] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const [formValues, setFormValues] = useState({
    identifier: "",
    shortDescription: "",
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
      [name]: value,
    });
  };

  const handleSaveClick = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const body = {
        categories: [
          {
            identifier: formValues.identifier,
            shortDescription: formValues.shortDescription,
            parentId: selectedCategory,
            childIds: selectedCategories ? [selectedCategories] : [],
            subsidiaries: selectedSubsidiary ? [selectedSubsidiary] : [],
            status: ButtonActive,
          },
        ],
      };

      console.log(body, "req body from user");
      console.log(token, "token");

      const response = await axios.post(`${api}/admin/category/edit`, body, {
        headers,
      });
      console.log(response.data, "response from api");
      router.push("/cheil/data/category");
    } catch (err) {
      setError("Error fetching category data");
    } finally {
      setLoading(false);
    }
  };

  const breadscrums = "Admin > category";
  const pagename = "Add New";

  return (
    <AddNewPageButtons
      pagename={pagename}
      email={email}
      breadscrums={breadscrums}
      handleSaveClick={handleSaveClick}
    >
      <div
        className="flex flex-col w-full p-4 min-h-screen gap-5"
        style={{ fontFamily: "SamsungOne, sans-serif" }}
      >
        <div className="flex flex-col bg-gray-200 rounded-md shadow">
          <div className="bg-white p-4 rounded-md shadow-md w-full">
            <div className=" grid-cols-3 gap-4 mb-4 items-center w-full justify-between flex flex-row">
              <TextField className="w-[25%]"
                label="Enter Identifier"
                variant="standard"
                name="identifier"
                value={formValues.identifier}
                onChange={handleInputChange}
              />
              <TextField
              className="w-[25%]"
                label="Short Description"
                variant="standard"
                name="shortDescription"
                value={formValues.shortDescription}
                onChange={handleInputChange}
              />

              <div className="w-[25%] mt-1">
              <SingleSelectSubsidiary
              // initialload={initialload}
                setSelectedSubsidiary={setSelectedSubsidiary}
                selectedSubsidiary={selectedSubsidiary}
              />
              </div>
               <div className="w-[25%]">
               <SelectCategory
                selectedCategory={selectedCategory}
                setCategory={setSelectedCategory}
              />
               </div>
            </div>

            <div className="w-full gap-2 mb-4 items-start justify-start flex flex-row">
             
            <div className="w-[25%]">
              <SelectCategory
                selectedCategories={selectedCategories}
                setCategory={setSelectedCategories}
              />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-row gap-3 items-center w-full justify-end">
                {ButtonActive  ? (
                  <button
                    onClick={() => setButtonActive(!ButtonActive)}
                    className="bg-[#1581ed] border-2 border-solid border-[#1581ed] rounded-md text-white text-xs px-2 py-0.5 w-[80px] animate__animated  animate__pulse"
                  >
                    Active
                  </button>
                ) : (
                  <button
                    onClick={() => setButtonActive(!ButtonActive)}
                    className="bg-[#fff] border-2 border-solid border-gray-400 rounded-md text-gray-500 text-xs px-2 py-0.5 w-[80px] animate__animated  animate__pulse"
                  >
                    Inactive
                  </button>
                )  }
              </div>
            </div>
          </div>
        </div>
      </div>
    </AddNewPageButtons>
  );
};

export default AddCategory;
