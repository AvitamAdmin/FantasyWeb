"use client";
import React, { useState, useEffect } from 'react';
import { FaPlay } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { LuCopyPlus } from 'react-icons/lu';
import { AiOutlineUserAdd } from 'react-icons/ai';
import { TbClockPlus, TbClockEdit } from 'react-icons/tb';
import Link from 'next/link';
import { Tooltip } from 'react-tooltip';
import { IconButton } from '@mui/material';
import { MdOutlineEdit } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { clearAllEditRecordIds } from '../../Redux/Slice/slice';

const AddNewPageButtons = ({ children, handleSaveClick, handleRunClick, email ,breadscrums,pagename}) => {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState('');

  const dispatch = useDispatch();
  // Function to format the date and time to local time
  const formatDate = (date) => {
    return date.toLocaleString('en-GB', { hour12: true }); // This will give you date and time in local format (24-hour clock)
  };

  useEffect(() => {
    // Set the current time when the component mounts
    const now = new Date();
    setCurrentTime(formatDate(now));

    // Optionally, you can set an interval to keep updating the time
    const interval = setInterval(() => {
      const updatedTime = new Date();
      setCurrentTime(formatDate(updatedTime));
    }, 1000); // Update every second

    // Cleanup the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col w-full min-h-screen gap-5" style={{ fontFamily: 'SamsungOne, sans-serif' }}>
      {/* Top Bar with Icons */}
      <div className="flex justify-end items-center bg-white p-2 gap-5">
        <div className="flex flex-row gap-1 items-center">
          <AiOutlineUserAdd size={18} />
          <p>{email}</p>
        </div>
        <div className="flex flex-row gap-1 items-center">
          <TbClockPlus />
          <p>{currentTime}</p> {/* Display current date and time */}
        </div>
        
      </div>

      <div className='bg-gray-200 flex flex-col pb-5'>
        <div className="flex justify-between items-center p-4">
          <div>
          <h2 className="text-lg font-semibold">{pagename}</h2>
            <div className="flex items-center gap-1 text-xs">
              <span>{breadscrums}</span>
             
            </div>
          </div>
          <div className="flex gap-4 items-center">
            {/* <div className='border border-solid border-[#1581ED] rounded-md text-white bg-[#1581ED] h-8 px-2 items-center flex-row flex text-center justify-center'>
              <LuCopyPlus />
            </div>
            <button
              className="border p-2 rounded-md text-xs w-[70px] bg-[#1581ED] text-white text-center flex flex-row gap-3 items-center justify-center"
              onClick={handleRunClick}
            >
              <FaPlay /> 
              <div>Run</div>
            </button> */}
            <button
  onClick={() => {
    router.back(); // Correctly invoking the router.back() method
    dispatch(clearAllEditRecordIds());
  }}
  className="border p-2 rounded-md text-xs w-[70px] bg-[#2b2b2b] text-white text-center"
>
  Cancel
</button>

            <button
              className="border p-2 rounded-md text-xs w-[70px] text-white bg-[#cc0001] text-center"
              onClick={handleSaveClick}
            >
              <div>Save</div>
            </button>
          </div>
        </div>

        {children}

      </div>
    </div>
  );
};

export default AddNewPageButtons;
