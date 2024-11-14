"use client"
import React, { useEffect, useState } from "react";
import axios from "axios";
import { api } from "@/envfile/api";
import { getCookie } from "cookies-next";
import Listingpage3cols from "@/app/src/components/ListingPageComponents/Listingpage3cols";
import { useDispatch, useSelector } from "react-redux";
import { clearAllEditRecordIds, resetDeleteStatus } from "@/app/src/Redux/Slice/slice";

const Role = () => {
  const [token, setToken] = useState("");
  const [roles, setRoles] = useState([]);
  const [page, setPage] = useState(0);
  const [sizePerPage, setSizePerPage] = useState(50);
  const [totalRecord, setTotalRecord] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const fetchFilterInputs = useSelector(
    (state) => state.tasks.fetchFilterInput
  );
  const [filterInput, setfilterInput] = useState({});
  const fields = [
    { label: 'Identifier', value: 'identifier' },
    { label: 'Short Description', value: 'shortDescription' },
    { label: 'Status', value: 'status' },
  ];

  useEffect(() => {
    const jwtToken = getCookie("jwtToken");
    if (jwtToken) {
      setToken(jwtToken);
      dispatch(clearAllEditRecordIds());

    }
  }, []);
  const deleteStatus = useSelector((state) => state.tasks.deleteStatus);

  useEffect(() => {
    if (token) {
      fetchRole();
    }
    if (deleteStatus === "deleted") {
      // Trigger the fetch when deleteStatus is "deleted"
      fetchRole();
      dispatch(resetDeleteStatus()); // Reset deleteStatus after the data is fetched
    }
  }, [token, page, sizePerPage,deleteStatus,fetchFilterInputs]);
  useEffect(() => {
    setfilterInput(fetchFilterInputs);
  }, [fetchFilterInputs]);

  const fetchRole = async () => {
    setLoading(true);
    setError(null); // Reset error before fetching
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const body = { page, 
        sizePerPage: sizePerPage === totalRecord ? totalRecord : sizePerPage,
      roles:fetchFilterInputs };
      const response = await axios.post(`${api}/admin/role`, body, { headers });
  
      setRoles(response.data.roles || []);
      setTotalRecord(response.data.totalRecords);
      setTotalPages(response.data.totalPages);
      console.log(response.data.roles,"response.data.nodes");
    } catch (err) {
      setError("Error fetching role data");
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
      setSizePerPage(totalRecord); // Set to totalRecord to fetch all items
    } else {
      setSizePerPage(parseInt(selectedSize)); // Convert string to number
    }
  };
  

  const addnewroutepath = "/roleandusers/role/add-role"
  const breadscrums = "Role & User > Role"
  const cuurentpagemodelname = "Role"
  const editnewroutepath = "/roleandusers/role/edit-role"
  const aresuremodal = "Delete this Element";
 const aresuremodaltype = "Delete";
 const apiroutepath = "role";
 const deleteKeyField = "roles";


  // Calculate startRecord and endRecord
  const startRecord = page * sizePerPage + 1;
  const endRecord = Math.min(startRecord + sizePerPage - 1, totalRecord);

  return (
    <div>
      {error && <div className="text-red-500">{error}</div>}
      <Listingpage3cols
      cuurentpagemodelname={cuurentpagemodelname}
      breadscrums={breadscrums}
      addnewroutepath={addnewroutepath}
        fields={fields} // Pass the field configuration
        data={roles}
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
        apiroutepath={apiroutepath}
        deleteKeyField={deleteKeyField}
        editnewroutepath={editnewroutepath}
      />
    </div>
  );
};


export default Role;
