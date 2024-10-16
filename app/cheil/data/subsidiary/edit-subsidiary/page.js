"use client";
import React, { useEffect, useState } from "react";
import { CircularProgress, TextField } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import AddNewPageButtons from "@/app/src/components/AddNewPageButtons/AddNewPageButtons";
import { api } from "@/envfile/api";
import { useDispatch, useSelector } from "react-redux";
import { getCookie } from "cookies-next";
import LocalesDropdown from "@/app/src/components/dropdown/Locales";
import { clearAllEditRecordIds } from "@/app/src/Redux/Slice/slice";
import Lottie from "react-lottie";
import * as animationData from "../../../../../assests/LoadingAnimation.json";

const Editsubsidiary = () => {
  const [formValuesList, setFormValuesList] = useState([]);
  const [selectedSubsidiaryList, setSelectedSubsidiaryList] = useState([]);
  const [buttonActiveList, setButtonActiveList] = useState([]);
  const [selectedLocales, setSelectedLocales] = useState([]);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const [email, setEmail] = useState('');
  const selectedID = useSelector((state) => state.tasks.multipleEditRecordId);
  const dispatch = useDispatch();
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
      handleFetchData(jwtToken);
    }
  }, []);
  useEffect(() => {
    const storedEmail = localStorage.getItem('username');
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const handleFetchData = async (jwtToken) => {
    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${jwtToken}` };
      const body = {
        subsidiaries: selectedID.map((id) => ({ recordId: id })),
      };

      const response = await axios.post(
        `${api}/admin/subsidiary/getedits`,
        body,
        { headers }
      );
      console.log(response,"response from api");
      
      const subsidiaries = response.data.subsidiaries || [];

      setFormValuesList(
        subsidiaries.map((item) => ({
          recordId: item.recordId || "",
          identifier: item.identifier || "",
          shortDescription: item.shortDescription || "",
          cluster: item.cluster || "",
          isoCode: item.isoCode || "",
          localeLanguage: item.localeLanguage || "",
        }))
      );

      setSelectedSubsidiaryList(
        subsidiaries.map((item) => item.subsidiaries || [])
      );

      setButtonActiveList(subsidiaries.map((item) => item.status === true));
    } catch (err) {
      setError("Error fetching subsidiaries data");
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

  const handleSaveClick = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const body = {
        subsidiaries: formValuesList.map((formValues, index) => {
          return {
            recordId: formValues.recordId,
            identifier: formValues.identifier,
            shortDescription: formValues.shortDescription,
            cluster: formValues.cluster,
            isoCode: formValues.isoCode,
            localeLanguage : formValues.localeLanguage,
            status: buttonActiveList[index],
          };
        }),
      };

      const response = await axios.post(`${api}/admin/subsidiary/edit`, body, {
        headers,
      });
      console.log(response, "response from api");
      dispatch(clearAllEditRecordIds());

      router.push("/cheil/data/subsidiary");
    } catch (err) {
      setError("Error saving data");
    } finally {
      setLoading(false);
    }
  };

  const breadscrums = "Data > subsidiaries";
  const pagename = "Edit";

  return (
    <AddNewPageButtons
      pagename={pagename}
      breadscrums={breadscrums}
      email={email}
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
              formValuesList.length < 1 ? (
                <div className="w-full flex flex-col  h-40 justify-center items-center">
                <div className="opacity-35 ">
                  <Lottie options={defaultOptions} height={100} width={100} />
                </div>
                <div>No data data found...</div>
              </div>
              ) : (
                <>
                 <div className="flex flex-col w-full p-3 min-h-screen gap-5">
        {formValuesList.map((formValues, index) => (
          <div
            key={index}
            className="flex flex-col bg-gray-200 rounded-md shadow mb-5"
          >
            <div className="bg-white p-4 rounded-md shadow-md">
              <div className="grid grid-cols-4 gap-4 mb-4">
                <TextField
                  label="Identifier"
                  variant="standard"
                  fullWidth
                  name="identifier"
                  value={formValues.identifier}
                  onChange={(e) => handleInputChange(index, e)}
                />
                <TextField
                  label="Short Description"
                  variant="standard"
                  fullWidth
                  name="shortDescription"
                  value={formValues.shortDescription}
                  onChange={(e) => handleInputChange(index, e)}
                />
                <TextField
                  label="Cluster id"
                  variant="standard"
                  fullWidth
                  name="cluster"
                  value={formValues.cluster}
                  onChange={(e) => handleInputChange(index, e)}
                />
                <TextField
                  label="IsoCode"
                  variant="standard"
                  fullWidth
                  name="isoCode"
                  value={formValues.isoCode}
                  onChange={(e) => handleInputChange(index, e)}
                />
                <LocalesDropdown
                locales={formValues.localeLanguage} 
                setLocales={(newLocale) => {
                  const updatedLocales = [...selectedLocales];
                  updatedLocales[index] = newLocale;
                  setSelectedLocales(updatedLocales);
                  const updatedFormValues = [...formValuesList];
                  updatedFormValues[index].localeLanguage = newLocale; 
                  setFormValuesList(updatedFormValues);
                }}
              />
              
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    const updatedButtonActive = [...buttonActiveList];
                    updatedButtonActive[index] = !updatedButtonActive[index];
                    setButtonActiveList(updatedButtonActive);
                  }}
                  className={`${
                    buttonActiveList[index]
                      ? "bg-blue-500 text-white"
                      : "bg-white text-blue-500"
                  } border-2 border-blue-500 rounded-md text-xs w-20 px-2 py-0.5`}
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

export default Editsubsidiary;
