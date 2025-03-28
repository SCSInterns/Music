import { useState } from "react";
import {
  ChevronLeftCircleIcon,
  ChevronRightCircleIcon,
  Music,
} from "lucide-react";
import { Mail, Building2 } from "lucide-react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

export default function LoginModal() {
  const [email, setEmail] = useState("");

  const handleGoogleSuccess = async (credentialResponse) => {
    const handleGoogleLogin = () => {
      window.location.href = "http://localhost:5000/api/auth/google";
    };
    handleGoogleLogin();
  };

  const handleEmailLogin = async () => {
    const response = await fetch("/api/auth/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    console.log("Email Login Response:", data);
  };

  return (
    <GoogleOAuthProvider
      clientId={import.meta.env.VITE_PUBLIC_GOOGLE_CLIENT_ID}
    >
      <div className="flex justify-center items-center h-screen mx-4">
        <div className="bg-white max-w-5xl w-full rounded-lg items-center border">
          <div className="flex flex-col md:flex-row w-full h-[90vh] relative">
            <a href="/">
              <button
                className="absolute top-4 left-4 text-gray-600 hover:text-gray-900"
                onClick={() => setIsOpen(false)}
              >
                <ChevronLeftCircleIcon className="h-8 w-8" />
              </button>
            </a>

            {/* Left side - Login Form */}
            <div className=" flex-1 flex flex-col justify-center mx-2">
              <div className="max-w-md mx-auto w-full">
                <a
                  href="/"
                  className="flex items-center justify-center space-x-2 mb-10"
                >
                  <Music className="h-6 w-6 text-primary" />
                  <span className="text-2xl font-bold bg-clip-text text bg-gradient-to-r from-primary to-purple-400">
                    MusicVista
                  </span>
                </a>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  Log in or sign up
                </h1>
                <p className="text-gray-600 mb-6">
                  Use your email or Google to continue.
                </p>

                {/* Google Login */}
                <div className="mb-4">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => console.log("Google Login Failed")}
                  />
                </div>

                {/* Email Login */}
                <div className="space-y-3">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full border border-gray-300 rounded-md pl-10 p-3 focus:outline-none focus:ring-2 focus:ring-primary text-center"
                    />
                  </div>
                  <button
                    onClick={handleEmailLogin}
                    className="w-full bg-primary text-white py-2 rounded-md"
                  >
                    Continue with Email
                  </button>
                </div>

                <div className="mt-6 text-xs text-gray-600">
                  <p>
                    By continuing, you agree to our{" "}
                    <br className="md:hidden block" />
                    <a href="#" className="font-bold hover:underline ">
                      Terms of Use
                    </a>{" "}
                    and{" "}
                    <a
                      href="#"
                      className="font-bold text-primary hover:underline"
                    >
                      Privacy Policy
                    </a>
                    .
                  </p>
                </div>
              </div>
              <div className="text-center mt-8">
                <h4>
                  {" "}
                  Already Registered ?{" "}
                  <span>
                    <a
                      href="/admin/login"
                      className="font-bold text-primary text-base hover:underline"
                    >
                      Login
                    </a>
                  </span>
                  .
                </h4>
              </div>
            </div>

            <div className="hidden md:block md:w-1/2 relative">
              <img
                src="https://images.unsplash.com/photo-1535957998253-26ae1ef29506?q=80&w=1936&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Person using laptop for design"
                className="object-cover w-full h-full rounded-r-lg"
                width={400}
                height={400}
              />
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}
