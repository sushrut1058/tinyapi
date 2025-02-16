import React, { useContext } from "react";
import { GoogleLogin } from "@react-oauth/google";
import AuthContext from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { FaRocket, FaLink, FaServer } from "react-icons/fa6"; // Add this import at the top

const Landing = () => {
  const url = import.meta.env.VITE_API_URL;
  const { login, accessToken } = useContext(AuthContext);

  const handleLogin = async (credentialResponse) => {
    try {
      const response = await fetch(`${url}/auth/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });
      const data = await response.json();
      if (response.ok) {
        login(data);
        window.location.href = "/home";
      } else {
        console.log(data);
        console.log("Failed");
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return !accessToken ? (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white relative overflow-hidden flex flex-col justify-center">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden opacity-15">
        <div className="relative w-full h-full animate-slide">
          {Array.from({ length: 10 }).map((_, i) => (
            <pre
              key={i}
              className="absolute text-xs md:text-sm font-mono text-gray-500 opacity-60"
              style={{ top: `${i * 10}%`, left: `${Math.random() * 50}%` }}
            >
              {`const api = new tinyAPI();
await api.deploy({
route: '/users',
method: 'POST',
handler: async (req, res) => {
const user = await db.create(req.body);
return { status: 'success', data: user };
}
});`}
            </pre>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          tinyAPI<span className="text-blue-300">.</span>
        </h1>
        <p className="text-lg md:text-2xl mb-6 text-gray-300 max-w-xl">
          Deploy production-ready APIs instantly. Code, test and deploy in seconds.
        </p>

        {/* CTA Section */}
        <div className="bg-gray-800/60 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-gray-700 w-full max-w-md">
          <p className="text-lg font-semibold text-gray-200 mb-4">
            Get started with tinyAPI today
          </p>
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={(credentialResponse) => handleLogin(credentialResponse)}
              onError={() => console.error("Login failed")}
              theme="filled_black"
              shape="pill"
              size="large"
            />
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {[
            { 
              title: "Quick Setup", 
              desc: "Start writing code with ready-to-use templates.",
              icon: <FaRocket className="text-3xl text-blue-400 mb-3" />
            },
            { 
              title: "Instant URL", 
              desc: "Test your API on our playground.",
              icon: <FaLink className="text-3xl text-blue-400 mb-3" />
            },
            { 
              title: "Production Ready", 
              desc: "Deploy and generate a production-ready API URL",
              icon: <FaServer className="text-3xl text-blue-400 mb-3" />
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-gray-800/60 backdrop-blur-md rounded-lg border border-gray-700 hover:border-blue-500 hover:shadow-xl transition-all flex flex-col items-center text-center"
            >
              {feature.icon}
              <h3 className="text-xl font-semibold text-blue-400 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-300">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 text-gray-400 text-sm text-center w-full">
        <p>© {new Date().getFullYear()} tinyAPI. All rights reserved.</p>
      </footer>
    </div>
  ) : (
    <Navigate to="/home" />
  );
};

// CSS Animation
const styles = `
@keyframes slide {
  0% { transform: translateY(0); }
  100% { transform: translateY(-100%); }
}
.animate-slide {
  animation: slide 50s linear infinite;
}
`;

export default Landing;
