"use client";
import React, { useEffect } from "react";
import { FaSort } from "react-icons/fa";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    const token = getCookie("jwtToken");
    if (!token) {
      router.push("/login");
    } 
  }, []);
  return (
    <div
      className="flex w-full "
      style={{ fontFamily: "SamsungOne, sans-serif" }}
    >
      <div className="flex flex-col w-full p-4 bg-gray-100">
        <div className="mt-4 ">
          <h2 className="text-lg font-semibold">Admin</h2>
        </div>

        <div className="mt-2 bg-white p-4 rounded-md shadow">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-sm">
              <span>Last Run-Time</span>
              <FaSort />
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span>Subsidiaries</span>
              <FaSort />
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span>Schedulers</span>
              <FaSort />
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span>Result</span>
              <FaSort />
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span>Issued Cases</span>
              <FaSort />
            </div>
            <div className="flex items-center gap-2 text-sm ">
              <span>Email To</span>
              <FaSort />
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="mt-2 bg-white p-4 rounded-md shadow">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="flex justify-between items-center py-2 border-b"
            >
              <div className="flex items-center gap-2 text-xs w-[10%]">
                <span>2024-08-10</span>
                <span>14:00:00</span>
              </div>
              <div className="text-center text-xs w-[10%]">SECZ_sk</div>
              <div className="text-center text-xs w-[10%]">sk_mp_bc</div>
              <div
                className={`text-center ${
                  index % 2 === 0 ? "text-[#FFA500]" : "text-[#36A932]"
                } w-[10%],`}
              >
                {index % 2 === 0 ? "Running" : "Completed"}
              </div>
              <div className="text-center text-xs w-[10%]">0 SKUS</div>
              <div className="truncate text-xs text-clip overflow-hidden w-[10%]">
                platform@samsung.de, hybris.sup@cheil.com
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;