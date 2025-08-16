import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import loginImage from "../assets/loginPageImage.jpg";
import Password from "./FormElement/Password";
import EmailAddress from "../components/FormElement/EmailAdress";
import AnimatedButton from "./AnimatedButton";

function LogInPage() {
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [userHasBiometric, setUserHasBiometric] = useState(false);
  const [isCheckingBiometric, setIsCheckingBiometric] = useState(false);
  const [isBiometricLogin, setIsBiometricLogin] = useState(false);
  const navigate = useNavigate();

  // Check biometric support when component mounts
  React.useEffect(() => {
    checkBiometricSupport();
  }, []);

  // Check if user has biometric when email changes
  React.useEffect(() => {
    if (loginInfo.email && loginInfo.email.includes('@')) {
      checkUserBiometricStatus(loginInfo.email);
    } else {
      setUserHasBiometric(false);
    }
  }, [loginInfo.email]);

  const checkBiometricSupport = async () => {
    if (window.PublicKeyCredential && 
        await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()) {
      setIsBiometricSupported(true);
    }
  };

  const checkUserBiometricStatus = async (email) => {
    try {
      setIsCheckingBiometric(true);
      const response = await fetch(`https://project-cse-2200.vercel.app/auth/biometric-status/${email}`);
      if (response.ok) {
        const result = await response.json();
        setUserHasBiometric(result.biometricEnabled);
      }
    } catch (error) {
      console.error("Error checking biometric status:", error);
    } finally {
      setIsCheckingBiometric(false);
    }
  };

  const authenticateWithBiometric = async (email) => {
    try {
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);

      const credential = await navigator.credentials.get({
        publicKey: {
          challenge: challenge,
          timeout: 60000,
          userVerification: "required",
        },
      });

      // Convert credential ID to base64 string
      const credentialId = btoa(String.fromCharCode(...new Uint8Array(credential.rawId)));
      return credentialId;
    } catch (error) {
      console.error("Biometric authentication failed:", error);
      throw error;
    }
  };

  const handleBiometricLogin = async () => {
    if (!loginInfo.email) {
      return handleError("Please enter your email first");
    }

    try {
      setIsBiometricLogin(true);
      handleSuccess("Please authenticate with your biometric...");
      
      const biometricData = await authenticateWithBiometric(loginInfo.email);
      
      const url = "https://project-cse-2200.vercel.app/auth/biometric-login";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginInfo.email,
          biometricData: biometricData,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Biometric login response:", result);

      const {
        success,
        message,
        accessToken,
        jwtToken,
        refreshToken,
        name,
        role,
        userId,
      } = result;

      if (success) {
        setLoginSuccess(true);
        handleSuccess("Biometric login successful!");
        
        // Store tokens and user info
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("jwtToken", jwtToken);
        localStorage.setItem("loggedInUser", name);
        localStorage.setItem("userEmail", loginInfo.email);
        localStorage.setItem("userRole", role);
        localStorage.setItem("userId", userId);

        window.dispatchEvent(new Event("storage"));

        setTimeout(() => {
          navigate(role === "admin" ? "/Home" : "/Home");
        }, 2000);
      } else {
        handleError(message || "Biometric login failed");
      }
    } catch (error) {
      handleError("Biometric authentication failed. Please try regular login.");
      console.error("Biometric login error:", error);
    } finally {
      setIsBiometricLogin(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = loginInfo;
    if (!email || !password) {
      return handleError("Email and password are required");
    }
    try {
      const url = "https://project-cse-2200-xi.vercel.app/auth/login";
      console.log("Sending request to:", url);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginInfo),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Full server response:", result);

      const {
        success,
        message,
        accessToken,
        jwtToken,
        refreshToken,
        name,
        role,
        error,
        userId,
      } = result;
      if (success) {
        setLoginSuccess(true);
        handleSuccess("Login successful!");
        console.log("Access Token:", accessToken);
        console.log("Refresh Token:", refreshToken);
        console.log("JWT Token:", jwtToken);
        console.log("User ID:", userId);
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("jwtToken", jwtToken);
        localStorage.setItem("loggedInUser", name);
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userRole", role);
        localStorage.setItem("userId", userId);

        window.dispatchEvent(new Event("storage"));

        setTimeout(() => {
          navigate(role === "admin" ? "/Home" : "/Home");
        }, 3000);
      } else if (error) {
        const details = error?.details[0]?.message;
        handleError(details);
      } else if (!success) {
        handleError(message);
      }
    } catch (err) {
      handleError(err.message);
      console.error("Fetch error:", err);
    }
  };

  const handleSuccess = (message) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const handleError = (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo((prevLoginInfo) => ({
      ...prevLoginInfo,
      [name]: value,
    }));
  };

  return (
    <div className="max-w-400px mx-auto h-900px">
      <div className="h-full flex flex-col">
        <div className="w-full px-6 sm:px-10 lg:px-40 m-6 sm:m-10 flex justify-start items-center">
          {/* Add any missing content here */}
        </div>
        <div className="flex p-6 flex-col sm:flex-row flex-grow items-center justify-center">
          <div className="w-full h-full sm:w-5/12 flex items-center justify-center rounded-xl shadow-2xl">
            <img
              src={loginImage}
              alt="Login"
              className="object-cover h-full w-full rounded-xl"
            />
          </div>
          <div className="w-full sm:w-5/12 px-6 sm:px-28 py-6 sm:py-12 ml-6 sm:ml-10 flex flex-col relative bg-white">
            <div className="mt-5 flex flex-col justify-between h-full">
              <div>
                <p className="text-lg sm:text-2xl font-semibold">
                  Welcome Back!
                </p>
                <p className="mt-2 font-semibold text-sm sm:text-base opacity-50">
                  Please login to your account
                </p>
                <form
                  className="mt-10 sm:mt-20 space-y-4 sm:space-y-7"
                  onSubmit={handleLogin}
                >
                  <EmailAddress
                    name="email"
                    value={loginInfo.email}
                    onChange={handleChange}
                  />
                  
                  {/* Show biometric status */}
                  {loginInfo.email && isBiometricSupported && (
                    <div className="text-sm">
                      {isCheckingBiometric ? (
                        <span className="text-gray-500">🔍 Checking biometric status...</span>
                      ) : userHasBiometric ? (
                        <span className="text-green-600">✅ Biometric login available</span>
                      ) : (
                        <span className="text-gray-500">🔐 No biometric registered</span>
                      )}
                    </div>
                  )}

                  <Password
                    name="password"
                    value={loginInfo.password}
                    onChange={handleChange}
                  />
                  
                  <div className="text-right">
                    <a
                      href="#"
                      className="text-sm font-bold text-indigo-400 hover:text-indigo-700"
                    >
                      Forgot Password?
                    </a>
                  </div>

                  {/* Biometric Login Button */}
                  {isBiometricSupported && userHasBiometric && (
                    <div className="flex justify-center mb-4">
                      <button
                        type="button"
                        onClick={handleBiometricLogin}
                        disabled={isBiometricLogin}
                        className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold rounded-lg shadow-md transition duration-200 flex items-center justify-center space-x-2"
                      >
                        <span>🔐</span>
                        <span>{isBiometricLogin ? "Authenticating..." : "Login with Biometric"}</span>
                      </button>
                    </div>
                  )}

                  {/* Divider */}
                  {isBiometricSupported && userHasBiometric && (
                    <div className="flex items-center justify-center space-x-4">
                      <div className="flex-1 border-t border-gray-300"></div>
                      <span className="text-gray-500 text-sm">OR</span>
                      <div className="flex-1 border-t border-gray-300"></div>
                    </div>
                  )}

                  <div className="mt-8 sm:mt-10 flex justify-center">
                    <AnimatedButton
                      initialText="Log In"
                      successText="Login Successful"
                      onClick={handleLogin}
                      isSuccess={loginSuccess}
                    />
                  </div>
                </form>
              </div>
              <div className="mt-10 sm:mt-14 flex flex-col sm:flex-row justify-between">
                <h3 className="text-xs sm:text-sm font-semibold opacity-50">
                  Don't have an account yet?
                </h3>
                <a
                  href="/RegisterPage"
                  className="mt-2 sm:mt-0 text-xs sm:text-sm font-bold text-indigo-400 hover:text-indigo-700"
                >
                  Create an account
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default LogInPage;