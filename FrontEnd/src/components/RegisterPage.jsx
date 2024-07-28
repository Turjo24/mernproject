// RegisterPage.js
import React, { useState } from "react";
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

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegisterInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const { name, email, password } = registerInfo;
    if (!name || !email || !password) {
      return handleError("All fields are required");
    }
    try {
      const url = "https://project-cse-2200.vercel.app/auth/signup";
      console.log("Sending request to:", url);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerInfo),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Full server response:", result);

      const { success, message, error } = result;
      if (success) {
        setRegisterSuccess(true);
        handleSuccess("Registration successful!");
        setTimeout(() => {
          navigate("/LogInPage");
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

  return (
    <div className="max-w-400px mx-auto h-900px">
      <div className="h-full flex flex-col">
        <div className="w-full px-6 sm:px-10 lg:px-40 m-6 sm:m-10 flex justify-start items-center">
          {/* Content here */}
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
                  <div className="mt-8 sm:mt-10 flex justify-center">
                    <AnimatedButton
                      initialText="Register"
                      successText="Registration Successful"
                      onClick={handleRegister}
                      isSuccess={registerSuccess}
                    />
                  </div>
                </form>
              </div>
              <div className="mt-10 sm:mt-14 flex flex-col sm:flex-row justify-between">
                <h3 className="text-xs sm:text-sm font-semibold opacity-50">
                  Already have an account?
                </h3>
                <a
                  href="/login"
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
