import { Modal } from "@mui/material";
import React from "react";
import { IoClose } from "react-icons/io5";

const ExportDownloadModal = ({ setIsModalOpen, isOpen, handleClose, handleclick }) => {
  const closeModal = () => {
    setIsModalOpen(false);
  };
  return (
    <Modal open={isOpen} onClose={handleClose} className="flex flex-col w-full justify-center items-center backdrop-blur-sm p-2">
        <div className='flex flex-col w-[70%] bg-transparent justify-center items-center    '>
        <div className='bg-gray-300 w-[100%] min-h-96 flex flex-col justify-between items-center  rounded-xl gap-4 '>
        <div className=' w-full flex flex-row justify-between items-center p-3 rounded-t-lg bg-black'>
            <div className="text-white text-md">
                Export
            </div>
           <div className='text-end flex flex-row' onClick={closeModal}><IoClose className='text-xl text-white'/></div>
           </div>
      ExportDownloadModal
      </div>
      </div>
    </Modal>
  );
};

export default ExportDownloadModal;
