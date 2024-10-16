"use client";
import React, { useState, useRef, useEffect } from "react";
import { CircularProgress, TextField } from "@mui/material";
import AddNewPageButtons from "@/app/src/components/AddNewPageButtons/AddNewPageButtons";
import { useRouter } from "next/navigation";
import axios from "axios";
import { api } from "@/envfile/api";
import { getCookie } from "cookies-next";
import { useDispatch, useSelector } from "react-redux";
import * as animationData from "../../../../../assests/LoadingAnimation.json";
import Lottie from "react-lottie";

const EditMedia = () => {
  const [isButtonActive, setIsButtonActive] = useState(false);
  const fileInputRef = useRef(null);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [editInputfields, setEditInputfields] = useState([]);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState('');
  const router = useRouter();
  const selectedID = useSelector((state) => state.tasks.multipleEditRecordId);
  const [formValues, setFormValues] = useState({
    identifier: "",
  });
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const dispatch = useDispatch();

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    console.log("Selected file:", file);
  };

  const handleFetchData = async (jwtToken) => {
    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${jwtToken}` };
      const body = { medias: selectedID.map((id) => ({ recordId: id })) };
      const response = await axios.post(`${api}/admin/media/getedits`, body, {
        headers,
      });
      setLoading(false);

      const medias = response.data.medias[0];
      setEditInputfields(medias);

      if (medias) {
        setFormValues({ identifier: medias.identifier || "" });
        setIsButtonActive(medias.status || false);
      }
    } catch (err) {
      setError("Error fetching media data: " + err.message);
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveClick = async () => {
    if (selectedID.length === 0) {
      setError("No records selected.");
      return;
    }

    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${token}` };
      const body = {
        medias: selectedID.map((id) => ({
          recordId: id,
          identifier: formValues.identifier,
          status: isButtonActive,
        })),
      };

      const response = await axios.post(`${api}/admin/media/edit`, body, {
        headers,
      });
      console.log(response.data, "response from API");
      router.push("/cheil/data/media");
    } catch (err) {
      setError("Error saving media data: " + err.message);
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const breadscrums = "Admin > Media";
  const pagename = "Edit Media";

  return (
    <AddNewPageButtons
      pagename={pagename}
      breadscrums={breadscrums}
      handleSaveClick={handleSaveClick}
      email={email}
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
              editInputfields < 1 ? (
                <div className="w-full flex flex-col  h-40 justify-center items-center">
                <div className="opacity-35 ">
                  <Lottie options={defaultOptions} height={100} width={100} />
                </div>
                <div>No data data found...</div>
              </div>
              ) : (
                <>
                 <div className="p-2">
                 <div
        className="flex flex-col w-full p-4 min-h-screen gap-5"
        style={{ fontFamily: "SamsungOne, sans-serif" }}
      >
        <div className="flex flex-col bg-gray-200 rounded-md shadow">
          <div className="bg-white p-4 rounded-md shadow-md">
            <div className="grid grid-cols-3 gap-4 mb-4 items-center justify-center">
              <TextField
                label="Identifier"
                variant="standard"
                name="identifier"
                value={formValues.identifier}
                onChange={handleInputChange}
              />

              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />

              <button
                className="flex items-center justify-center mt-4 p-2 rounded-md bg-black text-white w-[110px] h-[30px]"
                onClick={handleFileInputClick}
              >
                Choose file
              </button>

              <div className="flex gap-4 items-center justify-end">
                <button
                  onClick={() => setIsButtonActive(!isButtonActive)}
                  className={
                    isButtonActive
                      ? "bg-[#1581ed] border-2 border-solid border-[#1581ed] rounded-md text-white text-xs px-2 py-0.5 w-[80px]"
                      : "bg-[#fff] border-2 border-solid border-gray-400 rounded-md text-gray-700 text-xs px-2 py-0.5 w-[80px]"
                  }
                >
                  {isButtonActive ? "Active" : "Inactive"}
                </button>
              </div>
            </div>
          </div>
        </div>
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

export default EditMedia;
