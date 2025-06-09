import React, { useEffect, useState } from "react";
import axiosInstance from "../services/AxiosInstance";
import { toast } from "react-toastify";

interface Hospital {
  Name: string;
  Location: string;
  Description: string;
}

export default function CreateHospitalPage() {
  const [form, setForm] = useState({
    name: "",
    location: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loadingHospitals, setLoadingHospitals] = useState(true);

  // Fetch all hospitals
  const fetchHospitals = async () => {
    setLoadingHospitals(true);
    try {
      const res = await axiosInstance.get("/hospital");
      setHospitals(Array.isArray(res.data.hospitals) ? res.data.hospitals : []);
    } catch {
      toast.error("Failed to fetch hospitals.");
    } finally {
      setLoadingHospitals(false);
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, []);

  // Form logic
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    if (!form.name.trim()) {
      toast.error("Hospital name is required.");
      return false;
    }
    if (!form.location.trim()) {
      toast.error("Hospital location is required.");
      return false;
    }
    if (!form.description.trim()) {
      toast.error("Description is required.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await axiosInstance.post("/hospital", {
        name: form.name,
        location: form.location,
        description: form.description,
      });
      toast.success("Hospital created successfully!");
      setForm({
        name: "",
        location: "",
        description: "",
      });
      fetchHospitals();
    } catch {
      toast.error("Failed to create hospital.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-lg mx-auto bg-white border border-sky-200 shadow-lg rounded-lg p-8 mb-10">
        <h2 className="text-2xl font-bold text-center text-sky-700 mb-6">
          Create New Hospital
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Hospital Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-sky-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-sky-400 outline-none"
              placeholder="Hospital Name"
              required
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              className="w-full border border-sky-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-sky-400 outline-none"
              placeholder="Location"
              required
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border border-sky-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-sky-400 outline-none min-h-[90px] resize-y"
              placeholder="Describe the hospital..."
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 rounded-md font-medium text-white bg-sky-500 hover:bg-sky-600 transition"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Hospital"}
          </button>
        </form>
      </div>

      {/* All hospitals table/list */}
      <div className="max-w-2xl mx-auto">
        <h3 className="text-xl font-bold text-sky-700 mb-4">
          Current Hospitals
        </h3>
        <div className="bg-white border border-sky-100 rounded-lg shadow-md">
          {loadingHospitals ? (
            <div className="p-6 text-sky-500">Loading hospitals...</div>
          ) : hospitals.length === 0 ? (
            <div className="p-6 text-gray-500">No hospitals available.</div>
          ) : (
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-sky-100">
                  <th className="text-left px-4 py-2">Name</th>
                  <th className="text-left px-4 py-2">Location</th>
                  <th className="text-left px-4 py-2">Description</th>
                </tr>
              </thead>
              <tbody>
                {hospitals.map((hosp) => (
                  <tr key={hosp.Name} className="border-b border-sky-50">
                    <td className="px-4 py-2">{hosp.Name}</td>
                    <td className="px-4 py-2">{hosp.Location}</td>
                    <td className="px-4 py-2">{hosp.Description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
