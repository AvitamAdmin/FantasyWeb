"use client"
import React, { useEffect, useState } from "react";
import axios from "axios";
import { api } from "@/envfile/api";
import { getCookie } from "cookies-next";
import Listingpage5cols from "@/app/src/components/ListingPageComponents/Listingpage5cols";
import { useDispatch, useSelector } from "react-redux";
import { clearAllEditRecordIds, resetDeleteStatus } from "@/app/src/Redux/Slice/slice";

const scheduler = () => {
  const [token, setToken] = useState("");
  const [schedulers, setSchedulers] = useState([]);
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
    { label: 'Scheduler', value: 'cronId' },
    { label: 'CronExpression ', value: 'cronExpression' },
    { label: 'Mapping ', value: 'mapping' },
    { label: 'Subsidiary ', value: 'subsidiary' },
    { label: 'Status ', value: 'status' },
    // { label: 'Action ', value: 'cronExpression' },

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
      fetchSchedulers();
    }
    
if (deleteStatus === "deleted") {
  // Trigger the fetch when deleteStatus is "deleted"
  fetchSchedulers();
  dispatch(resetDeleteStatus()); // Reset deleteStatus after the data is fetched
}
  }, [token, page, sizePerPage, fetchFilterInputs,deleteStatus]);
  useEffect(() => {
    setfilterInput(fetchFilterInputs);
  }, [fetchFilterInputs]);

  const fetchSchedulers = async () => {
    setLoading(true);
    setError(null); // Reset error before fetching
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const body = { page, sizePerPage : sizePerPage === totalRecord ? totalRecord : sizePerPage,
        schedulerJobs: fetchFilterInputs,
       };
      const response = await axios.post(`${api}/admin/scheduler`, body, { headers });

      setSchedulers(response.data.schedulerJobs || []);
      setTotalRecord(response.data.totalRecords);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError("Error fetching Scheduler data");
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

  // Calculate startRecord and endRecord
  const startRecord = page * sizePerPage + 1;
  const endRecord = Math.min(startRecord + sizePerPage - 1, totalRecord);
  const addnewroutepath = "/admin/scheduler/add-toolkitCronjobs"
  const breadscrums = "Admin > Scheduler"
  const cuurentpagemodelname = "Scheduler"
  const editnewroutepath = "/admin/scheduler/edit-scheduler";
  const aresuremodal = "Delete this Element";
  const aresuremodaltype = "Delete";
  const apiroutepath = "scheduler";
  const deleteKeyField = "schedulerJobs";


 

  return (
    <div>
      {error && <div className="text-red-500">{error}</div>}
      <Listingpage5cols
      addnewroutepath={addnewroutepath}
      breadscrums={breadscrums}
      cuurentpagemodelname={cuurentpagemodelname}
        fields={fields} // Pass the field configuration
        data={schedulers}
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


export default scheduler;
