"use client"
import React, { useEffect, useState } from "react";
import axios from "axios";
import { api } from "@/envfile/api";
import { getCookie } from "cookies-next";
import Listingpage3cols from "@/app/src/components/ListingPageComponents/Listingpage3cols";
import { useSelector } from "react-redux";

const action = () => {
  const [token, setToken] = useState("");
  const [actions, setActions] = useState([]);
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

  const [searchValues, setSearchValues] = useState({
    identifier: "",
    shortDescription: "",
    status: ""
  });

  const fields = [
    { label: 'Identifier', value: 'identifier' },
    { label: 'Short Description', value: 'shortDescription' },
    { label: 'Status', value: 'status' },
  ];

  useEffect(() => {
    const jwtToken = getCookie("jwtToken");
    if (jwtToken) {
      setToken(jwtToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchAction();
    }
  }, [token, page, sizePerPage, fetchFilterInputs]);
  console.log(searchValues, "searchValues");
  useEffect(() => {
    setfilterInput(fetchFilterInputs);
  }, [fetchFilterInputs]);

  const fetchAction = async () => {
    setLoading(true);
    setError(null); // Reset error before fetching
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const body = {
        page, sizePerPage: sizePerPage === totalRecord ? totalRecord : sizePerPage,
        actions: fetchFilterInputs,
        //searchValues
      };
      const response = await axios.post(`${api}/admin/action`, body, { headers });

      setActions(response.data.actions || []);
      setTotalRecord(response.data.totalRecords);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (err) {
      setError("Error fetching action data");
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


  const addnewroutepath = "/pg/action/add-action"
  const editnewroutepath = "/pg/action/edit-action"
  const breadscrums = "Admin > action"
  const cuurentpagemodelname = "action"
  const aresuremodal = "Delete this Element";
  const aresuremodaltype = "Delete";
  const apiroutepath = "action";
  const deleteKeyField = "actionList";

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
      <Listingpage3cols
        cuurentpagemodelname={cuurentpagemodelname}
        breadscrums={breadscrums}
        addnewroutepath={addnewroutepath}
        fields={fields} // Pass the field configuration
        data={actions}
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
        apiroutepath={apiroutepath}
        deleteKeyField={deleteKeyField}
        editnewroutepath={editnewroutepath}
      />
    </div>
  );
};


export default action;
