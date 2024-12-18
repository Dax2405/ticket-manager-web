import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "@/lib/config";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#22c55e", "#ef4444"];

interface PieChartInPlaceProps {
  sizex: number;
  sizey: number;
}

const PieChartInPlace: React.FC<PieChartInPlaceProps> = ({ sizex, sizey }) => {
  const [data, setData] = useState<{ name: string; value: number }[]>([]);
  const [totalPersons, setTotalPersons] = useState(0);
  const [personsInside, setPersonsInside] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        // Petición para obtener el número de personas dentro
        const inPlaceResponse = await axios.get(
          `${API_BASE_URL}/tickets/in-place-number`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const inPlaceData: { [key: string]: number } = inPlaceResponse.data;
        const personsInsideCount = Object.values(inPlaceData).reduce(
          (acc, value) => acc + value,
          0
        );
        setPersonsInside(personsInsideCount);

        // Petición para obtener el número total de personas
        const ticketsResponse = await axios.get(
          `${API_BASE_URL}/tickets/ticket`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const ticketsData = ticketsResponse.data;
        const totalPersonsCount = ticketsData.length;
        setTotalPersons(totalPersonsCount);

        // Calcular el número de personas fuera
        const personsOutsideCount = totalPersonsCount - personsInsideCount;

        // Configurar los datos para el gráfico de pastel
        setData([
          { name: "Personas dentro", value: personsInsideCount },
          { name: "Personas fuera", value: personsOutsideCount },
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col items-center ">
      <h1 className="ml-2 text-center text-4xl font-bold text-primary">
        {personsInside}
      </h1>
      <PieChart width={sizex} height={sizey}>
        <Pie
          data={data}
          cx={sizex / 2}
          cy={sizey / 2 + -12}
          innerRadius={sizex / 8}
          outerRadius={sizex / 6}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default PieChartInPlace;
