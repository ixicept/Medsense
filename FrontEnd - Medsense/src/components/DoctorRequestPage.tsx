import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { getCurrentUser } from "../utils/auth";

interface DoctorRequest {
  id: number;
  user_id: number;
  file_path: string;
  status: string;
  user: {
    id: number;
    name: string;
    email: string;
    phone_number: string;
  };
}

export default function DoctorRequestsPage() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  
  const [requests, setRequests] = useState<DoctorRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingFile, setViewingFile] = useState<string | null>(null);
  
  useEffect(() => {
    // Redirect non-admin users
    if (!currentUser || currentUser.role !== 'admin') {
      toast.error("You don't have permission to view this page");
      navigate('/home-page');
      return;
    }
    
    fetchDoctorRequests();
  }, []);

  const fetchDoctorRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3001/doctor-requests");
      setRequests(response.data);
    } catch (error) {
      console.error("Error fetching doctor requests:", error);
      toast.error("Failed to load doctor verification requests");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId: number, userId: number) => {

    console.log("req Id: ", requestId)
    console.log("user Id: ", userId)

    try {
      await axios.put(`http://localhost:3001/doctor-requests/${requestId}/approve`, { userId });
      toast.success("Doctor application approved");
      fetchDoctorRequests(); // Refresh the list
    } catch (error) {
      console.error("Error approving doctor:", error);
      toast.error("Failed to approve doctor");
    }
  };

  const handleReject = async (requestId: number) => {
    try {
      await axios.put(`http://localhost:3001/doctor-requests/${requestId}/reject`);
      toast.success("Doctor application rejected");
      fetchDoctorRequests(); // Refresh the list
    } catch (error) {
      console.error("Error rejecting doctor:", error);
      toast.error("Failed to reject doctor");
    }
  };

  const viewFile = (filePath: string) => {
    setViewingFile(`http://localhost:3001/uploads/${filePath.split('/').pop()}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-sky-800">Doctor Verification Requests</h1>
        <div className="text-sm text-gray-500">
          Displaying {requests.length} pending {requests.length === 1 ? 'request' : 'requests'}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-60">
          <svg className="animate-spin h-8 w-8 text-sky-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center shadow-md">
          <p className="text-gray-500">No pending doctor verification requests</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {requests.map((request) => (
            <div key={request.id} className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex flex-col md:flex-row justify-between">
                <div className="mb-4 md:mb-0">
                  <h3 className="font-semibold text-lg text-sky-700">{request.user.name}</h3>
                  <p className="text-gray-600">{request.user.email}</p>
                  <p className="text-gray-600">{request.user.phone_number}</p>
                  {/* <p className="mt-2 text-sm text-gray-500">
                    Submitted: {new Date(request.created_at).toLocaleDateString()}
                  </p> */}
                </div>
                <div className="flex flex-col md:flex-row gap-3">
                  <button
                    onClick={() => viewFile(request.file_path)}
                    className="px-4 py-2 bg-sky-100 text-sky-600 rounded-md hover:bg-sky-200 transition-colors"
                  >
                    View Credentials
                  </button>
                  <button
                    onClick={() => handleApprove(request.id, request.user_id)}
                    className="px-4 py-2 bg-emerald-100 text-emerald-600 rounded-md hover:bg-emerald-200 transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(request.id)}
                    className="px-4 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* File viewer modal */}
      {viewingFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[80vh] overflow-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-medium">Doctor Credentials</h3>
              <button onClick={() => setViewingFile(null)} className="text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="p-6">
              {viewingFile.endsWith('.pdf') ? (
                <iframe src={viewingFile} className="w-full h-[60vh]" />
              ) : (
                <img src={viewingFile} alt="Doctor credentials" className="max-w-full h-auto" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}