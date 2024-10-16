"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { IoMdArrowDropdown } from "react-icons/io";
import { FaRegCheckCircle, FaUser } from "react-icons/fa";
import { IoClose, IoExitOutline, IoMenu } from "react-icons/io5";
import { deleteCookie, getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { MdOutlineArrowDropDown, MdOutlineArrowDropUp } from "react-icons/md";
import axios from "axios";
import { api } from "@/envfile/api";

const ResSidebar = () => {
  const [openDropdown, setOpenDropdown] = useState(""); // State to track which dropdown is open
  const [activeLink, setActiveLink] = useState("");
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const router = useRouter();
  const [activeChild, setActiveChild] = useState(null);
  const [activeParent, setActiveParent] = useState(null); // State to track the currently open parent node
  const [menuData, setMenuData] = useState([]);
  const [token, setToken] = useState("");

  // Fetch token and then dropdown items

  useEffect(() => {
    const jwtToken = getCookie("jwtToken");
    if (jwtToken) {
      setToken(jwtToken);
    }
    const storedEmail = localStorage.getItem("username");
    if (storedEmail) {
      setEmail(storedEmail);
    }
    console.log(jwtToken, "from sidenavbar token");
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
      const response = await axios.get(api + "/admin/interface/getMenu", {
        headers,
      });
      console.log(response.data, "from get menu items res nav");
      setMenuData(response.data);
    } catch (error) {
      console.error("Error fetching menu data", error);
    }
  };

  // Toggle the active parent node
  const toggleParent = (parentId) => {
    if (activeParent === parentId) {
      // If the clicked parent is already active, close it
      setActiveParent(null);
    } else {
      // Otherwise, set the clicked parent as active and close others
      setActiveParent(parentId);
    }
  };

  const handleLogout = () => {
    deleteCookie("jwtToken");
    window.location.reload();
  };

  const handleChildClick = (path, childId) => {
    setActiveChild(childId);
    router.push(`/cheil/${path}`);
    setShow(false);
  };

  return (
    <div
      className="flex w-[100%] mt-0 justify-end items-end flex-col  lg:hidden"
      style={{ fontFamily: "SamsungOne, sans-serif" }}
    >
      <div className="flex justify-end items-end flex-col bg-black  lg:hidden relative w-full">
        <div
          className="bg-black p-2 text-white relative w-full flex flex-row justify-between items-center"
          style={{ fontFamily: "SamsungOne, sans-serif" }}
        >
          <div className=" flex items-center justify-center">
            <Image
              src={require("../../assests/logo.png")}
              alt="Logo"
              width={90}
              height={45}
            />
          </div>
          <button
            onClick={() => {
              setShow(!show);
            }}
          >
            {" "}
            {show ? <IoClose size={20} /> : <IoMenu size={20} />}
          </button>
        </div>
        {show && (
          <nav className=" w-[55%] md:w-[35%] bg-black top-12 p-2 right-0 min-h-fit z-50 rounded-bl-md absolute bottom-0 animate__animated animate__fadeInRight">
            <div className="flex flex-col gap-2 p-2">
              <div className=" flex flex-row items-center justify-center w-full gap-3">
                <div className="flex items-center justify-center w-8 h-8 bg-white rounded-full hover:cursor-pointer">
                  <FaUser className="text-black " size={20} />
                </div>
                <div className="text-white text-sm">{email}</div>
              </div>
              <div className="flex flex-row gap-4 w-full justify-between items-center">
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center p-2 w-28 bg-red-700 transition-all  text-white rounded-md"
                >
                  <div className="text-xs text-white">Logout</div>
                  <IoExitOutline className="ml-2 text-md text-white" />
                </button>
                <button className="flex items-center text-xs justify-center p-2 bg-white w-28 text-white rounded-md">
                  <div className="text-black">Profile</div>
                </button>
              </div>
            </div>
            <div className="p-2 gap-3 flex flex-col">
              {menuData.map((parentNode, parentId) => (
                <div key={parentId} className=" gap-3 flex flex-col ">
                  {/* Render Parent Node */}
                  <div
                    className={` cursor-pointer p-2 flex flex-row w-full justify-between rounded-sm ${
                      activeParent === parentId
                        ? "bg-[#641212]"
                        : "bg-[#2b2b2b]"
                    } hover:bg-[#641212]`}
                    onClick={() => toggleParent(parentId)} // Toggle child visibility on click
                  >
                    <div className="text-white"> {parentNode.identifier}</div>
                    <div>
                      {activeParent === parentId ? (
                        <MdOutlineArrowDropDown className="text-white" />
                      ) : (
                        <MdOutlineArrowDropUp className="text-white" />
                      )}
                    </div>
                  </div>

                  {/* Render Child Nodes if this parent is the active one */}
                  {activeParent === parentId &&
                    parentNode.childNodes &&
                    parentNode.childNodes.length > 0 && (
                      <div className="rounded-sm animate__animated animate__fadeIn bg-[#2b2b2b]  gap-2 flex flex-col">
                        {parentNode.childNodes.map((childNode, childId) => (
                          <div
                            onClick={() =>
                              handleChildClick(childNode.path, childId)
                            }
                            key={`${parentId}-${childId}`}
                            className={`pl-4 p-2 text-white hover:bg-[#641212] ${
                              activeChild === childId
                                ? "bg-[#641212]"
                                : "bg-[#2b2b2b]"
                            }`}
                          >
                            {childNode.identifier}
                          </div>
                        ))}
                      </div>
                    )}
                </div>
              ))}
            </div>
          </nav>
        )}
      </div>
    </div>
  );
};

export default ResSidebar;
