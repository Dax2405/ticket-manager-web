"use client";
import React from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import LineEntradas from "./components/LineEntradas";
import LineSalidas from "./components/LineSalidas";
import PieChartInPlace from "./components/PieChartInPlace";

const AdminPage = () => {
  return (
    <ProtectedRoute>
      <div className="p-4 h-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <PieChartInPlace sizex={400} sizey={300} />
          </div>
          <div className="col-span-1 md:col-span-2 lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-1">
                <LineEntradas sizex={500} sizey={300} />
              </div>
              <div className="col-span-1">
                <LineSalidas sizex={500} sizey={300} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AdminPage;
