import React, { useEffect, useState } from "react";
import DetailsSideModal from "../modal/DetailsSideModal";
import { MdDelete, MdFileUpload, MdOutlineEdit } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import * as XLSX from "xlsx";
import Lottie from "react-lottie";
import * as animationData from "../../../../assests/LoadingAnimation.json";
import { IoClose, IoSearch } from "react-icons/io5";
import { IconButton, MenuItem, TextField, Tooltip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  getdeleteElementId,
  getFilterInputValue,
  setchooesEditOrAdd,
  setMultipleEditRecoedId,clearAllEditRecordIds,clearDeleteElementId,
  triggerDeleteSuccess
} from "../../Redux/Slice/slice";
import AdminEditButton from "../modal/AdminEditbutton";
import AreUSurepage from "../modal/AreUSurepage";
import Upload from "../modal/upload";
import { getCookie } from "cookies-next";
import axios from "axios";
import { api } from "@/envfile/api";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import UploadModal from "../modal/upload";

const Listingpage4cols = ({
  fields,
  data,
  currentPage,
  sizePerPage,
  totalPages,
  totalRecord,
  onPageChange,
  onSizeChange,
  endRecord,
  startRecord,
  addnewroutepath,
  editnewroutepath,
  breadscrums,
  loading,
  cuurentpagemodelname,
  aresuremodal,
  aresuremodaltype,
  apiroutepath,
  deleteKeyField,
  // homeroutepath
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [showInputs, setShowInputs] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [token, setToken] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  useEffect(() => {
    const jwtToken = getCookie("jwtToken");
    if (jwtToken) {
      setToken(jwtToken);
    }
  }, []);
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const [searchValues, setSearchValues] = useState(
    fields.reduce((acc, field) => {
      acc[field.value] = "";
      return acc;
    }, {})
  );

  // State for the edit modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editModalData, setEditModalData] = useState(null);

  const toggleInputs = () => setShowInputs(!showInputs);
  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  // Function to safely access nested fields (e.g., parentNode.identifier)
  const getFieldValue = (item, fieldPath) => {
    const value = fieldPath
      .split(".")
      .reduce((obj, key) => (obj ? obj[key] : "-"), item);

    if (["status", "published"].some((field) => fieldPath.includes(field))) {
      // Convert boolean status or published to "active" or "inactive"
      return value === true ? "Active" : "Inactive";
    }

    return value === null || value === "" ? "-" : value;
  };
  const handleExport = () => {
    // Prepare the worksheet data
    console.log("hii");
    const worksheetData = data.map((item) => {
      const row = {};
      fields.forEach((field) => {
        row[field.label] = getFieldValue(item, field.value);
      });
      return row;
    });

    // Create a worksheet and a workbook
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

    // Get the range of the worksheet
    const range = XLSX.utils.decode_range(worksheet["!ref"]);

    // Apply bold styling to headers
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C }); // Get the header cell address
      if (worksheet[cellAddress]) {
        worksheet[cellAddress].s = {
          font: { bold: true }, // Apply bold font style
        };
      }
    }

    // Convert the workbook to binary and create a downloadable link
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
      cellStyles: true,
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

    // Download the file
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = `${breadscrums}.xlsx`;
    downloadLink.click();
    toast.success("File downloaded successfully")

  };

  const handleSearchChange = (e, field) => {
    if (!e || !e.target || !field || !field.value) {
      return; // Safeguard in case e or field is undefined
    }
  
    // Update the search values state
    const newSearchValues = { ...searchValues, [field.value]: e.target.value };
    setSearchValues(newSearchValues);
  
    // Filter out empty fields and build the message object
    const message = {};
    fields.forEach((f) => {
      if (newSearchValues[f.value]?.trim()) {
        message[f.value] = newSearchValues[f.value];
      }
    });
    dispatch(getFilterInputValue(message));
    console.log("Updated message object for API request:", message);
    
    // Optional: Pass `message` to the API call or do something with it
    // You can implement the API call or filter logic here if needed
  };
  

  const filter = [
    { value: "50", sizePerPage: 50 },
    { value: "100", sizePerPage: 100 },
    { value: "150", sizePerPage: 150 },
    { value: "200", sizePerPage: 200 },
    { value: "Show All", sizePerPage: "all" },
  ];

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const handleOpenModal = (item) => {
    setModalData(item); // Set the item data for the modal
    setModalOpen(true); // Open the modal
  };

  let tapTimeout = null; // Store timeout reference
  let lastTapTime = 0; // Store the last tap time to handle double taps
  
  const handleTap = (item) => {
    const recordId = item.recordId;
    const DOUBLE_TAP_DELAY = 300; // Milliseconds to detect double tap
  
    const now = Date.now(); // Get the current time
  
    if (tapTimeout) {
      // Clear the timeout if it's a double tap
      clearTimeout(tapTimeout);
      tapTimeout = null;
    }
  
    // Check if the difference between taps is less than the double tap delay
    if (now - lastTapTime < DOUBLE_TAP_DELAY) {
      // Double tap detected
      if (!selectedID.includes(recordId)) {
        dispatch(setMultipleEditRecoedId(recordId)); // Handle double tap action
      }
  
      // Navigate to the edit route
      router.push(`/cheil${editnewroutepath}`);
    } else {
      // Single tap - set a timeout to distinguish between single and double tap
      tapTimeout = setTimeout(() => {
        handleOpenModal(item); // Handle single tap event
        tapTimeout = null; // Reset the timeout after handling single tap
      }, DOUBLE_TAP_DELAY);
    }
  
    lastTapTime = now; // Update the last tap time
  };

  const handleCheckboxClick = (recordId) => {
    // Or you can log it to the console
    // console.log("Record ID:", recordId);
    dispatch(setMultipleEditRecoedId(recordId));
  };

  const selectedID = useSelector((state) => state.tasks.multipleEditRecordId);
  // console.log("Record ID by redux:", selectedID);
  // console.log("Record ID by redux length:", selectedID.length);

  const handleCloseModal = () => setModalOpen(false);
  const handleCloseEditModal = () => setEditModalOpen(false); // Close edit modal

  const [deleteId, setDeleteId] = useState();
  const elementId = useSelector((state) => state.tasks.deleteElementId);

  const handledelete = async (deleteId) => {
    try {
      console.log("btn triggred");

      const headers = { Authorization: `Bearer ${token}` };
      console.log(elementId, "btn triggred");

      const body = {
        [deleteKeyField]: [{ recordId: elementId }], // Template literal without quotes
      };

      const response = await axios.post(
        `${api}/admin/${apiroutepath}/delete`,
        body,
        {
          headers
        }
      );
      // console.log(response.data);
      if (response.data.message) {
        closeModal();
        toast.success("Data deleted successfully!!");
        dispatch(triggerDeleteSuccess());
        // router.push(`/cheil${homeroutepath}`);
        // window.location.reload();
      }
    } catch (error) {
      console.error("Error deleting the record:", error);
      // Handle the error here (e.g., show a message to the user)
    }
  };

  const selectedMultipleID = useSelector(
    (state) => state.tasks.multipleEditRecordId
  );


  const handlemultipledelete = async () => {
    try {
      console.log("btn triggered");

      const headers = { Authorization: `Bearer ${token}` };

      // Create an array of objects, each with a single recordId
      const body = {
        [deleteKeyField]: selectedMultipleID.map((id) => ({ recordId: id })),
      };

      const response = await axios.post(
        `${api}/admin/${apiroutepath}/delete`,
        body,
        {
          headers
        }
      );

      if (response.data.message) {
        toast.success("Data deleted successfully!!");
        dispatch(triggerDeleteSuccess());
        dispatch(clearDeleteElementId());
        // router.push(`/cheil${homeroutepath}`);
        // window.location.reload();
      }
    } catch (error) {
      console.error("Error deleting the record:", error);
      // Handle the error here (e.g., show a message to the user)
    }
  };

  const handleDownload = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      console.log(token, "token url");

      const response = await axios.get(`${api}/admin/${apiroutepath}/export`, {
        headers,
      });

      const fileName = response.data.fileName;

      const fullUrl = `${api}${fileName}`;
      window.open(fullUrl, "_blank");
      toast.success("File downloaded successfully")
    } catch (err) {
      setError("Error fetching export URL");
    }
  };

  

  return (
    <div className="w-[100%] overflow-hidden flex flex-col px-2 gap-3 pb-5  h-[100%]">
      <Toaster />
      <div className="p-1 rounded-md flex flex-row justify-between items-center w-full">
        <div className="flex flex-row gap-3 justify-center items-center">
          <div className="flex flex-row gap-1">
            <span className="text-xs font-bold">{breadscrums}</span>
          </div>
          <div>
            {totalPages > 0 && (
              <div className="flex space-x-3 bg-[#D3D3D3] justify-start items-center p-2 rounded-md">
                {pageNumbers.map((pageNum) => (
                  <button
                    key={pageNum}
                    className={`w-[25px] py-0.5 rounded ${
                      pageNum - 1 === currentPage
                        ? "bg-[#cc0001] text-white"
                        : "bg-white text-gray-700"
                    } text-sm`}
                    onClick={() => onPageChange(pageNum - 1)}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-row gap-3 items-center">
          <div className="flex flex-row">
            {selectedID.length >= 1 ? (
              <button
                onClick={() => {
                  router.push(`/cheil${editnewroutepath}`);
                }}
              >
                <Tooltip
                  arrow
                  slotProps={{
                    popper: {
                      modifiers: [
                        {
                          name: "offset",
                          options: {
                            offset: [0, -14],
                          },
                        },
                      ],
                    },
                  }}
                  title="Edit"
                >
                  <IconButton>
                    <MdOutlineEdit className="text-white bg-[#CC0001] p-1.5 rounded-md text-3xl " />
                  </IconButton>
                </Tooltip>
              </button>
            ) : (
              <div
                onClick={() => {
                  toast.error("Atleast select one Element to edit");
                }}
              >
                <Tooltip
                  arrow
                  slotProps={{
                    popper: {
                      modifiers: [
                        {
                          name: "offset",
                          options: {
                            offset: [0, -14],
                          },
                        },
                      ],
                    },
                  }}
                  title="Edit"
                >
                  <IconButton>
                    <MdOutlineEdit className="text-white bg-[#CC0001] p-1.5 rounded-md text-3xl " />
                  </IconButton>
                </Tooltip>
              </div>
            )}
            <button onClick={handlemultipledelete}>
              <Tooltip
                arrow
                slotProps={{
                  popper: {
                    modifiers: [
                      {
                        name: "offset",
                        options: {
                          offset: [0, -14],
                        },
                      },
                    ],
                  },
                }}
                title="Delete"
              >
                <IconButton>
                  <MdDelete className="text-white bg-[#CC0001] p-1.5 rounded-md text-3xl " />
                </IconButton>
              </Tooltip>
            </button>
          </div>
          <button
            className="flex flex-row p-2 border-2 border-gray-400 items-center rounded-md bg-white gap-1"
            onClick={handleExport}
          >
            <MdFileUpload className="text-gray-500 " />
            <span className="text-gray-500 text-xs">Export</span>
          </button>
          <button
            onClick={() => {
              router.push(`/cheil${addnewroutepath}`);
            }}
            className="flex flex-row p-2 border-2 border-gray-400 items-center rounded-md bg-[#CC0001] gap-1"
          >
            <FaPlus className="text-white" />
            <span className="text-white text-xs">Add New</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex flex-row p-2 border-2 border-gray-400 items-center rounded-md bg-[#2b2b2b] gap-1"
          >
            <span className="text-white text-xs">Template</span>
          </button>
          <button

          onClick={()=>{
            setShowUploadModal(true)
          }}
            // href="/cheil/admin/trgmapping/add-mapping"
            className="flex flex-row p-2 border-2 border-gray-400 items-center rounded-md bg-[#2b2b2b] gap-1"
          >
            <span className="text-white text-xs">Upload</span>
          </button>
        </div>
      </div>

      {/* Search bar and inputs */}
      <div className="bg-white  rounded-md ">
        <div className="gap-3 flex flex-col  rounded-md   overflow-y-auto">
          <div
            style={{ backgroundColor: "#D3D3D3" }}
            className=" rounded-md shadow pl-4 pr-4"
          >
            <div className="flex items-center flex-row">
              <div className="flex flex-row w-full">
                <div className="flex items-center gap-2 text-sm w-20">
                  <input type="checkbox" />
                </div>
                {!showInputs ? (
                  <div className="w-full flex flex-row justify-between items-center pt-2.5 pb-2.5">
                    {fields.map((field, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-1 text-sm w-[30%] "
                      >
                        <span>{field.label}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-row w-full justify-between items-start pt-2.5 pb-2.5">
                    {fields.map((field, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-sm w-[30%]"
                      >
                        <input
                          key={index}
                          placeholder={`Search ${field.label}`}
                          value={searchValues[field.value]}
                          onChange={(e) => handleSearchChange(e, field)}
                          className="input-class text-sm flex items-start justify-start p-1"
                        />
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex flex-row items-center justify-end  gap-2 text-sm w-[10%]">
                  {showInputs ? (
                    <IoClose
                      className="cursor-pointer"
                      onClick={toggleInputs}
                    />
                  ) : (
                    <IoSearch
                      className="cursor-pointer"
                      onClick={toggleInputs}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Display the filtered data */}
          <div
            style={{ backgroundColor: "#fff" }}
            className=" p-4 max-h-96 min-h-96 rounded-md overflow-y-scroll"
          >
            {loading ? (
              <div className="w-full flex flex-col  h-80 justify-center items-center">
                <div className="opacity-25 ">
                  <Lottie options={defaultOptions} height={100} width={100} />
                </div>
                <div>Loading data...</div>
              </div>
            ) : (
              <div className="space-y-2 max-w-[100%]">
  {data.length < 1 ? (
    <div className="text-center text-gray-500 text-sm">
      No data found
    </div>
  ) : (
    data.map((item, index) => (
      <div key={index} className="flex items-center text-gray-600 text-xs w-full ">
        <div className="flex items-center gap-2 text-sm w-[5%]">
          <input
            checked={selectedID.includes(item.recordId)}
            type="checkbox"
            onChange={(e) => handleCheckboxClick(item.recordId)}
          />
        </div>
        <div
          className="flex w-[90%] justify-between cursor-pointer"
          onClick={() => handleTap(item)}
        >
          {fields.map((field, idx) => (
            <div
              key={idx}
              className="flex text-center  flex-row w-[25%] overflow-hidden text-ellipsis whitespace-nowrap"
            >
              <span>{getFieldValue(item, field.value)}</span>
            </div>
          ))}
        </div>
        <button
          onClick={() => {
            dispatch(getdeleteElementId(item.recordId));
            openModal();
          }}
          className="gap-3 flex flex-row "
        >
          <Tooltip
            arrow
            placement="right-start"
            slotProps={{
              popper: {
                modifiers: [
                  {
                    name: "offset",
                    options: {
                      offset: [0, -14],
                    },
                  },
                ],
              },
            }}
            title="Delete"
          >
            <IconButton>
              <MdDelete className="text-black   rounded-md text-xl " />
            </IconButton>
          </Tooltip>
        </button>
      </div>
    ))
  )}
</div>

            )}
          </div>
        </div>

        <DetailsSideModal
          open={modalOpen}
          handleClose={handleCloseModal}
          data={modalData}
          cuurentpagemodelname={cuurentpagemodelname}
        />

        <AdminEditButton
          EditModal={editModalOpen}
          data={data}
          handleCloseEdit={handleCloseEditModal}
        />
      </div>

      {/* Pagination controls */}
      <div
        style={{ backgroundColor: "#D3D3D3" }}
        className=" p-2 rounded-lg w-full flex justify-between items-center px-2"
      >
        <div className="flex flex-row gap-3 items-center justify-center text-sm">
          <div className="flex flex-row gap-2">
            Showing
            <div className=" flex flex-row gap-2">
              <span className="  text-center flex bg-[#cc0001] rounded-sm text-white flex-row w-[25px] justify-center ">
                {startRecord}
              </span>
              -
              <span className="  flex flex-row w-[25px] bg-[#cc0001] rounded-sm text-white justify-center ">
                {endRecord}
              </span>
            </div>
            of {totalRecord} Entries
          </div>
          <TextField
            className="w-28 text-sm"
            size="small"
            id="outlined-select-currency-native"
            select
            value={sizePerPage === "all" ? "Show All" : sizePerPage.toString()}
            onChange={onSizeChange}
          >
            {filter.map((option) => (
              <MenuItem
                key={option.value}
                value={option.sizePerPage.toString()}
                className="text-sm"
              >
                {option.value}
              </MenuItem>
            ))}
          </TextField>
        </div>

        {/* <div className="flex space-x-3">
            {pageNumbers.map((pageNum) => (
              <button
                key={pageNum}
                className={`px-3 py-1 rounded ${pageNum - 1 === currentPage ? 'bg-[#cc0001] text-white' : ' text-gray-700'}`}
                onClick={() => onPageChange(pageNum - 1)}
              >
                {pageNum}
              </button>
            ))}
          </div> */}
        <AreUSurepage
          handleclick={handledelete}
          aresuremodaltype={aresuremodaltype}
          aresuremodal={aresuremodal}
          isOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />

        <UploadModal 
         routepath={apiroutepath}
         isOpen={showUploadModal}
         setIsModalOpen={setShowUploadModal}
        />
      </div>
    </div>
  );
};

export default Listingpage4cols;