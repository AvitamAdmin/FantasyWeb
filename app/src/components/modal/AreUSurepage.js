import React, { useState } from 'react'
import { Modal } from '@mui/material'
import { IoClose, IoCloudUploadOutline } from "react-icons/io5";
import { FiUpload } from "react-icons/fi";
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';



const AreUSurepage = ({ isOpen, setIsModalOpen ,aresuremodal,aresuremodaltype, handleclick}) => {
  const selectedMultipleID = useSelector(
    (state) => state.tasks.multipleEditRecordId
  );
  const elementId = useSelector((state) => state.tasks.deleteElementId);
  const router = useRouter();
      const closeModal = () => {
        setIsModalOpen(false);
      };
  return (
    <Modal open={isOpen} onClose={closeModal}>
          <div className='flex flex-col w-[100%] justify-center items-center  min-h-screen  '>
          <div className='bg-gray-300 w-[30%] flex flex-col justify-center items-center  rounded-md gap-4 p-3'>
           <div className=' w-full flex flex-row justify-end items-end'>
           <button className='text-end flex flex-row' onClick={closeModal}><IoClose className='text-xl'/></button>
           </div>
    <div>Are You Want to {aresuremodal}</div>
    <div className='flex flex-row w-full justify-around'>
      <button className=' text-red-700 font-semibold w-36 rounded-md p-1' onClick={()=>{
        handleclick();
        // router.push("/cheil/admin/interface");
      }}>{aresuremodaltype}</button>
      <button>{elementId.length}</button>
      <button>{selectedMultipleID.length}</button>
      <button className=' text-black font-semibold w-36 rounded-md p-1' onClick={closeModal}>Cancel</button>
    </div>
           </div>
          </div>
    </Modal>
  )
}

export default AreUSurepage