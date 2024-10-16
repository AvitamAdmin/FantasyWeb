import { deleteCookie, getCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { IoCloseSharp, IoExitOutline } from 'react-icons/io5';
import "animate.css"

function Header() {
  const [email, setEmail] = useState('');
  const [show, setShow] = useState(false)
  const router = useRouter();

  useEffect(() => {
    const storedEmail = localStorage.getItem('username');
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  useEffect(() => {
    const token = getCookie('jwtToken');
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    deleteCookie('jwtToken');
    window.location.reload();
  };

  return (
    <div onClick={()=>{
      setShow(false)
    }} className="hidden justify-end lg:flex items-center  max-w-[100%] px-2 pt-2  top-0 sticky">
      <div className="flex items-center relative gap-2 group">
        <div onClick={()=>{
          setShow(!show)
        }} className="flex items-center  justify-center w-8 h-8 bg-black rounded-full hover:cursor-pointer">
          <FaUser className="text-white " />
        </div>
        {/* Dropdown that shows on hover */}
        <div className="hidden group-hover:flex animate__animated animate__fadeIn absolute top-full right-0 mt-0 min-w-[20%] bg-black p-3 rounded-lg shadow-lg z-50">
        <div className="w-full flex flex-col items-center ">
            
            <span className="font-semibold text-xs mt-2 mb-4 text-white">{email}</span>
            <div className="flex flex-row gap-4 w-full justify-between items-center">
              <button
                onClick={handleLogout}
                className="flex items-center justify-center p-2 w-28 hover:bg-red-500 transition-all bg-white text-white rounded-md"
              >
                <div className="text-xs text-black">Logout</div>
                <IoExitOutline className="ml-2 text-md text-black" />
              </button>
              <button className="flex items-center text-xs justify-center p-2 bg-white w-28 text-white rounded-md">
                <div className='text-black'>Profile</div>
              </button>
            </div>
          </div>
        </div>

        {show &&  <div className="flex flex-col animate__animated animate__fadeIn absolute top-full right-0 mt-0  min-w-[20%] bg-black p-3 rounded-lg shadow-lg z-50">
          <div className="w-full flex flex-col items-center ">
            
            <span className="font-semibold text-xs mt-2 mb-4 text-white">{email}</span>
            <div className="flex flex-row gap-4 w-full justify-between items-center">
              <button
                onClick={handleLogout}
                className="flex items-center justify-center p-2 w-28  bg-white  rounded-md"
              >
                <div className="text-xs text-black ">Logout</div>
                <IoExitOutline className="ml-2 text-md text-black" />
              </button>
              <button className="flex items-center text-xs justify-center p-2 bg-white w-28 text-white rounded-md">
                <div className='text-black'>Profile</div>
              </button>
            </div>
          </div>
        </div>}
      </div>
    </div>
  );
}

export default Header;
