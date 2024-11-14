"use client";
import { deleteCookie, getCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { IoExitOutline } from 'react-icons/io5';
import { Modal } from '@mui/material';
import { useDispatch } from 'react-redux';

function UserProfileCardShow({ isOpen, setIsModalOpen }) {
  const [email, setEmail] = useState('');
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const storedEmail = localStorage.getItem('username');
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const handleLogout = () => {
    window.location.href = "/";
    deleteCookie('jwtToken');
  };

  useEffect(() => {
    const token = getCookie('jwtToken');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const handleClose = () => {
    setIsModalOpen(false); // Close the modal
  };

  return (
    <Modal
      open={isOpen}
      onClose={handleClose} // Close the modal when clicking outside
      className="flex items-start mt-14 bg-transparent mr-7 justify-end p-2 "
    >
      <div className="flex flex-col bg-black p-3 rounded-lg ">
        <div className="w-full flex flex-col items-center">
          <span className="font-semibold text-xs mt-2 mb-4 text-white">{email}</span>
          <div className="flex flex-row gap-4 w-full justify-between items-center">
            <div
              onClick={handleLogout}
              className="flex items-center justify-center p-2 w-28 bg-white rounded-md"
            >
              <div className="text-xs text-black">Logout</div>
              <IoExitOutline className="ml-2 text-md text-black" />
            </div>
            <div className="flex items-center text-xs justify-center p-2 bg-white w-28 rounded-md">
              <div className="text-black">Profile</div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default UserProfileCardShow;
