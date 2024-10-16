"use client"
import { api } from '@/envfile/api'
import { TextField } from '@mui/material'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const ResetPassword = () => {
    const router = useRouter();
    const [inputfield, setInputfield] = useState({ email: "" });
    const { email } = inputfield;

    const handleInputChange = (e) => {
        setInputfield({
            ...inputfield,
            [e.target.name]: e.target.value
        });
    };

    const handlesubmit = async () => {
      const response  = await axios.post(api + "/forgotpassword",{
        email:email
      });
      console.log(response,"email response");
    }

    return (
        <div className='flex flex-row min-h-screen justify-center items-start p-1 mt-10'>
            <div className="flex flex-col gap-5 w-[100%] md:w-[70%] lg:w-[40%] justify-center items-center rounded-lg">
                <div className='text-lg font-semibold'>Enter Email to Reset Password</div>

                <div className='w-[80%]'>
                    <TextField
                        name="email"
                        value={email}
                        onChange={handleInputChange}
                        label="Username/Email"
                        id="outlined-size-small"
                        size="small"
                        className='w-full text-sm border-2'
                    />
                </div>

                <button onClick={handlesubmit} className='w-[80%] text-sm bg-black p-2 rounded-md'>
                    <div className='text-white'>Send Link</div>
                </button>

                <div className='text-black text-xs font-semibold'>
                    Back to <span onClick={() => router.push("/login")} className='underline cursor-pointer hover:text-gray-400'>Signin</span>
                </div>

                <div className="mt-4 gap-2 flex flex-col text-center text-xs">
                    <div> © Cheil 2022</div>
                    <div>Contact hybris.sup@cheil.com</div>
                </div>
            </div>
        </div>
    )
}

export default ResetPassword;
