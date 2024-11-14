"use client"
import React, { useEffect, useState } from "react";
import axios from "axios";
import { api } from "@/envfile/api";
import { getCookie } from "cookies-next";
import Listingpageformedia from "@/app/src/components/ListingPageComponents/Listingpageformedia";
import { useDispatch, useSelector } from "react-redux";
import { clearAllEditRecordIds, resetDeleteStatus } from "@/app/src/Redux/Slice/slice";

const media = () => {
  const [token, setToken] = useState("");
  const [medias, setMedias] = useState([]);
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
    status: ""
  });
  const dispatch = useDispatch();
  const deleteStatus = useSelector((state) => state.tasks.deleteStatus);
  const fields = [
    { label: 'Identifier', value: 'identifier' },
    { label: 'File Name', value: 'fileName' },

    { label: 'Creator', value: 'creator' },
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
      fetchMedia();
    };
    if (deleteStatus === "deleted") {
      // Trigger the fetch when deleteStatus is "deleted"
      fetchMedia();
      dispatch(resetDeleteStatus()); // Reset deleteStatus after the data is fetched
    };
  }, [token, page, sizePerPage, fetchFilterInputs,deleteStatus]);
  console.log(searchValues, "searchValues");

  useEffect(() => {
    setfilterInput(fetchFilterInputs);
  }, [fetchFilterInputs]);

  const fetchMedia = async () => {
    setLoading(true);
    setError(null); // Reset error before fetching
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const body = {
        page, sizePerPage: sizePerPage === totalRecord ? totalRecord : sizePerPage,
        medias: fetchFilterInputs,
        //searchValues
      };
      const response = await axios.post(`${api}/admin/media`, body, { headers });

      setMedias(response.data.medias || []);
      setTotalRecord(response.data.totalRecords);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (err) {
      setError("Error fetching media data");
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


  const addnewroutepath = "/data/media/add-media"
  const breadscrums = "Admin > media"
  const cuurentpagemodelname = "media"
  const aresuremodal = "Delete this Element";
  const aresuremodaltype = "Delete";
  const apiroutepath = "media";
  const deleteKeyField = "medias";
 

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
      <Listingpageformedia
        cuurentpagemodelname={cuurentpagemodelname}
        breadscrums={breadscrums}
        addnewroutepath={addnewroutepath}
        fields={fields} // Pass the field configuration
        data={medias}
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
       
      />
    </div>
  );
};


export default media;
