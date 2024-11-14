"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MdOutlineArrowDropDown, MdOutlineArrowDropUp } from 'react-icons/md';
import axios from 'axios';
import { api } from '@/envfile/api';
import { getCookie } from 'cookies-next';
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setToolkitRoutePath } from '../src/Redux/Slice/slice';
import logo from "../../assests/logo.png";

const Sidebar = () => {
  const router = useRouter();
  const [activeParent, setActiveParent] = useState(null);
  const [activeChild, setActiveChild] = useState(null);
  const [menuData, setMenuData] = useState([]);
  const [token, setToken] = useState("");


  useEffect(() => {
    const jwtToken = getCookie("jwtToken");
    if (jwtToken) {
      setToken(jwtToken);
    }
    // console.log(jwtToken, "from sidenavbar token");
  }, []);
  
  // Call fetchMenuData only when token is set
  useEffect(() => {
    const storedData = localStorage.getItem('menuData');
    if (storedData) {
      setMenuData(JSON.parse(storedData));
    }
  }, []);
  
  // Fetch Menu Data from API
  const fetchMenuData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(api + '/admin/interface/getMenu', { headers });
      setMenuData(response.data);
    } catch (error) {
      console.error('Error fetching menu data', error);
    }
  };
  

  const toggleParent = (parentId) => {
    if (activeParent === parentId) {
      // If the clicked parent is already active, close it
      setActiveParent(null);
    } else {
      // Otherwise, set the clicked parent as active and close others
      setActiveParent(parentId);
    }
    // setActiveParent(activeParent === parentId ? null : parentId);
  };
  const dispatch = useDispatch();

  const handleChildClick = (path, childId) => {
    if (path.includes("toolkit")) {
      // Extract the part after "toolkit/"
      const extractedPath = path.split("toolkit/")[1];
      dispatch(setToolkitRoutePath(extractedPath));
  
      console.log("extractedPath file redirected",extractedPath);
      toast.success(`Dropdown toolkit/${extractedPath} has been selected`,{className:"text-xs"});
      
      // Redirect to the reports path
      router.push(`/fantasy/toolkit/reports`);
    } else {
      router.push(`/fantasy/${path}`);
    }
  
    console.log(`/fantasy/${path}`);
    setActiveChild(childId);
  };
  
  

  return (
    <div className="hidden lg:flex min-w-[15%]" style={{ fontFamily: 'SamsungOne, sans-serif' }}>
      <Toaster />
<div className="bg-black text-white w-full h-screen overflow-y-scroll flex flex-col flex-shrink-0">
<div onClick={()=>{
   router.push(`/fantasy`);
}} className="p-5 flex items-center justify-center cursor-pointer">
          <Image src={logo} alt="Logo" width={150} height={60} priority />
        </div>
        <div className='p-2 gap-3 flex flex-col w-full'>
          {menuData.map((parentNode, parentId) => (
            <div key={parentId} className='gap-3 flex flex-col'>
              <div
                className={`cursor-pointer p-2 flex flex-row w-[100%] text-md justify-between rounded-sm ${activeParent === parentId ? 'bg-[#641212]' : 'bg-[#2b2b2b]'} hover:bg-[#641212]`}
                onClick={() => toggleParent(parentId)}
              >
                <div>{parentNode.identifier}</div>
                <div>{activeParent === parentId ? <MdOutlineArrowDropDown /> : <MdOutlineArrowDropUp />}</div>
              </div>
              {activeParent === parentId && parentNode.childNodes && parentNode.childNodes.length > 0 && (
                <div className="rounded-sm  bg-[#2b2b2b] max-w-54 gap-2 flex flex-col">
                  {parentNode.childNodes.map((childNode, childId) => (
                    <div
                    key={`${parentId}-${childId}`}
                    className={`pl-4 p-2  max-w-54 hover:bg-[#641212]  cursor-pointer ${activeChild === childId ? 'bg-[#641212]' : 'bg-[#2b2b2b]'}`}
                    onClick={() => handleChildClick(childNode.path, childId)}
                    style={{
                      overflow: 'hidden', // Hide overflow content
                      textOverflow: 'ellipsis', // Add ellipsis for overflowed text
                      whiteSpace: 'nowrap', // Prevent the text from wrapping to a new line
                    }}
                  >
                    <div className='max-w-40 overflow-hidden text-sm text-ellipsis whitespace-nowrap'>{childNode.identifier}</div>
                  </div>
                  
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
