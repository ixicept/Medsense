import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { getCurrentUser } from "../utils/auth";

interface DoctorRegistration {
  ID: string;
  Username: string;
  Email: string;
  Role: string;
  DateOfBirth: string;
  PhoneNumber: string;
  FileAttachment: string; // base64 string (bytea)
  Status: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export default function DoctorRequestsPage() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const [requests, setRequests] = useState<DoctorRegistration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser || currentUser.role !== "admin") {
      toast.error("You don't have permission to view this page");
      navigate("/home-page");
      return;
    }
    fetchDoctorRequests();
    // eslint-disable-next-line
  }, []);

  const fetchDoctorRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:8080/api/doctor-registration"
      );
      setRequests(response.data.payload || []);
    } catch (error) {
      console.error("Error fetching doctor requests:", error);
      toast.error("Failed to load doctor registration requests");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await axios.post(
        "http://localhost:8080/api/doctor-registration/approve",
        {
          id: id,
          admin_id: "lol",
        }
      );
      toast.success("Doctor registration approved");
      fetchDoctorRequests();
    } catch (error) {
      console.error("Error approving doctor:", error);
      toast.error("Failed to approve doctor");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await axios.post(
        "http://localhost:8080/api/doctor-registration/decline",
        {
          id: id,
          admin_id: "lol",
        }
      );
      toast.success("Doctor registration rejected");
      fetchDoctorRequests();
    } catch (error) {
      console.error("Error rejecting doctor:", error);
      toast.error("Failed to reject doctor");
    }
  };

  // Download the base64-encoded PDF file
  const handleDownload = (fileBase64: string, username: string) => {
    const byteCharacters = atob(fileBase64);
    const byteNumbers = Array.from(byteCharacters, (c) => c.charCodeAt(0));
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${username}_credentials.pdf`;
    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(url);
    link.remove();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <style>
        {`
        .pretty-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.28em;
          border: none;
          font-weight: 600;
          font-size: 0.93em;
          border-radius: 999px;
          padding: 0.32em 0.68em;
          margin: 0 0.07em;
          min-width: unset;
          box-shadow: 0 1.5px 6px rgba(32, 95, 199, 0.06);
          transition: transform 0.11s, box-shadow 0.16s, background 0.12s;
          cursor: pointer;
          outline: none;
          line-height: 1.3;
        }
        .btn-download {
          background: #edf5ff;
          color: #1976d2;
        }
        .btn-download:hover {
          background: #d6e8fd;
          transform: translateY(-0.5px) scale(1.025);
          box-shadow: 0 2.5px 12px #1976d220;
        }
        .btn-accept {
          background: #e7faef;
          color: #21936b;
        }
        .btn-accept:hover {
          background: #cef5df;
          transform: translateY(-0.5px) scale(1.025);
          box-shadow: 0 2.5px 12px #1eb9781a;
        }
        .btn-reject {
          background: #fdeaea;
          color: #c82437;
        }
        .btn-reject:hover {
          background: #ffd2d6;
          transform: translateY(-0.5px) scale(1.025);
          box-shadow: 0 2.5px 12px #c8243720;
        }
        .doc-card-btns {
          display: flex;
          flex-direction: row;
          gap: 0.4em;
          margin-top: 0.6em;
        }
        @media (max-width: 768px) {
          .doc-card-btns { flex-direction: column; gap: 0.25em; }
        }
        `}
      </style>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-sky-800">
          Doctor Registration Requests
        </h1>
        <div className="text-sm text-gray-500">
          Displaying {requests.length} pending{" "}
          {requests.length === 1 ? "request" : "requests"}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-60">
          <svg
            className="animate-spin h-8 w-8 text-sky-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center shadow-md">
          <p className="text-gray-500">
            No pending doctor registration requests
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {requests.map((request) => (
            <div
              key={request.ID}
              className="bg-white rounded-lg p-6 shadow-md"
              style={{ width: "70vw", margin: "0 auto" }}
            >
              <div className="flex flex-col md:flex-row justify-between">
                <div className="mb-3 md:mb-0">
                  <h3 className="font-semibold text-lg text-sky-700">
                    {request.Username}
                  </h3>
                  <p className="text-gray-600">{request.Email}</p>
                  <p className="text-gray-600">{request.PhoneNumber}</p>
                  <p className="text-gray-600">
                    Date of Birth: {request.DateOfBirth}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Submitted: {new Date(request.CreatedAt).toLocaleString()}
                  </p>
                </div>
                <div className="doc-card-btns md:items-start items-stretch justify-end">
                  <button
                    onClick={() =>
                      handleDownload(request.FileAttachment, request.Username)
                    }
                    className="pretty-btn btn-download"
                  >
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M10 3v10m0 0l-4-4m4 4l4-4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <rect
                        x="4"
                        y="15"
                        width="12"
                        height="2"
                        rx="1"
                        fill="currentColor"
                        opacity="0.12"
                      />
                    </svg>
                    Download
                  </button>
                  <button
                    onClick={() => handleApprove(request.ID)}
                    className="pretty-btn btn-accept"
                  >
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M6 10l3 3 5-5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Accept
                  </button>
                  <button
                    onClick={() => handleReject(request.ID)}
                    className="pretty-btn btn-reject"
                  >
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M6 6l8 8M6 14L14 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
