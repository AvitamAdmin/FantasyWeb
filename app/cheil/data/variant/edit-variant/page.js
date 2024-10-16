"use client";
import React, { useState, useEffect } from "react";
import { MenuItem, TextField } from "@mui/material";
import AddNewPageButtons from "@/app/src/components/AddNewPageButtons/AddNewPageButtons";
import SelectCategory from "@/app/src/components/dropdown/Category";
import Models from "@/app/src/components/dropdown/Models";
import { useRouter } from "next/navigation";
import axios from "axios";
import { api } from "@/envfile/api";
import { getCookie } from "cookies-next";
import SingleSelectSubsidiary from "@/app/src/components/dropdown/Subsidiary";
import { useSelector } from "react-redux";

const EditVariant = () => {
  const [token, setToken] = useState("");
  const [editInputfields, setEditInputfields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const [email, setEmail] = useState('');
  const selectedID = useSelector((state) => state.tasks.multipleEditRecordId);

  const pageOptions = [
    {
      value: "",
      label: "Select Page type",
    },
    {
      value: "BC",
      label: "BC",
    },
    {
      value: "PD",
      label: "PD",
    },
  ];
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
      handleFetchData(jwtToken);
    }
  }, []);

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    setEditInputfields((prevFields) => {
      const updatedFields = [...prevFields];
      updatedFields[index] = { ...updatedFields[index], [name]: value };
      return updatedFields;
    });
  };

  const handlePageTypeChange = (e, index) => {
    const updatedFields = [...editInputfields];
    updatedFields[index].pageType = e.target.value;
    setEditInputfields(updatedFields);
  };

  const handleSubsidiaryChange = (newSubsidiary, index) => {
    const updatedFields = [...editInputfields];
    updatedFields[index].subsidiary = newSubsidiary;
    setEditInputfields(updatedFields);
  };

  const handleCategoryChange = (category, index) => {
    const updatedFields = [...editInputfields];
    updatedFields[index].category = category ? { recordId: category } : null;
    setEditInputfields(updatedFields);
  };

  const handleModelChange = (model, index) => {
    const updatedFields = [...editInputfields];
    updatedFields[index].model = model ? { recordId: model } : null;
    setEditInputfields(updatedFields);
  };

  const handleButtonClick = (index) => {
    setEditInputfields((prevFields) => {
      const updatedFields = [...prevFields];
      updatedFields[index].ButtonActive = !updatedFields[index].ButtonActive;
      return updatedFields;
    });
  };

  const handleSaveClick = async () => {
    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${token}` };

      const body = {
        variants: editInputfields.map((item) => ({
          recordId: item.recordId,
          identifier: item.identifier || "",
          shortDescription: item.shortDescription || "",
          externalProductUrl: item.externalProductUrl || "",
          pageType: item.pageType || "",
          category: item.category ? { recordId: item.category.recordId } : null,
          subsidiaries: item.subsidiary ? [item.subsidiary] : [],
          model: item.model ? { recordId: item.model.recordId } : null,
          status: item.ButtonActive,
        })),
      };

      const response = await axios.post(`${api}/admin/variant/edit`, body, {
        headers,
      });
      console.log(response, "response from api");

      router.push("/cheil/data/variant");
    } catch (err) {
      setError("Error saving data");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchData = async (jwtToken) => {
    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${jwtToken}` };
      const body = { variants: selectedID.map((id) => ({ recordId: id })) };
      const response = await axios.post(`${api}/admin/variant/getedits`, body, {
        headers,
      });

      const variants = response.data.variants.map((item) => ({
        ...item,
        ButtonActive: item.status || false,
        subsidiary: item.subsidiary || [],
        model: item.model || "",
        category: item.category || "",
        pageType: item.pageType || "",
      }));
      setEditInputfields(variants);
    } catch (err) {
      setError("Error fetching variant data");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const pagename = "Edit Variant";
  const breadscrums = "Admin > Variant";

  return (
    <AddNewPageButtons
      pagename={pagename}
      breadscrums={breadscrums}
      handleSaveClick={handleSaveClick}
      email={email}
    >
      <div className="p-2">
        <div className="flex flex-col bg-gray-200 p-2 gap-3 rounded-md">
          {editInputfields.map((item, index) => (
            <div
              key={item.recordId}
              className="bg-white p-4 rounded-md shadow-md"
            >
              <div className="grid grid-cols-3 gap-4 mb-4">
                <TextField
                  label="Enter Identifier"
                  variant="standard"
                  fullWidth
                  name="identifier"
                  value={item.identifier || ""}
                  onChange={(e) => handleInputChange(e, index)}
                />
                <TextField
                  label="Enter Description"
                  variant="standard"
                  fullWidth
                  name="shortDescription"
                  value={item.shortDescription || ""}
                  onChange={(e) => handleInputChange(e, index)}
                />
                <TextField
                  label="External Product URL"
                  variant="standard"
                  fullWidth
                  name="externalProductUrl"
                  value={item.externalProductUrl || ""}
                  onChange={(e) => handleInputChange(e, index)}
                />
                <SingleSelectSubsidiary
                  selectedSubsidiary={item.subsidiary}
                  setSelectedSubsidiary={(newSubsidiary) =>
                    handleSubsidiaryChange(newSubsidiary, index)
                  }
                />
                <SelectCategory
                  selectedCategory={item.category ? item.category.recordId : ""}
                  setCategory={(category) =>
                    handleCategoryChange(category, index)
                  }
                />

                <Models
                  selectedModel={item.model}
                  setModel={(model) => handleModelChange(model, index)}
                />

                <TextField
                  style={{ marginTop: "2.5vh" }}
                  className="text-xs w-[80%]"
                  select
                  variant="standard"
                  name="pageType"
                  value={item.pageType}
                  onChange={(e) => handlePageTypeChange(e, index)}
                  SelectProps={{ native: false }}
                >
                  {pageOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
              <div className="flex gap-4 items-center justify-end">
                {item.ButtonActive ? (
                  <button
                    onClick={() => handleButtonClick(index)}
                    className="bg-[#1581ed] border-2 border-solid border-[#1581ed] rounded-md text-white text-xs px-2 py-0.5 w-[80px]"
                  >
                    Active
                  </button>
                ) : (
                  <button
                    onClick={() => handleButtonClick(index)}
                    className="bg-[#fff] border-2 border-solid border-gray-400 rounded-md text-gray-700 text-xs px-2 py-0.5 w-[80px]"
                  >
                    Inactive
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AddNewPageButtons>
  );
};

export default EditVariant;
