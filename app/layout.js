"use client";

import React from 'react';
import { Inter } from "next/font/google";

import "./globals.css";
import { Providers } from './src/Redux/provider';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <Providers>
    <html lang="en">
      <body className={inter.className}>
        
        <div>{children}</div>
      </body>
    </html>
    </Providers>
  );
}
