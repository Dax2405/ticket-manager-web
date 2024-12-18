import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "@/lib/config";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface LineEntradasProps {
  sizex: number;
  sizey: number;
}

const LineEntradas: React.FC<LineEntradasProps> = ({ sizex, sizey }) => {
  interface TicketLog {
    action: string;
    time: string;
  }

  const [data, setData] = useState<TicketLog[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState("hour");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_BASE_URL}/tickets/logs`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handlePeriodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPeriod(event.target.value);
  };

  const dataEntrada = data.filter((item) => item.action === "Entrada");

  const groupDataByPeriod = () => {
    const groupedData = [];
    const counts: { [key: string]: number } = {};

    dataEntrada.forEach((entry) => {
      const date =
        selectedPeriod === "day"
          ? entry.time.slice(0, 10)
          : selectedPeriod === "month"
          ? entry.time.slice(0, 7)
          : selectedPeriod === "year"
          ? entry.time.slice(0, 4)
          : selectedPeriod === "hour"
          ? entry.time.slice(0, 13)
          : entry.time.slice(0, 10);

      if (counts[date]) {
        counts[date]++;
      } else {
        counts[date] = 1;
      }
    });

    for (const date in counts) {
      groupedData.push({ date, "Entradas totales": counts[date] });
    }

    return groupedData;
  };

  const groupedData = groupDataByPeriod();

  return (
    <div>
      <select
        value={selectedPeriod}
        onChange={handlePeriodChange}
        className="bg-gray-700 text-white rounded p-2"
      >
        <option value="hour">Hour</option>
        <option value="day">Day</option>
        <option value="month">Month</option>
        <option value="year">Year</option>
      </select>
      <LineChart
        width={sizex}
        height={sizey}
        data={groupedData}
        className="mt-2"
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip
          contentStyle={{
            color: "#fff",
            backgroundColor: "#1f2937",
            borderRadius: "10px",
            borderColor: "#111827",
          }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="Entradas totales"
          stroke="#22c55e"
          strokeWidth={"3px"}
        />
      </LineChart>
    </div>
  );
};

export default LineEntradas;
