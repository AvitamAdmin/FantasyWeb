import React, { useCallback, useRef, useState } from "react";
import { Modal, TextField } from "@mui/material";
import Cron from "react-js-cron";
import { Divider, Input } from "antd";
import Scheduler from "material-ui-cron";


const CronjobExpression = ({ isOpen, setIsModalOpen }) => {
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const inputRef = useRef(null);
  const defaultValue = "30 5 * * 1,6";
  const [value, setValue] = useState(defaultValue);
  const [textValue, setTextValue] = useState("");
  const customSetValue = useCallback(
    (newValue) => {
      setValue(newValue);
      setTextValue(newValue);
    },
    [setTextValue]
  );

  const [error, onError] = useState();
  const [cronExp, setCronExp] = useState("0 0 * * *");
  const [cronError, setCronError] = useState(""); // get error message if cron is invalid
  const [isAdmin, setIsAdmin] = useState(true);
  return (
    <Modal open={isOpen} onClose={closeModal} style={{ zIndex: 1300 }}>
      <div
        className="w-full flex flex-col justify-center items-center min-h-screen bg-black bg-opacity-50"
        style={{ overflow: "visible" }} // Allow overflow for dropdowns
      >
        <div className="w-full sm:w-[50%] bg-white flex flex-col justify-center rounded-md p-6 shadow-lg">
        <div className="flex flex-col justify-center items-center w-full">
      <Scheduler
        cron={cronExp}
        setCron={setCronExp}
        setCronError={setCronError}
        isAdmin={isAdmin}
      />
    </div>
    <div className="flex justify-end space-x-4 mt-6">
            <button
              onClick={closeModal}
              className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={() => setIsModalOpen(false)} // Submit or handle data on close
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CronjobExpression;