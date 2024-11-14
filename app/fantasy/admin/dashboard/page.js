"use client"
import React, { useEffect, useState } from "react";
import axios from "axios";
import { api } from "@/envfile/api";
import { getCookie } from "cookies-next";
import Listingpage4cols from "@/app/src/components/ListingPageComponents/Listingpage4cols";
import { useDispatch, useSelector } from "react-redux";
import { clearAllEditRecordIds, resetDeleteStatus } from "@/app/src/Redux/Slice/slice";

const dashboard= () => {
  const [token, setToken] = useState("");
  const [dashboards, setDashboards] = useState([]);
  const [page, setPage] = useState(0);
  const [sizePerPage, setSizePerPage] = useState(50);
  const [totalRecord, setTotalRecord] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchValues, setSearchValues] = useState({
    identifier: "",
    shortDescription: "",
    status: ""
  });

  const fetchFilterInputs = useSelector(
    (state) => state.tasks.fetchFilterInput
  );

  const fields = [
    { label: 'Identifier', value: 'identifier' },
    { label: 'Node', value: 'node' },
    { label: 'Theme', value: 'themeColor' },
    { label: 'Template', value: 'template' },
  ];

  useEffect(() => {
    const jwtToken = getCookie("jwtToken");
    if (jwtToken) {
      setToken(jwtToken);
      dispatch(clearAllEditRecordIds());
    }
  }, []);
  const dispatch = useDispatch();
  const deleteStatus = useSelector((state) => state.tasks.deleteStatus);

  useEffect(() => {
    if (token) {
      fetchDashboard();
      //fetchexportUrl();
    }
    if (deleteStatus === "deleted") {
      // Trigger the fetch when deleteStatus is "deleted"
      fetchDashboard();
      dispatch(resetDeleteStatus()); // Reset deleteStatus after the data is fetched
    }
  }, [token, page, sizePerPage, fetchFilterInputs,deleteStatus]);
  console.log(searchValues, "searchValues");




  const fetchDashboard = async () => {
    setLoading(true);
    setError(null); // Reset error before fetching
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const body = {
        page, sizePerPage: sizePerPage === totalRecord ? totalRecord : sizePerPage,
        //searchValues
        dashboards: fetchFilterInputs,
      };
      const response = await axios.post(`${api}/admin/dashboard`, body, { headers });

      setDashboards(response.data.dashboards || []);
      setTotalRecord(response.data.totalRecords);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (err) {
      setError("Error fetching dashboard data");
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


  const addnewroutepath = "/admin/dashboard/add-dashboardmanager"
  const breadscrums = "Admin > dashboard"
  const cuurentpagemodelname = "dashboard"
  const editnewroutepath = "/admin/dashboard/edit-dashboard";
  const aresuremodal = "Delete this Element";
  const aresuremodaltype = "Delete";
  const apiroutepath = "dashboard";
const deleteKeyField = "dashboards";



  // Calculate startRecord and endRecord
  const startRecord = page * sizePerPage + 1;
  const endRecord = Math.min(startRecord + sizePerPage - 1, totalRecord);
  const handleSearchChange = (e, field) => {
    setSearchValues({
      ...searchValues,
      [field.value]: e.target.value,
    });
  };

    
  return (
    <div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <Listingpage4cols
        cuurentpagemodelname={cuurentpagemodelname}
        breadscrums={breadscrums}
        addnewroutepath={addnewroutepath}
        fields={fields} // Pass the field configuration
        data={dashboards}
        currentPage={page}
        sizePerPage={sizePerPage}
        totalPages={totalPages}
        totalRecord={totalRecord}
        onPageChange={handlePageChange}
        onSizeChange={handleSizeChange}
        loading={loading}
        startRecord={startRecord} // Pass calculated startRecord
        endRecord={endRecord} // Pass calculated endRecord
        onSearchChange={handleSearchChange}
        aresuremodal={aresuremodal}
        aresuremodaltype={aresuremodaltype}
        editnewroutepath={editnewroutepath}
        apiroutepath={apiroutepath}
        deleteKeyField={deleteKeyField}

      />
    </div>
  );
};


export default dashboard;
