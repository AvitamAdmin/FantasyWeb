"use client"
import React, { useEffect, useState } from "react";
import axios from "axios";
import { api } from "@/envfile/api";
import { getCookie } from "cookies-next";
import Listingpage4cols from "@/app/src/components/ListingPageComponents/Listingpage4cols";
import { useDispatch, useSelector } from "react-redux";
import { clearAllEditRecordIds, resetDeleteStatus } from "@/app/src/Redux/Slice/slice";

const testdatasubtype = () => {
  const [token, setToken] = useState("");
  const [testdatasubtypes, setTestdatasubtypes] = useState([]);
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
    username: "",
    shortDescription: "",
    status: ""
  });

  const fields = [
    { label: 'Identifier', value: 'identifier' },
    { label: 'Short Description', value: 'shortDescription' },
    { label: 'Test Data Type', value: 'testDataType' },
    { label: 'Subsidiary ', value: 'subsidiaries' },
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
      fetchTestdatasubtype();
    }
    if (deleteStatus === "deleted") {
      // Trigger the fetch when deleteStatus is "deleted"
      fetchTestdatasubtype();
      dispatch(resetDeleteStatus()); // Reset deleteStatus after the data is fetched
    }
  }, [token, page, sizePerPage, fetchFilterInputs,deleteStatus]);
  console.log(searchValues, "searchValues");

  useEffect(() => {
    setfilterInput(fetchFilterInputs);
  }, [fetchFilterInputs]);

  const fetchTestdatasubtype = async () => {
    setLoading(true);
    setError(null); // Reset error before fetching
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const body = {
        page, sizePerPage: sizePerPage === totalRecord ? totalRecord : sizePerPage,
        testDataSubtypes: fetchFilterInputs,
        //searchValues
      };
      const response = await axios.post(`${api}/admin/testdatasubtype`, body, { headers });

      setTestdatasubtypes(response.data.testDataSubtypes || []);
      setTotalRecord(response.data.totalRecords);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (err) {
      setError("Error fetching testDataType data");
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


  const addnewroutepath = "/admin/testdatasubtype/add-testDataSubtype"
  const breadscrums = "Admin > testdatasubtype"
  const cuurentpagemodelname = "testdatasubtype"
  const editnewroutepath = "/admin/testdatasubtype/edit-testdatasubtype";
  const aresuremodal = "Delete this Element";
  const aresuremodaltype = "Delete";
  const apiroutepath = "testdatasubtype";
  const deleteKeyField = "testDataSubtypes";



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
        data={testdatasubtypes}
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


export default testdatasubtype;
