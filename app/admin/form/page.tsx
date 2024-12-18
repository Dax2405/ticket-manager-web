"use client";
import React, { useState, useEffect } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { API_BASE_URL } from "@/lib/config";
import { cn } from "@/lib/utils";

export default function Form() {
  const [files, setFiles] = useState<File[]>([]);
  const [enterprises, setEnterprises] = useState<
    { id: string; name: string }[]
  >([]);
  const [places, setPlaces] = useState<{ id: string; name: string }[]>([]);
  const [newEnterprise, setNewEnterprise] = useState("");
  const [newPlace, setNewPlace] = useState("");
  const [selectedEnterprise, setSelectedEnterprise] = useState("1");
  const [selectedPlace, setSelectedPlace] = useState("1");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      setToken(token);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetch(`${API_BASE_URL}/tickets/enterprises`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => setEnterprises(data));

      fetch(`${API_BASE_URL}/tickets/places`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => setPlaces(data));
    }
  }, [token]);

  const handleFileUpload = (files: File[]) => {
    setFiles(files);
  };

  const handleAddEnterprise = async () => {
    if (token) {
      await fetch(`${API_BASE_URL}/tickets/enterprises`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newEnterprise }),
      });
      const response = await fetch(`${API_BASE_URL}/tickets/enterprises`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setEnterprises(data);
      setNewEnterprise("");
    }
  };

  const handleAddPlace = async () => {
    if (token) {
      await fetch(`${API_BASE_URL}/tickets/places`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newPlace }),
      });
      const response = await fetch(`${API_BASE_URL}/tickets/places`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setPlaces(data);
      setNewPlace("");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (token) {
      const formData = new FormData();

      const name = (
        e.currentTarget.elements.namedItem("name") as HTMLInputElement
      ).value;
      const last_name = (
        e.currentTarget.elements.namedItem("last_name") as HTMLInputElement
      ).value;
      const id_number = (
        e.currentTarget.elements.namedItem("id_number") as HTMLInputElement
      ).value;
      const email = (
        e.currentTarget.elements.namedItem("email") as HTMLInputElement
      ).value;
      const observations = (
        e.currentTarget.elements.namedItem("observations") as HTMLInputElement
      ).value;

      formData.append("name", name);
      formData.append("last_name", last_name);
      formData.append("id_number", id_number);
      formData.append("email", email);
      formData.append("observations", observations);
      formData.append("destination", selectedPlace);
      formData.append("enterprise", selectedEnterprise);

      if (files.length > 0) {
        formData.append("image", files[0]);
      }

      try {
        const response = await fetch(`${API_BASE_URL}/tickets/ticket`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (response.ok) {
          setMessage({ type: "success", text: "Creación correcta" });
        } else {
          const errorData = await response.json();
          const errorMessage = Object.entries(errorData)
            .map(([key, value]) => `${key}: ${(value as string[]).join(", ")}`)
            .join("\n");
          setMessage({
            type: "error",
            text: errorMessage || "Error al crear",
          });
        }
      } catch (error) {
        setMessage({ type: "error", text: "Error al crear" });
      }
    }
  };

  return (
    <div className="flex-1 min-h-screen p-4">
      <div className="w-full mx-auto p-8 rounded-md shadow-md">
        <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
          Formulario de registro 🔒
        </h2>
        <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
          Ingrese datos del registro
        </p>

        {message && (
          <div
            className={`p-4 mb-4 text-sm rounded-md ${
              message.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}

        <form className="my-8" onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
            <LabelInputContainer>
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" name="name" placeholder="Tyler" type="text" />
            </LabelInputContainer>
            <LabelInputContainer>
              <Label htmlFor="last_name">Apellido</Label>
              <Input
                id="last_name"
                name="last_name"
                placeholder="Durden"
                type="text"
              />
            </LabelInputContainer>
          </div>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
            <LabelInputContainer className="mb-4">
              <Label htmlFor="id_number">Cédula</Label>
              <Input
                id="id_number"
                name="id_number"
                placeholder="17********"
                type="text"
              />
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                placeholder="projectmayhem@fc.com"
                type="email"
              />
            </LabelInputContainer>
          </div>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
            <LabelInputContainer className="mb-4">
              <Label htmlFor="destination">Destino</Label>
              <select
                id="destination"
                name="destination"
                value={selectedPlace}
                onChange={(e) => setSelectedPlace(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              >
                {places.map((place) => (
                  <option
                    key={place.id}
                    value={place.id}
                    className=" dark:bg-background text-black dark:text-white"
                  >
                    {place.name}
                  </option>
                ))}
                <option
                  value="other"
                  className=" dark:bg-background text-black dark:text-white"
                >
                  Otro
                </option>
              </select>
              {selectedPlace === "other" && (
                <div className="mt-2">
                  <Input
                    value={newPlace}
                    onChange={(e) => setNewPlace(e.target.value)}
                    placeholder="Nuevo destino"
                    type="text"
                  />
                  <button
                    className="bg-primary rounded mt-2"
                    type="button"
                    onClick={handleAddPlace}
                  >
                    <div className="p-1">Agregar</div>
                  </button>
                </div>
              )}
            </LabelInputContainer>

            <LabelInputContainer className="mb-4">
              <Label htmlFor="enterprise">Empresa</Label>
              <select
                id="enterprise"
                name="enterprise"
                value={selectedEnterprise}
                onChange={(e) => {
                  console.log("Nuevo valor seleccionado:", e.target.value);
                  setSelectedEnterprise(e.target.value);
                }}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              >
                {enterprises.map((enterprise) => (
                  <option
                    key={enterprise.id}
                    value={enterprise.id}
                    className="bg-white dark:bg-background  dark:text-white"
                  >
                    {enterprise.name}
                  </option>
                ))}
                <option
                  value="other"
                  className="bg-white dark:bg-background  dark:text-white"
                >
                  Otro
                </option>
              </select>
              {selectedEnterprise === "other" && (
                <div className="mt-2">
                  <Input
                    value={newEnterprise}
                    onChange={(e) => setNewEnterprise(e.target.value)}
                    placeholder="Nueva empresa"
                    type="text"
                  />
                  <button
                    className="bg-primary rounded mt-2"
                    type="button"
                    onClick={handleAddEnterprise}
                  >
                    <div className="p-1">Agregar</div>
                  </button>
                </div>
              )}
            </LabelInputContainer>
          </div>

          <LabelInputContainer className="mb-4">
            <Label htmlFor="observations">Observaciones</Label>
            <Input
              id="observations"
              name="observations"
              placeholder="..."
              type="text"
            />
          </LabelInputContainer>
          <FileUpload onChange={handleFileUpload} />
          <button
            className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            type="submit"
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
