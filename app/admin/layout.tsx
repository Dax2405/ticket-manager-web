"use client";

import React from "react";
import { SideBar } from "./components/SideBar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { cn } from "@/lib/utils";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ProtectedRoute>
      <div className={cn("w-screen flex", "h-screen overflow-hidden")}>
        <SideBar />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </ProtectedRoute>
  );
};

export default AdminLayout;
