"use client";
import React, { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import AddNewPageButtons from "@/app/src/components/AddNewPageButtons/AddNewPageButtons";
import { MultiSelect } from "primereact/multiselect";
import { getCookie } from "cookies-next";
import { api } from "@/envfile/api";
import axios from "axios";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const Editrole = () => {
  const router = useRouter();
  const selectedID = useSelector((state) => state.tasks.multipleEditRecordId);
  const [menuData, setMenuData] = useState([]);
  const [formValues, setFormValues] = useState({
    name: "",
    quota: "",
    quotaUsed: "",
    permissions: [], // Maintain array for permissions
  });
  const [isActive, setIsActive] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    const jwtToken = getCookie("jwtToken");
    if (jwtToken) setToken(jwtToken);

    const storedEmail = localStorage.getItem("username");
    if (storedEmail) setEmail(storedEmail);
  }, []);

  useEffect(() => {
    if (token) {
      fetchMenuData();
      if (selectedID) fetchExistingData(selectedID);
    }
  }, [token, selectedID]);

  const fetchMenuData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(`${api}/admin/interface/getMenu`, {
        headers,
      });
      setMenuData(response.data);
      console.log(response, "menudata");
    } catch (error) {
      console.error("Error fetching menu data", error);
    }
  };

  const [selectedPermissions, setSelectedPermissions] = useState({});

  useEffect(() => {
    console.log("Menu Data:", menuData);
    console.log("Selected Permissions State:", selectedPermissions);
  }, [menuData, selectedPermissions]);

  const fetchExistingData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const body = { roles: selectedID.map((id) => ({ recordId: id })) };
      const response = await axios.post(`${api}/admin/role/getedits`, body, {
        headers,
      });

      if (
        response.data &&
        response.data.roles &&
        response.data.roles.length > 0
      ) {
        const roleData = response.data.roles[0];

        console.log("Role Data:", roleData);

        setFormValues({
          name: roleData.name || "",
          quota: roleData.quota || "",
          quotaUsed: roleData.quotaUsed || "",
          permissions: roleData.permissions || [], // Setting permissions array
        });

        // Initialize selectedPermissions based on existing roleData
        const initialPermissions = {};
        roleData.permissions.forEach((permission) => {
          const parentId = permission.parentId; // Ensure this is defined in your permission data
          if (!initialPermissions[parentId]) {
            initialPermissions[parentId] = [];
          }
          initialPermissions[parentId].push(permission.recordId); // Store by parentId
        });
        setSelectedPermissions(initialPermissions);
      } else {
        console.error("No role data found or empty roles array");
      }
    } catch (error) {
      console.error("Error fetching role data", error);
    }
  };

  const handlePermissionChange = (parentId, selectedIds) => {
    console.log(
      `Updating Permissions for Parent ID: ${parentId}, with IDs: ${selectedIds}`
    );
    setSelectedPermissions((prev) => ({
      ...prev,
      [parentId]: selectedIds,
    }));
  };

  const transformPermissions = () => {
    const result = [];
    Object.entries(selectedPermissions).forEach(([parentId, permissionIds]) => {
      permissionIds.forEach((permissionId) => {
        result.push({ recordId: permissionId, parentId });
      });
    });
    return result;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSaveClick = async () => {
    const headers = { Authorization: `Bearer ${token}` };
    const permissions = transformPermissions();

    const body = {
      roles: [
        {
          name: formValues.name,
          quota: formValues.quota,
          quotaUsed: formValues.quotaUsed,
          status: isActive,
          published: isPublished,
          permissions: permissions,
        },
      ],
    };

    try {
      await axios.post(`${api}/admin/role/edit`, body, { headers });
      toast.success("Role edited successfully!");
      router.push("/cheil/roleandusers/role");
    } catch (error) {
      toast.error("Error editing role. Please try again.");
      console.error("Error:", error);
    }
  };

  return (
    <AddNewPageButtons
      pagename="Edit"
      email={email}
      breadscrums="Admin > Role"
      handleSaveClick={handleSaveClick}
      handleRunClick={() => alert("Run function executed from AddDataSource!")}
    >
      <div
        className="flex flex-col w-full p-4 min-h-screen gap-5"
        style={{ fontFamily: "SamsungOne, sans-serif" }}
      >
        <div className="flex flex-col bg-gray-200 rounded-md shadow">
          <div className="bg-white p-4 rounded-md shadow-md">
            <div className="flex flex-row gap-4 mb-4 items-center justify-center">
              <TextField
                label="Name"
                variant="standard"
                className="text-xs"
                name="name"
                value={formValues.name}
                onChange={handleInputChange}
                fullWidth
              />
              <TextField
                label="Quota"
                variant="standard"
                className="text-xs"
                name="quota"
                value={formValues.quota}
                onChange={handleInputChange}
                fullWidth
              />
              <TextField
                label="Quota Used"
                variant="standard"
                className="text-xs"
                name="quotaUsed"
                value={formValues.quotaUsed}
                onChange={handleInputChange}
                fullWidth
              />
              <div className="flex flex-row gap-4">
                <button
                  onClick={() => setIsActive(!isActive)}
                  className={`${
                    isActive ? "bg-[#1581ed]" : "bg-[#fff]"
                  } border-2 border-solid border-gray-400 rounded-md text-gray-500 text-xs px-2 py-0.5 w-[80px] animate__animated animate__pulse`}
                >
                  {isActive ? "Active" : "Inactive"}
                </button>

                <button
                  onClick={() => setIsPublished(!isPublished)}
                  className={`${
                    isPublished ? "bg-[#1581ed]" : "bg-[#fff]"
                  } border-2 border-solid border-gray-400 rounded-md text-gray-500 text-xs px-2 py-0.5 w-[80px] animate__animated animate__pulse`}
                >
                  {isPublished ? "Published" : "Unpublished"}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 p-2 justify-between gap-5 w-full">
              {menuData.map((parentNode) => {
                const parentId = parentNode.recordId;

                if (!parentId) {
                  return <p key={parentId}>Parent node missing recordId</p>;
                }

                return (
                  <div className="flex flex-col w-[45%]" key={parentId}>
                    {parentNode.childNodes &&
                    Array.isArray(parentNode.childNodes) ? (
                      <MultiSelect
                        value={selectedPermissions[parentId] || []} // Ensure defaulting to an empty array
                        onChange={(e) =>
                          handlePermissionChange(parentId, e.value)
                        }
                        options={parentNode.childNodes.map((childNode) => ({
                          label: childNode.identifier,
                          value: childNode.recordId,
                        }))}
                        optionLabel="label"
                        filter
                        placeholder={`Select ${parentNode.identifier} permissions`}
                        display="chip"
                        maxSelectedLabels={3}
                        className="w-full p-2 text-gray-700 rounded-md"
                        panelClassName="max-h-48 overflow-auto shadow-lg rounded-lg"
                      />
                    ) : (
                      <p>No child nodes available</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AddNewPageButtons>
  );
};

export default Editrole;