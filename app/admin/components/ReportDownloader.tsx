import React, { useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import { cn } from "@/lib/utils";

const ReportDownloader = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("day");

  const handlePeriodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPeriod(event.target.value);
  };

  const generateReport = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      const response = await axios.get("https://dax-ec.ru/api-tickets/tickets/logs", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;
      const doc = new jsPDF();

      doc.text("Reporte de Tickets", 10, 10);
      data.forEach((item: any, index: number) => {
        doc.text(
          `${item.ticket_name} ${item.ticket_last_name} - ${item.place_name} - ${item.action} - ${item.time}`,
          10,
          20 + index * 10
        );
      });

      const date = new Date().toISOString().slice(0, 10);
      doc.save(`reporte_${date}.pdf`);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <select
        value={selectedPeriod}
        onChange={handlePeriodChange}
        className="bg-gray-700 text-white rounded p-2 mb-4"
      >
        <option value="day">Día</option>
        <option value="week">Semana</option>
        <option value="month">Mes</option>
      </select>
      <button
        onClick={generateReport}
        className="bg-gradient-to-br from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
      >
        Generar Reporte
      </button>
    </div>
  );
};

export default ReportDownloader;