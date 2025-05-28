import axiosInstance from "./AxiosInstance";

export const requestAppointment = async (form: FormData) => {
  try {
    const requestBody = {
      patient_id: form.get("patient_id"),
      doctor_id: form.get("doctor_id"),
      requested_time: form.get("requested_time"),
      reason: form.get("reason"),
    };
    const response = await axiosInstance.post("/appointment/request", requestBody);
    return response.data;
  } catch (error) {
    throw error;
  }
}