import axiosInstance from "./AxiosInstance";

export const login = async (email: string, password: string) => {
  try {
    var requestBody = {
      email: email,
      password: password,
    };
    console.log("Request body for login:", requestBody);
    const response = await axiosInstance.post("/auth/login", requestBody);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const register = async (form: FormData) => {
  try {
    const requestBody = {
      username: form.get("name"),
      email: form.get("email"),
      password: form.get("password"),
      phone_number: form.get("phone_number"),
      date_of_birth: form.get("date_of_birth"),
      location: form.get("location"),
    };
    const response = await axiosInstance.post(
      "/auth/register-patient",
      requestBody
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const registerDoctor = async (form: FormData) => {
  try {
    const formData = new FormData();
    const file_attachment = form.get("file_attachment");
    if (file_attachment) {
      formData.append("file_attachment", file_attachment);
    }
    formData.append(
      "RegisForm",
      JSON.stringify({
        username: form.get("name"),
        email: form.get("email"),
        password: form.get("password"),
        phone_number: form.get("phone_number"),
        date_of_birth: form.get("date_of_birth"),
      })
    );
    const response = await axiosInstance.post("/auth/register-doctor",  formData, { 
        headers: { 
            "Content-Type": "multipart/form-data", 
        },
    }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
