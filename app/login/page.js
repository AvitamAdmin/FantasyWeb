"use client";
import { api } from "@/envfile/api";
import {
  CircularProgress,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  TextField,
} from "@mui/material";
import axios from "axios";
import { getCookie, setCookie } from "cookies-next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { useDispatch } from "react-redux";
import { setToken } from "../src/Redux/Slice/slice";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
 const dispatch= useDispatch()
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const [inputFields, setInputFields] = useState({
    username: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const { username, password } = inputFields;

  useEffect(() => {
    const token = getCookie("jwtToken");
    if (!token) {
      router.push("/login");
    } else {
      dispatch(setToken(token));
      router.push("/cheil");
    }
  }, [router]);

  const handlesubmit = async (event) => {
    event.preventDefault();

    if (!username) {
      setErrorMessage("Username is required.");
      return;
    }

    if (!password) {
      setErrorMessage("Password is required.");
      return;
    }

    try {
      console.log(inputFields,"login credentials");
      setLoading(true);
      const response = await axios.post(api + "/api/authenticate", {
        username,
        password,
      });

      if (response.data.jwtToken) {
        localStorage.setItem("username", username);
        setCookie("jwtToken", response.data.jwtToken);
        router.push("/cheil");
        setLoading(false);
      } else {
        setErrorMessage("User not found check your credentials");
      }
      if (response.data) {
       
        setLoading(false);
      } else {
        setErrorMessage("User not found check your credentials");
      }
    } catch (error) {
      console.log(error, "user login error");
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <>
      <div
        className="bg-white flex flex-col min-h-screen justify-start lg:justify-center items-center p-1 pt-5 lg:pt-0 md:p-5"
        style={{ fontFamily: "SamsungOne, sans-serif" }}
      >
        <div className="mb-5 flex justify-center w-48 h-20">
          <Image src={require("../../assests/cheil.png")} alt="Zero-in Logo" />
        </div>

        <div className="flex flex-col gap-3 w-[100%] md:w-[70%] lg:w-[30%] justify-center items-center rounded-lg p-8">
          <div className="text-lg font-semibold flex justify-start w-full flex-col text-start">
            Login
          </div>
          <div className="flex flex-col w-full gap-3">
            <TextField
              label="User name"
              variant="standard"
              className="text-xs w-[100%]"
              value={username}
              onChange={(e) =>
                setInputFields({ ...inputFields, username: e.target.value })
              }
            />
          </div>
          <div className="flex flex-col w-full gap-5">
            <div className="flex items-center w-full">
              <FormControl variant="standard" className="w-[100%]">
                <InputLabel htmlFor="standard-adornment-password">
                  Password
                </InputLabel>
                <Input
                  value={password}
                  onChange={(e) =>
                    setInputFields({ ...inputFields, password: e.target.value })
                  }
                  id="standard-adornment-password"
                  type={showPassword ? "text" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        className="text-lg"
                      >
                        {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
            </div>
          </div>

          <div className="flex items-center w-full gap-2">
            <input type="checkbox" />
            <label>Remember me</label>
          </div>

          <div className="flex flex-col w-full mt-4">
            {errorMessage && (
              <div className="text-red-500 text-sm mb-2">{errorMessage}</div>
            )}
            {loading ? (
              <button
                onClick={handlesubmit}
                className="bg-black cursor-pointer px-5 py-2 w-full flex flex-row text-white rounded-md text-xl text-center justify-center"
              >
                <CircularProgress size={28} color="inherit" />
              </button>
            ) : (
              <button
                onClick={handlesubmit}
                className="bg-black cursor-pointer px-5 py-2 w-full flex flex-row text-white rounded-md text-xl text-center justify-center"
              >
                Login
              </button>
            )}
          </div>

          <div>
            <Link
             href="/login/resetpassword"
              className="hover:text-gray-400 mt-2 cursor-pointer transition-all"
            >
              Reset the Password
            </Link>
          </div>

          <div className="flex items-center mt-4 w-full">
            <div className="flex-grow border-b border-gray-500"></div>
            <span className="mx-2 text-gray-500">Or</span>
            <div className="flex-grow border-b border-gray-500"></div>
          </div>

          <div className="flex flex-col w-full mt-4">
            <Link
              href="/login/signup"
              className="bg-black cursor-pointer px-5 py-2 text-white rounded-md text-xl text-center"
            >
              Register
            </Link>
          </div>

          <div className="mt-4 text-center text-sm">
            © Cheil 2022
            <div>Contact hybris.sup@cheil.com</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
