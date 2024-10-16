"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MdOutlineArrowDropDown, MdOutlineArrowDropUp } from 'react-icons/md';
import axios from 'axios';
import { api } from '@/envfile/api';
import { getCookie } from 'cookies-next';

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
    if (token) {
      fetchMenuData();
    }
  }, [token]);
  
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
    setActiveParent(activeParent === parentId ? null : parentId);
  };

  const handleChildClick = (path, childId) => {
    setActiveChild(childId);
    router.push(`/cheil/${path}`);
  };

  return (
    <div className="hidden lg:flex min-w-[15%]" style={{ fontFamily: 'SamsungOne, sans-serif' }}>
<div className="bg-black text-white w-full h-screen overflow-y-scroll flex flex-col flex-shrink-0">
<div className="p-5 flex items-center justify-center">
          <Image src={require("../../assests/logo.png")} alt="Logo" width={150} height={60} />
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
