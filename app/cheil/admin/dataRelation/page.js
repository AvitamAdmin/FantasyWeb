"use client"
import React, { useEffect, useState } from "react";
import axios from "axios";
import { api } from "@/envfile/api";
import { getCookie } from "cookies-next";
import Listingpage3cols from "@/app/src/components/ListingPageComponents/Listingpage3cols";
import { useDispatch, useSelector } from "react-redux";
import { clearAllEditRecordIds, resetDeleteStatus } from "@/app/src/Redux/Slice/slice";

const datarelation = () => {
  const [token, setToken] = useState("");
  const [dataRelations, setDataRelations] = useState([]);
  const [page, setPage] = useState(0);
  const [sizePerPage, setSizePerPage] = useState(50);
  const [totalRecord, setTotalRecord] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchFilterInputs = useSelector(
    (state) => state.tasks.fetchFilterInput
  );
  const dispatch = useDispatch();
  const deleteStatus = useSelector((state) => state.tasks.deleteStatus);

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

  useEffect(() => {
    if (token) {
      fetchDataRelations();
      //fetchexportUrl();
    }
    if (deleteStatus === "deleted") {
      // Trigger the fetch when deleteStatus is "deleted"
      fetchDataRelations();
      dispatch(resetDeleteStatus()); // Reset deleteStatus after the data is fetched
    }
  }, [token, page, sizePerPage, fetchFilterInputs,deleteStatus]);
  useEffect(() => {
    setfilterInput(fetchFilterInputs);
  }, [fetchFilterInputs]);

  const fetchDataRelations = async () => {
    setLoading(true);
    setError(null); // Reset error before fetching
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const body = {
        page, sizePerPage: sizePerPage === totalRecord ? totalRecord : sizePerPage,
        dataRelations: fetchFilterInputs,
      };
      const response = await axios.post(`${api}/admin/dataRelation`, body, { headers });

      setDataRelations(response.data.dataRelations || []);
      setTotalRecord(response.data.totalRecords);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError("Error fetching Datarelations data");
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




  const addnewroutepath = "/admin/dataRelation/add-datarelation"
  const breadscrums = "Admin > data Relation"
  const cuurentpagemodelname = "Data Relation"
  const editnewroutepath = "/admin/dataRelation/edit-dataRelation";
  const aresuremodal = "Delete this Element";
  const aresuremodaltype = "Delete";
  const apiroutepath = "dataRelation";
  const deleteKeyField = "dataRelations";



  const [exportUrl, setexportUrl] = useState("");
  const fetchexportUrl = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      console.log(token, "token url");

      const response = await axios.get(`${api}/admin/dataRelation/export`, {
        headers,
      });

      const fileName = response.data.fileName;
      setexportUrl(fileName);


      // Set the exportUrl state
    } catch (err) {
      setError("Error fetching export URL");
    }
  };

  return (
    <div>
      {error && <div className="text-red-500">{error}</div>}
      <Listingpage3cols
        cuurentpagemodelname={cuurentpagemodelname}
        addnewroutepath={addnewroutepath}
        breadscrums={breadscrums}
        fields={fields} // Pass the field configuration
        data={dataRelations}
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
        exportUrl={exportUrl}
        apiroutepath={apiroutepath}
        deleteKeyField={deleteKeyField}
      />
    </div>
  );
};


export default datarelation;