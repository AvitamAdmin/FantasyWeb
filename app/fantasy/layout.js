import React from 'react';
import { Inter } from "next/font/google";
import Header from '../src/Header/header';
import Sidebar from '../sidenav/sidebar';
import ResSidebar from '../sidenav/ressidebar';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children, showHeader = true, showBreadcrumbs = true }) {


  return (
      <div className={inter.className}>
        <div className='flex flex-col max-w-[100%] '>
          <ResSidebar />
          <div className='flex flex-row max-w-[100%]'>
            {/* Pass authtoken as a prop */}
            <Sidebar />
            <div className='flex flex-col w-[100%]  max-h-screen overflow-y-scroll lg:w-[85%] '>
              <div className='p-2 '>
                {showHeader && <Header />}
              </div>
              <div className='max-w-full '>{children}</div>
            </div>
          </div>
        </div>
      </div>
  );
}
