"use client"
import React, { useEffect, useState } from "react";
import axios from "axios";
import { api } from "@/envfile/api";
import { getCookie } from "cookies-next";
import Listingpage4cols from "@/app/src/components/ListingPageComponents/Listingpage4cols";
import { useDispatch, useSelector } from "react-redux";
import { clearAllEditRecordIds, resetDeleteStatus } from "@/app/src/Redux/Slice/slice";

const qaCronjob = () => {
  const [token, setToken] = useState("");
  const [qaCronJobs, setQaCronJobs] = useState([]);
  const [page, setPage] = useState(0);
  const [sizePerPage, setSizePerPage] = useState(50);
  const [totalRecord, setTotalRecord] = useState(0);
  const [totalPages, setTotalPages] = useState(1);  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchFilterInputs = useSelector(
    (state) => state.tasks.fetchFilterInput
  );
  const [filterInput, setfilterInput] = useState({});
  const dispatch = useDispatch();
  const deleteStatus = useSelector((state) => state.tasks.deleteStatus);
  const fields = [
    { label: 'Identifier', value: 'identifier' },
    { label: 'Short Description', value: 'shortDescription' },
    { label: 'Cron Expression', value: 'cronExpression' },
    { label: 'Status', value: 'status' },
  ];

  useEffect(() => {
    const jwtToken = getCookie("jwtToken");
    if (jwtToken) {
      setToken(jwtToken);
      dispatch(clearAllEditRecordIds());
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchQaCronjobs();
      
    }
    if (deleteStatus === "deleted") {
      // Trigger the fetch when deleteStatus is "deleted"
      fetchQaCronjobs();
      dispatch(resetDeleteStatus()); // Reset deleteStatus after the data is fetched
    }
  }, [token, page, sizePerPage, fetchFilterInputs,deleteStatus]);
  useEffect(() => {
    setfilterInput(fetchFilterInputs);
  }, [fetchFilterInputs]);

  const fetchQaCronjobs = async () => {
    setLoading(true);
    setError(null); // Reset error before fetching
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const body = { page, sizePerPage: sizePerPage === totalRecord ? totalRecord : sizePerPage,
        cronJobs: fetchFilterInputs,
       };
      const response = await axios.post(`${api}/admin/qaCronJob`, body, { headers });
     
      setQaCronJobs(response.data.cronJobs || []);
      setTotalRecord(response.data.totalRecords);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (err) {
      setError("Error fetching qaCronJob data");
    } 
  };
  

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleSizeChange = (event) => {
    const selectedSize = event.target.value;
    if (selectedSize === "all") {
      setSizePerPage(totalRecord); // Set to totalRecord to fetch all items
    } else {
      setSizePerPage(parseInt(selectedSize)); // Convert string to number
    }
  };
  

  const addnewroutepath = "/admin/qaCronJob/add-qacronjobs"
  const breadscrums = "Admin > qaCronJob"
  const cuurentpagemodelname = "qaCronJob"
  const editnewroutepath = "/admin/qaCronJob/edit-qaCronJob";
  const aresuremodal = "Delete this Element";
  const aresuremodaltype = "Delete";
  const apiroutepath = "qaCronJob";
  const deleteKeyField = "cronJobs";



  // Calculate startRecord and endRecord
  const startRecord = page * sizePerPage + 1;
  const endRecord = Math.min(startRecord + sizePerPage - 1, totalRecord);



  return (
    <div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <Listingpage4cols
      cuurentpagemodelname={cuurentpagemodelname}
      breadscrums={breadscrums}
      addnewroutepath={addnewroutepath}
        fields={fields} // Pass the field configuration
        data={qaCronJobs}
        currentPage={page}
        sizePerPage={sizePerPage}
        totalPages={totalPages}
        totalRecord={totalRecord}
        onPageChange={handlePageChange}
        onSizeChange={handleSizeChange}
        loading={loading}
        startRecord={startRecord} // Pass calculated startRecord
        endRecord={endRecord} // Pass calculated endRecord
        aresuremodal={aresuremodal}
        aresuremodaltype={aresuremodaltype}
        editnewroutepath={editnewroutepath}
        deleteKeyField={deleteKeyField}
        apiroutepath={apiroutepath}
      />
    </div>
  );
};


export default qaCronjob;
