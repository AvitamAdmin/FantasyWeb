"use client";
import React, { useEffect, useState } from "react";
import { api } from "@/envfile/api";
import {
  CircularProgress,
  InputLabel,
  MenuItem,
  TextField,
  InputAdornment,
  IconButton,
  FormControl,
  Input,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { getCookie } from "cookies-next";
import Image from "next/image";
import Link from "next/link";
import SelectRole from "@/app/src/components/dropdown/Role";
import SingleSelectSubsidiary from "@/app/src/components/dropdown/Subsidiary";
import logo from "../../../assests/Logoblack.png";
import MultiSelectRole from "@/app/src/components/multiSelectDropdown/MultiSelectRole";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";


function Signup() {
  const [selectedSubsidiary, setSelectedSubsidiary] = useState([]);
  const [selectedRole, setSelectedRole] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialload, setInitialLoad] = useState(true);
  const router = useRouter();
  const [inputFields, setInputFields] = useState({
    username: "",
    password: "",
    referredBy: "",
    passwordConfirm: "",
    mobilenumber: "",
    dob:"",
    gender: '',
    language: '',
  });
  const { username, password, passwordConfirm, mobilenumber, referredBy,dob,language,gender } =
    inputFields;
  const [token, setToken] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const jwtToken = getCookie("jwtToken");
    if (jwtToken) {
      setToken(jwtToken);
    }
  }, []);

  const handleSubmit = async () => {
    setErrorMessage("");

    // Validate form fields
    if (!username) {
      setErrorMessage("Username is required.");
      return;
    }
    if (!password) {
      setErrorMessage("Password is required.");
      return;
    }
    if (!passwordConfirm) {
      setErrorMessage("Password confirmation is required.");
      return;
    }
    if (password !== passwordConfirm) {
      setErrorMessage("Passwords do not match.");
      return;
    }
    if (!mobilenumber) {
      setErrorMessage("mobilenumber is required.");
      return;
    }
    if (!dob) {
      setErrorMessage("DOB is required.");
      return;
    }
    if (!language) {
      setErrorMessage("DOB is required.");
      return;
    }
    if (!gender) {
      setErrorMessage("DOB is required.");
      return;
    }
    if (!selectedRole) {
      setErrorMessage("Role is required.");
      return;
    }

    if (password !== passwordConfirm) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const requestData = { user: {
        email:username,
        password,
        passwordConfirm,
        mobileNumber:mobilenumber,
        referredBy,
        roles: selectedRole.map(item => ({
          recordId: item.recordId
      })),
        dateOfBirth:dob,
        gender:gender,
        language:language,
      }};
      console.log(requestData, "req body");

      const response = await axios.post(api + "/register", requestData);
      console.log(response.data, "registration response");
      if(response.data.success == true){
        toast.success(`User Register Successfully`,{className:"text-sm"});
        setTimeout(() => {
        router.push("/login");
  
      }, 2000);
      }else{
      toast.error(`User already Registred`,{className:"text-sm"});
      }
      
      setLoading(false);
    } catch (error) {
      console.error(error, "registration error");
      setErrorMessage("Registration failed. Please try again.");
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
console.log(selectedRole,"selected selectedRole");
  return (
    <div className="flex flex-col min-h-screen justify-start lg:justify-center items-center p-1 pt-5 lg:pt-2 md:p-5">
      <Toaster />
      <div className="mb-5 flex justify-center w-48 h-20">
        <Image priority
          src={logo}
          alt="Zero-in Logo"
        />
      </div>

      <div className="flex flex-col gap-3 w-[100%] md:w-[90%] lg:w-[40%] justify-center items-center rounded-lg p-8">
        <div className="text-lg font-semibold flex justify-start w-full flex-col text-start">
          Register
        </div>
        <div className="flex items-center rounded-md w-full">
          <TextField
            value={username}
            onChange={(e) =>
              setInputFields({ ...inputFields, username: e.target.value })
            }
            label="Corporate email"
            variant="standard"
            className="text-xs w-full"
          />
        </div>

        {/* Password Field with Visibility Toggle */}
        <div className="flex flex-col md:flex-row gap-3 md:gap-20 w-[100%]">
          <FormControl className="flex flex-col w-full md:w-[45%]" variant="standard">
            <InputLabel htmlFor="password">Password</InputLabel>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) =>
                setInputFields({ ...inputFields, password: e.target.value })
              }
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>

          {/* Confirm Password Field with Visibility Toggle */}
          <FormControl className="flex flex-col w-full md:w-[45%]" variant="standard">
            <InputLabel htmlFor="confirm-password">Confirm Password</InputLabel>
            <Input
              id="confirm-password"
              type={showPassword ? "text" : "password"}
              value={passwordConfirm}
              onChange={(e) =>
                setInputFields({
                  ...inputFields,
                  passwordConfirm: e.target.value,
                })
              }
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        </div>

        <div className="flex flex-col w-full ">
          <TextField type="number"
            value={mobilenumber}
            onChange={(e) =>
              setInputFields({ ...inputFields, mobilenumber: e.target.value })
            }
            label="Mobile Number"
            variant="standard"
            className="text-xs w-[100%]"
          />
        </div>
        <div className="flex flex-col w-full mt-2">
          <TextField type="date"
            value={dob}
            onChange={(e) =>
              setInputFields({ ...inputFields, dob: e.target.value })
            }
            variant="standard"
            className="text-xs w-[100%]"
          />
        </div>
        <div className="flex flex-col w-full mt-2">
        <TextField
          select
          label="Gender"
          value={gender}
          onChange={(e) => setInputFields({ ...inputFields, gender: e.target.value })}
          variant="standard"
          className="text-xs w-[100%]"
        >
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </TextField>
      </div>
      <div className="flex flex-col w-full mt-2">
        <TextField
          select
          label="Select Language"
          value={inputFields.language}
          onChange={(e) => setInputFields({ ...inputFields, language: e.target.value })}
          variant="standard"
          className="text-xs w-[100%]"
        >
          <MenuItem value="English">English</MenuItem>
          <MenuItem value="Spanish">Spanish</MenuItem>
          <MenuItem value="French">French</MenuItem>
          <MenuItem value="German">German</MenuItem>
          <MenuItem value="Mandarin">Mandarin</MenuItem>
        </TextField>
      </div>

        <div className="flex flex-col w-full gap-3 ">
          <MultiSelectRole
          initialload={initialload}
          selectedRoles={selectedRole}
            setSelectedRoles={setSelectedRole}
          />
        </div>

        <div className="flex flex-col w-full gap-3">
          <TextField
            value={referredBy}
            onChange={(e) =>
              setInputFields({ ...inputFields, referredBy: e.target.value })
            }
            label="Referred By"
            variant="standard"
            className="text-xs w-[100%]"
          />
        </div>

        <div className="text-xs text-center mt-2">
          (The referrer is your department head. He/she will receive the confirmation
          email and approve your access.)
        </div>

        <div className="text-xs text-center mt-2">
          By clicking Submit, I agree to the Terms and Conditions of Zero-in Platform
          usage and the Privacy Statement.
        </div>

        <div className="flex flex-col w-full mt-4">
          {errorMessage && (
            <div className="text-red-500 text-sm mb-2">{errorMessage}</div>
          )}
          {loading ? (
            <div
              onClick={handleSubmit}
              className="bg-black cursor-pointer px-5 py-3.5 w-full flex flex-row text-white rounded-md text-xl text-center justify-center"
            >
              <CircularProgress size={28} color="inherit" />
            </div>
          ) : (
            <div
              onClick={handleSubmit}
              className="h-14 bg-black cursor-pointer px-5 py-2 text-white rounded-md text-xl text-center"
            >
              Submit
            </div>
          )}
        </div>

        <div className="mt-4">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-black border-b-2 border-solid border-black"
          >
            Sign in
          </Link>
        </div>
      </div>

      <div className="text-white mt-8 text-center text-sm">
        © fantasy 2022
        <div>Contact hybris.sup@Impact11.com</div>
      </div>
    </div>
  );
}

export default Signup;
