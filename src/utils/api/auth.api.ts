import API from "@/utils/api/fetchclient";

// LOGIN
export const loginUser = async (data: {
  email: string;
  password: string;
}) => {
  try {
    return await API(
      "/users/login/",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      false // ❗ no token
    );
  } catch {
    throw new Error("Invalid credentials");
  }
};

// REGISTER
export const registerUser = async (data: {
  username: string;
  email: string;
  password: string;
}) => {
  try {
    return await API(
      "/users/register/",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      false // ❗ no token
    );
  } catch {
    throw new Error("Registration failed");
  }
};