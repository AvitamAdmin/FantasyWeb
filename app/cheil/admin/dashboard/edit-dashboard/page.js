"use client";
import React, { useEffect, useState } from "react";
import { CircularProgress, TextField } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import AddNewPageButtons from "@/app/src/components/AddNewPageButtons/AddNewPageButtons";
import { api } from "@/envfile/api";
import { useDispatch, useSelector } from "react-redux";
import { getCookie } from "cookies-next";
import NodeDropdown from "@/app/src/components/dropdown/Node";
import DashboardProfile from "@/app/src/components/dropdown/DashboardProfile";
import SingleSelectSubsidiary from "@/app/src/components/dropdown/Subsidiary";
import { SketchPicker } from "react-color";
import Lottie from "react-lottie";
import * as animationData from "../../../../../assests/LoadingAnimation.json";
import { clearAllEditRecordIds } from "@/app/src/Redux/Slice/slice";

const EditDashBoard = () => {
  const [formValuesList, setFormValuesList] = useState([]);
  const [selectedSubsidiaryList, setSelectedSubsidiaryList] = useState([]);
  const [buttonActiveList, setButtonActiveList] = useState([]);
  const [selectedNodeList, setSelectedNodeList] = useState([]);
  const [selectedDashboardProfileList, setSelectedDashboardProfileList] =
    useState([]);
  const [displayColorPickerList, setDisplayColorPickerList] = useState([]);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const selectedID = useSelector((state) => state.tasks.multipleEditRecordId);
  const [editInputfields, seteditInputfields] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    const jwtToken = getCookie("jwtToken");
    if (jwtToken) {
      setToken(jwtToken);
      handleFetchData(jwtToken);
    }
  }, []);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const handleFetchData = async (jwtToken) => {
    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${jwtToken}` };
      const body = {
        dashboards: selectedID.map((id) => ({ recordId: id })),
      };

      const response = await axios.post(
        `${api}/admin/dashboard/getedits`,
        body,
        { headers }
      );
      const dashboards = response.data.dashboards || [];

      setFormValuesList(
        dashboards.map((item) => ({
          recordId: item.recordId || "",
          identifier: item.identifier || "",
          themeColor: item.themeColor || "#ffffff", 
          template: item.template || "",
        }))
      );

      setSelectedSubsidiaryList(
        dashboards.map((item) => item.subsidiaries || [])
      );
      setButtonActiveList(dashboards.map((item) => item.status === true));
      setSelectedNodeList(dashboards.map((item) => item.node || null));
      setSelectedDashboardProfileList(
        dashboards.map((item) => item.dashboardProfile || [])
      );
      setDisplayColorPickerList(dashboards.map(() => false)); 
    } catch (err) {
      setError("Error fetching dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    const updatedFormValues = [...formValuesList];
    updatedFormValues[index][name] = value;
    setFormValuesList(updatedFormValues);
  };

  const handleColorChange = (index, color) => {
    const updatedFormValues = [...formValuesList];
    updatedFormValues[index].themeColor = color.hex;
    setFormValuesList(updatedFormValues);
  };

  const handleSaveClick = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const body = {
        dashboards: formValuesList.map((formValues, index) => ({
          recordId: formValues.recordId,
          identifier: formValues.identifier,
          themeColor: formValues.themeColor,
          template: formValues.template,
          subsidiary: selectedSubsidiaryList[index],
          node: selectedNodeList[index],
          dashboardProfile: selectedDashboardProfileList[index],
          status: buttonActiveList[index],
        })),
      };

      const response = await axios.post(`${api}/admin/dashboard/edit`, body, {
        headers,
      });
      router.push("/cheil/admin/dashboard");
      dispatch(clearAllEditRecordIds());
    } catch (err) {
      setError("Error saving data");
    } finally {
      setLoading(false);
    }
  };

  const breadscrums = "Admin > dashboard Manager";
  const pagename = "Edit";

  return (
    <AddNewPageButtons
      pagename={pagename}
      breadscrums={breadscrums}
      handleSaveClick={handleSaveClick}
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
              ) :(
                <> 
                   <div className="flex flex-col w-full p-3 min-h-screen gap-5">
        {formValuesList.map((formValues, index) => (
          <div
            key={index}
            className="flex flex-col bg-gray-200 rounded-md shadow mb-5"
          >
            <div className="bg-white p-4 rounded-md shadow-md">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <TextField
                  label="Identifier"
                  variant="standard"
                  fullWidth
                  name="identifier"
                  value={formValues.identifier}
                  onChange={(e) => handleInputChange(index, e)}
                /> 

                <TextField
                  label="Template"
                  variant="standard"
                  fullWidth
                  name="template"
                  value={formValues.template}
                  onChange={(e) => handleInputChange(index, e)}
                />

                <TextField
                  label="Theme Color"
                  variant="standard"
                  fullWidth
                  name="themeColor"
                  value=""
                  onClick={() => {
                    const updatedDisplayColorPicker = [
                      ...displayColorPickerList,
                    ];
                    updatedDisplayColorPicker[index] =
                      !updatedDisplayColorPicker[index];
                    setDisplayColorPickerList(updatedDisplayColorPicker);
                  }}
                  InputProps={{
                    style: {
                      backgroundColor: formValues.themeColor,
                      height: "40px",
                    },
                  }}
                  readOnly
                />

                {displayColorPickerList[index] && (
                  <div style={{ position: "absolute", zIndex: "2" }}>
                    <div
                      style={{
                        position: "fixed",
                        top: "0px",
                        right: "0px",
                        bottom: "0px",
                        left: "0px",
                      }}
                      onClick={() => {
                        const updatedDisplayColorPicker = [
                          ...displayColorPickerList,
                        ];
                        updatedDisplayColorPicker[index] = false;
                        setDisplayColorPickerList(updatedDisplayColorPicker);
                      }}
                    />
                    <SketchPicker
                      color={formValues.themeColor}
                      onChange={(color) => handleColorChange(index, color)}
                    />
                  </div>
                )}

                <NodeDropdown
                  setSelectedNode={(newNode) => {
                    const updatedNodes = [...selectedNodeList];
                    updatedNodes[index] = newNode;
                    setSelectedNodeList(updatedNodes);
                  }}
                  selectedNode={selectedNodeList[index]}
                />

                <DashboardProfile
                  setSelectedDashboardProfile={(newProfile) => {
                    const updatedProfiles = [...selectedDashboardProfileList];
                    updatedProfiles[index] = newProfile;
                    setSelectedDashboardProfileList(updatedProfiles);
                  }}
                  selectedDashboardProfile={selectedDashboardProfileList[index]}
                />

                <SingleSelectSubsidiary
                  selectedSubsidiary={selectedSubsidiaryList[index]}
                  setSelectedSubsidiary={(newSubsidiary) => {
                    const updatedSubsidiaryList = [...selectedSubsidiaryList];
                    updatedSubsidiaryList[index] = newSubsidiary;
                    setSelectedSubsidiaryList(updatedSubsidiaryList);
                  }}
                />

                <button
                  onClick={() => {
                    const updatedButtonActiveList = [...buttonActiveList];
                    updatedButtonActiveList[index] =
                      !updatedButtonActiveList[index];
                    setButtonActiveList(updatedButtonActiveList);
                  }}
                  className={`w-[80px] px-2 py-0.5 rounded-md text-xs ${
                    buttonActiveList[index]
                      ? "bg-[#1581ed] text-white"
                      : "bg-[#fff] border-2 border-solid border-gray-400 text-gray-500"
                  }`}
                >
                  {buttonActiveList[index] ? "Active" : "Inactive"}
                </button>
              </div>
            </div>
          </div>
        ))}
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

export default EditDashBoard;