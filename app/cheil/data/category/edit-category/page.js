"use client";
import React, { useEffect, useState } from "react";
import { CircularProgress, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import axios from "axios";
import { getCookie } from "cookies-next";
import AddNewPageButtons from "@/app/src/components/AddNewPageButtons/AddNewPageButtons";
import SelectCategory from "@/app/src/components/dropdown/Category";
import MultiSelectSubsidiary from "@/app/src/components/multiSelectDropdown/Subsidiary";
import { api } from "@/envfile/api";
import { useDispatch, useSelector } from "react-redux";
import SingleSelectSubsidiary from "@/app/src/components/dropdown/Subsidiary";
import { clearAllEditRecordIds } from "@/app/src/Redux/Slice/slice";
import Lottie from "react-lottie";
import * as animationData from "../../../../../assests/LoadingAnimation.json";
const EditCategory = () => {
  const [token, setToken] = useState("");
  const [editInputfields, setEditInputfields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const selectedID = useSelector((state) => state.tasks.multipleEditRecordId);
  const dispatch = useDispatch();
  const [initialload, setInitialLoad] = useState(true);
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  useEffect(() => {
    const jwtToken = getCookie("jwtToken");
    if (jwtToken) {
      setToken(jwtToken);
      fetchCategoryData(jwtToken);
    }
  }, []);

  const fetchCategoryData = async (jwtToken) => {
    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${jwtToken}` };
      const response = await axios.post(`${api}/admin/category/getedits`, {
        categories: selectedID.map((id) => ({ recordId: id })),
      }, { headers });
console.log(response,"response from api");

const categories = response.data.categories.map((item) => ({
  ...item,
  ButtonActive: item.status || false,
  parentId: item.parentId || "", // Ensure it's correctly populated
  childIds: item.childIds && item.childIds.length > 0 ? item.childIds : [], // Handle empty array
  subsidiaries: item.subsidiaries || [],
}));


      setEditInputfields(categories);
    } catch (error) {
      setError("Error fetching categories data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    setEditInputfields((prevFields) => {
      const updatedFields = [...prevFields];
      updatedFields[index][name] = value;
      return updatedFields;
    });
  };

  const handleCategoryChange = (category, index, type) => {
    console.log(category, type, "Category selected");
    setEditInputfields((prevFields) => {
      const updatedFields = [...prevFields];
      updatedFields[index][type === "parent" ? "parentId" : "childIds"] = category;
      return updatedFields;
    });
  };
  

  const handlePostClick = async () => {
    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${token}` };

      const body = {
        categories: editInputfields.map((item) => ({
          recordId: item.recordId,
          identifier: item.identifier,
          shortDescription: item.shortDescription,
          parentId: item.parentId || null,
          childIds: item.childIds || [],
          subsidiaries: item.subsidiaries || [],
          status: item.ButtonActive,
        })),
      };

      const response = await axios.post(`${api}/admin/category/edit`, body, {
        headers,
      });
      console.log("Response:", response);
      dispatch(clearAllEditRecordIds());
      router.push("/cheil/data/category");
    } catch (error) {
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
      const body = { categories: selectedID.map((id) => ({ recordId: id })) };

      const response = await axios.post(
        `${api}/admin/category/getedits`,
        body,
        { headers }
      );
      setLoading(false);
      const categories = response.data.categories.map((item) => ({
        ...item,
        ButtonActive: item.status || false,
        subsidiaries:
          Array.isArray(item.subsidiaries) && item.subsidiaries.length > 0
            ? item.subsidiaries
            : [],
        childIds:
          Array.isArray(item.childIds) && item.childIds.length > 0
            ? item.childIds
            : [],
        parentId: item.parentId || "",
      }));
      setEditInputfields(categories);
    } catch (err) {
      setError("Error fetching categories data");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AddNewPageButtons
      pagename="Edit"
      breadscrums="Data > categories"
      handleSaveClick={handlePostClick}

    >
      

      {
      loading ? (<>
        <div className="flex flex-row justify-center items-center w-full h-40">
        <div className="gap-5 flex flex-col items-center justify-center">
        <CircularProgress size={36} color="inherit" />
        <div>Loading...</div>
        </div>
          </div></>) :(
            <>
            {
              editInputfields.length < 1 ? (
                <div className="w-full flex flex-col  h-40 justify-center items-center">
                <div className="opacity-35 ">
                  <Lottie options={defaultOptions} height={100} width={100} />
                </div>
                <div>No data data found...</div>
              </div>
              ) : (
                <>
                 <div className="p-2">
        <div className="flex flex-col bg-gray-200 p-2 gap-3 rounded-md">
          {editInputfields.map((item, index) => (
            <div
              key={item.recordId}
              className="bg-white p-4 rounded-md shadow-md"
            >
              <div className="grid grid-cols-4 gap-4 mb-4">
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
                <MultiSelectSubsidiary
                  selectedSubsidiary={item.subsidiaries}
                  setSelectedSubsidiary={(newSubsidiary) =>
                    handleCategoryChange(newSubsidiary, index, "subsidiary")
                  }
                  // initialload={initialload}
                />
                <SelectCategory
                dropdownname="Parent Category"
                selectedCategory={item.parentId || ""}
                setCategory={(category) => handleCategoryChange(category, index, "parent")}
              />
              
              <SelectCategory
                dropdownname="Child Categories"
                selectedCategory={item.childIds || []}
                setCategory={(category) => handleCategoryChange(category, index, "child")}
                isMultiple
              />
              

              </div>
            </div>
          ))}
        </div>
      </div>
                </>
              )
            }
            </>
          )
     }
    </AddNewPageButtons>
  );
};

export default EditCategory;
