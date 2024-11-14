"use client";
import React, { useEffect, useState } from "react";
import { TextField, Autocomplete, CircularProgress } from "@mui/material"; // Import Autocomplete
import { useRouter } from "next/navigation";
import axios from "axios";
import { getCookie } from "cookies-next";
import AddNewPageButtons from "@/app/src/components/AddNewPageButtons/AddNewPageButtons";
import { api } from "@/envfile/api";
import { useDispatch, useSelector } from "react-redux";
import MultiSelectRole from "@/app/src/components/multiSelectDropdown/MultiSelectRole";
import { clearAllEditRecordIds } from "@/app/src/Redux/Slice/slice";
import Lottie from "react-lottie";
import * as animationData from "../../../../../assests/LoadingAnimation.json";
import toast, { Toaster } from "react-hot-toast";

const EditUser = () => {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [params, setParams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [subsidiary, setSubsidiary] = useState([]); // This holds all available subsidiaries
  const [selectedSubsidiary, setSelectedSubsidiary] = useState([]); // This holds selected subsidiaries for a specific user
  const [initialload, setInitialLoad] = useState(true);
  const [editInputfields, setEditInputfields] = useState([]);
  const [lastmodifideBy, setlastmodifideBy] = useState();
  const [modifiedBy, setmodifiedBy] = useState();
  const [creationTime, setcreationTime] = useState();
  const [creator, setcreator] = useState();

  // Function to fetch all subsidiaries from backend
  const getAllSubsidiaries = async () => {
    try {
      const response = await axios.get(api + "/admin/subsidiary/get");
      setSubsidiary(response.data.subsidiaries); // Store all fetched subsidiaries in state
    } catch (error) {
      console.error(error, "Error fetching subsidiaries");
    }
  };
  const [formValues, setFormValues] = useState({
    email: "",
    username: "",
    password: "welcome12345",
    confirmpassword: "",
    roles: [],
    subsidiaries: [],
    node: [],
    locale: [],
    status: "",
  });

  useEffect(() => {
    const storedEmail = localStorage.getItem("username");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  useEffect(() => {
    const jwtToken = getCookie("jwtToken");
    if (jwtToken) {
      setToken(jwtToken);
      handlefetchData(jwtToken);
    }
  }, []);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });

    // Clear error when input changes
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };
  const dispatch = useDispatch();

  const [ButtonActive, setButtonActive] = useState(formValues.status || false);

  // Toggle button state and update formValues.status accordingly
  const handleStatusToggle = () => {
    const newStatus = !ButtonActive;
    setButtonActive(newStatus); // Toggle ButtonActive state
    setFormValues((prev) => ({ ...prev, status: newStatus })); // Update formValues.status
  };

  // UseEffect to sync ButtonActive with formValues.status on load
  useEffect(() => {
    setButtonActive(formValues.status);
  }, [formValues.status]);

  const handlePostClick = async () => {
    let newErrors = {};
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    // Check if email and password fields are empty
    if (!formValues.username) {
      newErrors.username = "Email is required.";
    } else if (!emailRegex.test(formValues.username)) {
      newErrors.username = "Invalid email format!";
    }

    if (!formValues.password) {
      newErrors.password = "Password is required.";
    } else if (formValues.password !== formValues.confirmpassword) {
      newErrors.password = "Password and Confirm Password do not match!";
    }

    if (selectedSubsidiary.length === 0) {
      toast.error("Please select at least one subsidiary.");
    }

    setErrors(newErrors);

    // Stop if there are any errors
    if (Object.keys(newErrors).length > 0 || selectedSubsidiary.length === 0)
      return;

    try {
      const headers = { Authorization: `Bearer ${token}` };
      const body = {
        users: [
          {
            recordId: Array.isArray(selectedID) ? selectedID[0] : selectedID,
            email: formValues.email,
            username: formValues.username,
            node: formValues.node,
            subsidiaries: selectedSubsidiary.map((id) => ({ recordId: id })),
            roles: formValues.roles.map((role) => ({
              recordId: role.recordId,
            })),
            password: formValues.password,
            passwordConfirm: formValues.confirmpassword,
            status: ButtonActive,
            locale: formValues.locale,
          },
        ],
      };

      const response = await axios.post(`${api}/admin/user/edit`, body, {
        headers,
      });
      toast.success(`${response.data.message}`,{className:"text-sm"});

  setTimeout(() => {
        dispatch(clearAllEditRecordIds());
        router.push("/fantasy/roleandusers/user");
      }, 2000);
    } catch (err) {
      console.error(err.response?.data || err.message, "Error details");
      setError("Error submitting data");
    }
  };
  const selectedID = useSelector((state) => state.tasks.multipleEditRecordId);
  const [subsidiariesList, setSubsidiariesList] = useState([]); // To store all subsidiaries

  const handlefetchData = async (jwtToken) => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${jwtToken}` };
      const body = { users: selectedID.map((id) => ({ recordId: id })) };

      const response = await axios.post(`${api}/admin/user/getedits`, body, {
        headers,
      });
      setlastmodifideBy(response.data.users[0]?.lastModified || "");
      setmodifiedBy(response.data.users[0]?.modifiedBy || "");
      setcreationTime(response.data.users[0]?.creationTime || "");
      setcreator(response.data.users[0]?.creator || "");
      const fetchedData = response.data.users[0];
      setEditInputfields(response.data.users);

      const subsidiaries = fetchedData.subsidiaries || [];
      setSubsidiariesList(subsidiaries);

      const mappedRecordIds = subsidiaries.map((sub) => sub.recordId);
      setSelectedSubsidiary(mappedRecordIds);

      // Set initial form values
      setFormValues({
        // email: fetchedData.email || "",
        username: fetchedData.username || "",
        password: fetchedData.password || "",
        confirmpassword: fetchedData.password,
        roles: fetchedData.roles || [],
        subsidiaries: subsidiaries,
        // node: fetchedData.node || [],
        // locale: fetchedData.locale || "",
        status: fetchedData.status || false, // Initialize status
      });

      console.log(fetchedData, "formValues user roles fetched");
    } catch (err) {
      console.error("Error fetching user data:", err);
    } finally {
      setLoading(false);
    }
  };

  const pagename = "Edit";
  const breadscrums = "RoleandUser > Edit User";

  useEffect(() => {
    getAllSubsidiaries();
  }, []);
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <AddNewPageButtons
      lastmodifideBy={lastmodifideBy}
      modifiedBy={modifiedBy}
      creator={creator}
      creationTime={creationTime}
      pagename={pagename}
      email={email}
      breadscrums={breadscrums}
      handleSaveClick={handlePostClick}
    >
      {loading ? (
        <>
          <div className="flex flex-row justify-center items-center w-full h-40">
            <div className="gap-5 flex flex-col items-center justify-center">
              <CircularProgress size={36} color="inherit" />
              <div>Loading...</div>
            </div>
          </div>
        </>
      ) : (
        <>
          {editInputfields.length < 1 ? (
            <div className="w-full flex flex-col  h-40 justify-center items-center">
              <div className="opacity-35 ">
                <Lottie options={defaultOptions} height={100} width={100} />
              </div>
              <div>No data found...</div>
            </div>
          ) : (
            <>
              <div className="p-2">
                <Toaster />
                <div className="flex flex-col bg-gray-200 p-2 gap-3 rounded-md">
                  <div className="grid grid-cols-4 gap-5 mb-4">
                    {/* <TextField
                      label="Email"
                      variant="standard"
                      className="text-xs"
                      name="email"
                      value={formValues.email}
                      onChange={handleInputChange}
                    /> */}
                    <TextField
                      label="Enter Email"
                      variant="standard"
                      className="text-xs"
                      name="username"
                      value={formValues.username}
                      onChange={handleInputChange}
                      error={!!errors.username} // Display error if it exists
                      helperText={errors.username} // Show error message
                    />
                    <TextField
                      type="password"
                      label="Password"
                      variant="standard"
                      className="text-xs"
                      name="password"
                      value={formValues.password}
                      onChange={handleInputChange}
                      error={!!errors.password} // Display error if it exists
                      helperText={errors.password} // Show error message
                    />
                    <TextField
                      type="password"
                      label="Confirm Password"
                      variant="standard"
                      className="text-xs"
                      name="confirmpassword"
                      value={formValues.confirmpassword}
                      onChange={handleInputChange}
                    />
                    {/* <div className="mt-1.5">
                      <NodeDropdown
                        initialload={initialload}
                        selectedNode={formValues.node || null}
                        setSelectedNode={(newNode) =>
                          setFormValues((prev) => ({ ...prev, node: newNode }))
                        }
                      />
                    </div> */}

                    <Autocomplete
                      multiple
                      options={subsidiary}
                      getOptionLabel={(option) => option.identifier || ""}
                      value={subsidiary.filter((sub) =>
                        selectedSubsidiary.includes(sub.recordId)
                      )}
                      onChange={(event, newValue) => {
                        setSelectedSubsidiary(
                          newValue.map((item) => item.recordId)
                        );
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Subsidiaries"
                          variant="standard"
                        />
                      )}
                    />

                    <MultiSelectRole
                      initialload={initialload}
                      selectedRoles={formValues.roles}
                      setSelectedRoles={(roles) =>
                        setFormValues((prev) => ({ ...prev, roles }))
                      }
                    />
                    {/* <div className="mt-2.5">
                      <LocalesDropdown
                        initialload={initialload}
                        locales={formValues.locale}
                        setLocales={(value) =>
                          setFormValues((prev) => ({ ...prev, locale: value }))
                        }
                      />
                    </div> */}
                  </div>
                </div>
                <div className="flex gap-4 items-center w-[100%] justify-end">
                  <div className="flex flex-row gap-3 items-center">
                    {ButtonActive ? (
                      <div
                        onClick={handleStatusToggle}
                        className="bg-[#1581ed] text-center cursor-pointer  border-2 border-solid border-[#1581ed] rounded-md text-white text-xs px-2 py-0.5 w-[80px] animate__animated animate__pulse"
                      >
                        Active
                      </div>
                    ) : (
                      <div
                        onClick={handleStatusToggle}
                        className="bg-[#fff] border-2 border-solid border-gray-400 text-center cursor-pointer rounded-md text-gray-700 text-xs px-2 py-0.5 w-[80px] animate__animated animate__pulse"
                      >
                        Inactive
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </AddNewPageButtons>
  );
};

export default EditUser;
