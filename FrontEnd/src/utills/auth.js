import axios from "axios";

export const refreshTokens = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    console.log("No refresh token available");
    throw new Error("No refresh token available");
  }

  try {
    const response = await axios.post(
      "https://project-cse-2200.vercel.app/auth/refresh-token",
      { refreshToken }
    );
    const {
      accessToken,
      refreshToken: newRefreshToken,
      jwtToken,
    } = response.data;

    console.log("Tokens refreshed successfully");
    // console.log("New Access Token:", accessToken);
    // console.log("New Refresh Token:", newRefreshToken);
    // console.log("New JWT Token:", jwtToken);

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", newRefreshToken);
    localStorage.setItem("jwtToken", jwtToken); // Changed from 'token' to 'jwtToken'

    return { accessToken, refreshToken: newRefreshToken, jwtToken };
  } catch (error) {
    console.error("Error refreshing tokens:", error);
    throw error;
  }
};

export const apiRequest = async (method, url, data = null) => {
  try {
    const jwtToken = localStorage.getItem("jwtToken");
    const response = await axios({
      method,
      url,
      data,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log("Token expired, attempting to refresh...");
      try {
        await refreshTokens();
        // Retry the original request with the new token
        return apiRequest(method, url, data);
      } catch (refreshError) {
        console.error("Failed to refresh tokens:", refreshError);
        throw refreshError;
      }
    }
    throw error;
  }
};
