"use client";
import { deleteCookie, getCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { IoExitOutline } from 'react-icons/io5';
import "animate.css";
import UserProfileCardShow from '../components/modal/UserProfileCardShow';

function Header() {
  const [email, setEmail] = useState('');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false); // Modal state
  const router = useRouter();

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
      router.push('/login'); // Redirect if token is not found
    }
  }, [router]);

  return (
    <div className="hidden lg:flex items-center justify-end max-w-full px-2 pt-2 top-0 sticky">
      <div className="relative group">
        {/* User Icon */}
        <div  onClick={() => setIsProfileModalOpen(true)}
          className="flex items-center justify-center p-2 bg-black rounded-full hover:cursor-pointer"
        >
          <FaUser className="text-white text-lg" />
        </div>

        {/* Dropdown Content */}
        <div
          className="absolute right-0 mt-3 min-w-[200px] bg-black p-3 rounded-lg shadow-lg 
          opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300"
        >
          <div className="w-full flex flex-col items-center">
            <span className="font-semibold text-xs mt-2 mb-4 text-white">{email}</span>
            <div className="flex flex-row gap-4 w-full justify-between items-center">
            <div
  onClick={handleLogout}
  className="flex items-center justify-center p-2 w-28 hover:bg-red-400  text-sm bg-white rounded-md hover-parent transition-all"
>
  Logout
  <IoExitOutline className="ml-2 text-md text-black  transition-all" />
</div>


              <div
                onClick={() => setIsProfileModalOpen(true)}
                className="flex items-center justify-center p-2 w-28 bg-white rounded-md"
              >
                <div className="text-xs text-black">Profile</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      <UserProfileCardShow
        isOpen={isProfileModalOpen}
        setIsModalOpen={setIsProfileModalOpen}
      />
    </div>
  );
}

export default Header;
