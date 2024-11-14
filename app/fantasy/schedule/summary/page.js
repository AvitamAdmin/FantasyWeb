"use client";

import React, { useState, useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { IoClose, IoSearch } from "react-icons/io5";
import {
  MdFileUpload,
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
  MdOutlineKeyboardDoubleArrowLeft,
  MdOutlineKeyboardDoubleArrowRight,
} from "react-icons/md";
import { AiFillPlusCircle, AiFillMinusCircle } from "react-icons/ai";
import axios from "axios";
import { api } from "@/envfile/api";
import { getCookie } from "cookies-next";
import Listingpage5cols from "@/app/src/components/ListingPageComponents/Listingpage5cols";

function Summary() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState("");
  const [SummaryData, setSummaryData] = useState([]);
  const [page, setPage] = useState(0);  
  const [sizePerPage, setSizePerPage] = useState(50);
  const [totalRecord, setTotalRecord] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fields = [
    { label: 'Last Run-Time', value: 'JobTime' },
    { label: 'Subsidiary ', value: 'subsidiary' },
    { label: 'Schedulers ', value: 'scheduler' },
    { label: 'Result ', value: 'cronStatus' },
    { label: 'Issused cases ', value: 'processedSkus' },


  ];

  useEffect(() => {
    const jwtToken = getCookie("jwtToken");
    if (jwtToken) {
      setToken(jwtToken);
      fetchSummary(jwtToken);
    }
  }, []);

  const fetchSummary = async (jwtToken) => {
    setLoading(true);
    setError(null); // Reset error before fetching
    try {
      const headers = { Authorization: `Bearer ${jwtToken}` };
      console.log("token" + token);
      const body = {
        page: page,
        sizePerPage: sizePerPage,

      };
      const response = await axios.post(`${api}/schedule/summary`, body, {
        headers,
      });
      setSummaryData(response.data.cronHistories || []);
      setTotalRecord(response.data.totalRecords);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError("Error fetching dropdown data", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleSizeChange = (event) => {
    const selectedSize = event.target.value;
    if (selectedSize === "all") {
      setSizePerPage("all"); // Example: set a high number to show all items
    } else {
      setSizePerPage(parseInt(selectedSize)); // Convert string to number
    }
  };

  const startRecord = page * sizePerPage + 1;
  const endRecord = Math.min(startRecord + sizePerPage - 1, totalRecord);
  const cuurentpagemodelname = "Schedule"
  const apiroutepath = "schedule";


  return (
    <div className="p-4" style={{ fontFamily: "SamsungOne, sans-serif" }}>
      <div className="bg-gray-200 p-2 mt-4 rounded-md">

        <div className="p-1 rounded-md flex flex-row justify-between items-center w-full">
          <div className="flex flex-row gap-1">
            <span className="text-xs font-bold">schedule</span>
            <span className="text-xs font-bold">{">"}</span>
            <span className="text-xs font-bold">Summary</span>
          </div>
        </div>

        <div>
          {error && <div className="text-red-500">{error}</div>}
          <Listingpage5cols
            cuurentpagemodelname={cuurentpagemodelname}
            fields={fields} // Pass the field configuration
            data={SummaryData}
            currentPage={page}
            sizePerPage={sizePerPage}
            totalPages={totalPages}
            totalRecord={totalRecord}
            onPageChange={handlePageChange}
            onSizeChange={handleSizeChange}
            loading={loading}
            startRecord={startRecord} // Pass calculated startRecord
            endRecord={endRecord} // Pass calculated endRecord
            apiroutepath={apiroutepath}
          />
        </div>

       </div>
       </div>
  );
}

export default Summary;
