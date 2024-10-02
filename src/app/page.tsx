
import MainLayout from "@/components/MainLayout";
import Home from '@/components/HomeComponents/Home'
import React, { useEffect } from 'react'
import { useSelector } from "react-redux";
import { RootState } from "@/store/Store";
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";

export default function page() {

  return (

    <MainLayout>
      <Home/>
    </MainLayout>
  );
}
