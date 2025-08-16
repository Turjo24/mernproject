import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import registerImage from "../assets/RegisterPageImage.jpg";
import Password from "./FormElement/Password";
import EmailAddress from "./FormElement/EmailAdress";
import AnimatedButton from "./AnimatedButton";

function RegisterPage() {
  const [registerInfo, setRegisterInfo] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [isBiometricSupported, setIsBiometricSupported] = useState(null);
  const [enableBiometric, setEnableBiometric] = useState(false);
  const [isRegisteringBiometric, setIsRegisteringBiometric] = useState(false);

  const navigate = useNavigate();

  // ✅ BASE URL - এটা তোমার actual backend URL দিবি
  const API_BASE_URL = "https://project-cse-2200-xi.vercel.app";

  // ✅ Check biometric support
  useEffect(() => {
    const checkBiometricSupport = async () => {
      try {
        if (
          window.PublicKeyCredential &&
          (await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable())
        ) {
          setIsBiometricSupported(true);
        } else {
          setIsBiometricSupported(false);
        }
      } catch (error) {
        console.error("Error checking biometric support:", error);
        setIsBiometricSupported(false);
      }
    };

    checkBiometricSupport();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegisterInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // ✅ Convert ArrayBuffer to Base64
  const toBase64 = (buffer) =>
    btoa(String.fromCharCode(...new Uint8Array(buffer)));

  // ✅ Generate Biometric Credential - Fixed করেছি
  const generateBiometricCredential = async (email) => {
    try {
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);

      const credential = await navigator.credentials.create({
        publicKey: {
          challenge,
          rp: {
            name: "Your App Name",
            id: window.location.hostname,
          },
          user: {
            id: new TextEncoder().encode(email),
            name: email,
            displayName: registerInfo.name || email,
          },
          pubKeyCredParams: [{ alg: -7, type: "public-key" }],
          authenticatorSelection: {
            authenticatorAttachment: "platform",
            userVerification: "required",
            requireResidentKey: false,
          },
          timeout: 60000,
          attestation: "direct",
        },
      });

      // ✅ এই format backend expect করে
      return {
        id: credential.id,
        rawId: toBase64(credential.rawId),
        type: credential.type,
        response: {
          attestationObject: toBase64(credential.response.attestationObject),
          clientDataJSON: toBase64(credential.response.clientDataJSON),
        },
      };
    } catch (error) {
      console.error("Biometric registration failed:", error);
      throw error;
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const { name, email, password } = registerInfo;
    
    if (!name || !email || !password) {
      return handleError("All fields are required");
    }

    try {
      setIsRegisteringBiometric(true);
      let biometricData = null;

      // ✅ Biometric Registration if enabled
      if (enableBiometric && isBiometricSupported) {
        try {
          handleSuccess("Please complete biometric registration...");
          biometricData = await generateBiometricCredential(email);
          console.log("Generated biometric credential:", biometricData);
        } catch (biometricError) {
          console.error("Biometric error:", biometricError);
          handleError("Biometric registration failed, continuing with normal signup...");
        }
      }

      // ✅ API Call - সঠিক URL এবং data format
      const url = `${API_BASE_URL}/auth/signup`;
      console.log("Sending signup request to:", url);

      const requestBody = {
        name,
        email,
        password,
        ...(biometricData && { biometricData })
      };

      console.log("Request body:", requestBody);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server error response:", errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Full server response:", result);

      const { success, message, error, biometricEnabled } = result;
      
      if (success) {
        setRegisterSuccess(true);
        const successMsg = biometricEnabled
          ? "Registration successful with biometric! 🎉"
          : "Registration successful! 🎉";
        handleSuccess(successMsg);
        
        setTimeout(() => {
          navigate("/LogInPage");
        }, 3000);
      } else if (error) {
        const details = error?.details?.[0]?.message || error.message || message;
        handleError(details);
      } else {
        handleError(message || "Registration failed");
      }
    } catch (err) {
      console.error("Registration error:", err);
      handleError(`Registration failed: ${err.message}`);
    } finally {
      setIsRegisteringBiometric(false);
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
    });
  };

  const handleError = (message) => {
    toast.error(message, { 
      position: "top-right", 
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  return (
    <div className="max-w-400px mx-auto h-900px">
      <div className="h-full flex flex-col">
        <div className="w-full px-6 sm:px-10 lg:px-40 m-6 sm:m-10 flex justify-start items-center">
          {/* Header or Logo */}
        </div>
        <div className="flex p-6 flex-col sm:flex-row flex-grow items-center justify-center">
          <div className="w-full h-full sm:w-5/12 flex items-center justify-center rounded-xl shadow-2xl">
            <img
              src={registerImage}
              alt="Register"
              className="object-cover h-full w-full rounded-xl"
            />
          </div>
          <div className="w-full sm:w-5/12 px-6 sm:px-28 py-6 sm:py-12 ml-6 sm:ml-10 flex flex-col relative bg-white">
            <div className="mt-5 flex flex-col justify-between h-full">
              <div>
                <p className="text-lg sm:text-2xl font-semibold">
                  Create an Account
                </p>
                <p className="mt-2 font-semibold text-sm sm:text-base opacity-50">
                  Please fill in your details
                </p>
                <form
                  className="mt-10 sm:mt-20 space-y-4 sm:space-y-7"
                  onSubmit={handleRegister}
                >
                  <input
                    type="text"
                    name="name"
                    value={registerInfo.name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                  <EmailAddress
                    name="email"
                    value={registerInfo.email}
                    onChange={handleChange}
                  />
                  <Password
                    name="password"
                    value={registerInfo.password}
                    onChange={handleChange}
                  />

                  {/* ✅ Biometric Option */}
                  {isBiometricSupported === null && (
                    <p className="text-gray-500 text-sm">
                      🔍 Checking biometric support...
                    </p>
                  )}
                  
                  {isBiometricSupported && (
                    <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-all duration-300">
                      <input
                        type="checkbox"
                        id="enableBiometric"
                        checked={enableBiometric}
                        onChange={(e) => setEnableBiometric(e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label
                        htmlFor="enableBiometric"
                        className="flex items-center space-x-2 text-sm font-medium text-gray-700 cursor-pointer"
                      >
                        <span className="text-xl">🔐</span>
                        <span>Enable Biometric Login (Fingerprint/Face ID)</span>
                      </label>
                    </div>
                  )}
                  
                  {isBiometricSupported === false && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-yellow-800 text-sm">
                        ⚠️ Biometric login not supported on this device/browser.
                      </p>
                    </div>
                  )}

                  <div className="mt-8 sm:mt-10 flex justify-center">
                    <AnimatedButton
                      initialText={
                        isRegisteringBiometric
                          ? "Setting up Biometric..."
                          : "Register"
                      }
                      successText="Registration Successful!"
                      onClick={handleRegister}
                      isSuccess={registerSuccess}
                      disabled={isRegisteringBiometric}
                    />
                  </div>
                </form>
              </div>
              <div className="mt-10 sm:mt-14 flex flex-col sm:flex-row justify-between">
                <h3 className="text-xs sm:text-sm font-semibold opacity-50">
                  Already have an account?
                </h3>
                <a
                  href="/LogInPage"
                  className="mt-2 sm:mt-0 text-xs sm:text-sm font-bold text-indigo-400 hover:text-indigo-700"
                >
                  Log in
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

export default RegisterPage;