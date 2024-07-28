import React, { useEffect } from "react";
import { refreshTokens } from "../utills/auth";

const TokenRefresher = () => {
  useEffect(() => {
    const checkTokenExpiration = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        const payload = JSON.parse(atob(accessToken.split(".")[1]));
        if (payload.exp * 1000 < Date.now()) {
          console.log("Access token has expired. Refreshing...");
          try {
            const newTokens = await refreshTokens();
            console.log("New Access Token:", newTokens.accessToken);
            console.log("New Refresh Token:", newTokens.refreshToken);
            console.log("New JWT Token:", newTokens.jwtToken);
          } catch (error) {
            console.error("Failed to refresh tokens:", error);
          }
        }
      }
    };

    const intervalId = setInterval(checkTokenExpiration, 60000); // Check every minute

    const handleStorage = async (event) => {
      if (
        event.key === "accessToken" ||
        event.key === "refreshToken" ||
        event.key === "jwtToken"
      ) {
        console.log(
          `${event.key} was changed manually. Current value:`,
          event.newValue
        );
        try {
          const newTokens = await refreshTokens();
          console.log("New Access Token:", newTokens.accessToken);
          console.log("New Refresh Token:", newTokens.refreshToken);
          console.log("New JWT Token:", newTokens.jwtToken);
        } catch (error) {
          console.error("Failed to refresh tokens after manual change:", error);
        }
      }
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return null;
};

export default TokenRefresher;
