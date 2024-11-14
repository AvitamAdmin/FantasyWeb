"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { api } from "@/envfile/api";
import { getCookie } from "cookies-next";
import Listingpage3cols from "@/app/src/components/ListingPageComponents/Listingpage3cols";
import { useDispatch, useSelector } from "react-redux";
import { clearAllEditRecordIds, resetDeleteStatus } from "@/app/src/Redux/Slice/slice";

const subsidiary = () => {
 
  const [token, setToken] = useState("");
  const [subsidiarys, setSubsidiarys] = useState([]);
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
  const [searchValues, setSearchValues] = useState({
    username: "",
    shortDescription: "",
    status: ""
  });

  const fields = [
    { label: "Identifier", value: "identifier" },
    { label: "Short Description", value: "shortDescription" },
    { label: "Status", value: "status" }
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
      fetchSubsidiary(); // Fetch data on component mount
      //fetchexportUrl(); // Fetch export URL
    }
    if (deleteStatus === "deleted") {
      // Trigger the fetch when deleteStatus is "deleted"
      fetchSubsidiary();
      dispatch(resetDeleteStatus()); // Reset deleteStatus after the data is fetched
    }


  }, [token, page, sizePerPage, fetchFilterInputs,deleteStatus]);
  console.log(searchValues, "searchValues");

  useEffect(() => {
    setfilterInput(fetchFilterInputs);
  }, [fetchFilterInputs]);


  const fetchSubsidiary = async () => {
    setLoading(true);
    setError(null); // Reset error before fetching
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const body = { page, sizePerPage: sizePerPage === totalRecord ? totalRecord : sizePerPage,
        subsidiaries: fetchFilterInputs,
       };
      const response = await axios.post(`${api}/admin/subsidiary`, body, { headers });
      
      console.log("Subsidiary data fetched:", response.data.subsidiaries);
  
      setSubsidiarys(response.data.subsidiaries || []);
      setTotalRecord(response.data.totalRecords);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (err) {
      setError("Error fetching subsidiary data");
      console.error(err);
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

  const handleSearchChange = (e, field) => {
    setSearchValues({
      ...searchValues,
      [field.value]: e.target.value
    });
  };

  const addnewroutepath = "/data/subsidiary/add-subsidiary";
  const breadscrums = "Admin > subsidiary";
  const cuurentpagemodelname = "subsidiary";
  const aresuremodal = "Delete this Element";
  const aresuremodaltype = "Delete";
  const apiroutepath = "subsidiary";
  const deleteKeyField = "subsidiaries";
  const editnewroutepath = "/data/subsidiary/edit-subsidiary"; 

  const [exportUrl, setexportUrl] = useState("");
  const fetchexportUrl = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(`${api}/admin/subsidiary/export`, {
        headers
      });
      const fileName = response.data.fileName;
      setexportUrl(fileName);
    } catch (err) {
      setError("Error fetching export URL");
    }
  };

  return (
    <div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <Listingpage3cols
        cuurentpagemodelname={cuurentpagemodelname}
        breadscrums={breadscrums}
        addnewroutepath={addnewroutepath}
        fields={fields} // Pass the field configuration
        data={subsidiarys}
        currentPage={page}
        sizePerPage={sizePerPage}
        totalPages={totalPages}
        totalRecord={totalRecord}
        onPageChange={handlePageChange}
        onSizeChange={handleSizeChange}
        loading={loading}
        startRecord={page * sizePerPage + 1}
        endRecord={Math.min((page + 1) * sizePerPage, totalRecord)}
        onSearchChange={handleSearchChange}
        aresuremodal={aresuremodal}
        aresuremodaltype={aresuremodaltype}
        exportUrl={exportUrl}
        apiroutepath={apiroutepath}
        deleteKeyField={deleteKeyField}
        editnewroutepath={editnewroutepath}
      />
    </div>
  );
};

export default subsidiary;
