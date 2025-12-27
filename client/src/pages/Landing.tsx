import React, { useContext, useEffect, useRef } from "react";
import { GoogleLogin } from "@react-oauth/google";
import AuthContext from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";

const Landing = () => {
  const url = import.meta.env.VITE_API_URL;
  const { login, accessToken } = useContext(AuthContext);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show');
          } else {
            entry.target.classList.remove('show');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );

    const elements = document.querySelectorAll('.scroll-animate');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white relative">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden opacity-15 pointer-events-none">
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
      <div className="relative z-10 flex flex-col items-center text-center px-6 pt-32 md:pt-40 pb-20 min-h-screen">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 animate-fade-in">
          tinyAPI<span className="text-blue-300">.</span>
        </h1>
        <p className="text-lg md:text-2xl mb-4 text-gray-300 max-w-2xl animate-fade-in-delay-1">
          Deploy production-ready APIs instantly. Write code, create databases, and ship serverless backends in seconds.
        </p>
        <p className="text-sm text-gray-400 mb-16 animate-fade-in-delay-2">Join 500+ developers shipping APIs faster</p>

        {/* CTA Section */}
        <div className="w-full max-w-md mb-24 scroll-animate">
          <div className="group relative">
            {/* Glow effect on hover */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl opacity-20 group-hover:opacity-40 blur transition duration-300"></div>

            {/* Main card */}
            <div className="relative bg-gray-900 backdrop-blur-lg p-8 rounded-xl border border-gray-700">
              <p className="text-lg font-semibold text-gray-200 mb-6">
                Get started with tinyAPI today
              </p>
              <div className="flex justify-center">
                <div className="hover:scale-105 transition-transform duration-200">
                  <GoogleLogin
                    onSuccess={(credentialResponse) => handleLogin(credentialResponse)}
                    onError={() => console.error("Login failed")}
                    theme="filled_black"
                    shape="pill"
                    size="large"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Code Example Section */}
        <div className="w-full max-w-4xl mb-24 scroll-animate">
          <h6 className="text-2xl font-bold mb-3 text-gray-100">No infrastructure, no deployment pipelines</h6>
          <p className="text-gray-400 mb-8"></p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
              <div className="bg-gray-800 px-4 py-2 text-xs text-gray-400 border-b border-gray-700">
                main.py
              </div>
              <pre className="p-4 text-sm font-mono text-left overflow-x-auto">
                <code>
                  <span className="text-purple-400">from</span> <span className="text-blue-400">db</span> <span className="text-purple-400">import</span> <span className="text-blue-400">DB</span>
                  {'\n\n'}
                  <span className="text-green-400">def</span> <span className="text-yellow-400">handler</span><span className="text-gray-300">(</span><span className="text-orange-400">req</span><span className="text-gray-300">):</span>
                  {'\n'}
                  {'  '}<span className="text-gray-500"># Create a new user</span>
                  {'\n'}
                  {'  '}<span className="text-blue-400">db</span> <span className="text-gray-300">=</span> <span className="text-yellow-400">DB</span><span className="text-gray-300">()</span>
                  {'\n'}
                  {'  '}<span className="text-blue-400">db</span><span className="text-gray-300">.</span><span className="text-yellow-400">connect</span><span className="text-gray-300">()</span>
                  {'\n'}
                  {'  '}<span className="text-blue-400">table</span> <span className="text-gray-300">=</span> <span className="text-blue-400">db</span><span className="text-gray-300">.</span><span className="text-yellow-400">load</span><span className="text-gray-300">(</span><span className="text-green-300">"users"</span><span className="text-gray-300">)</span>
                  {'\n'}
                  {'  '}<span className="text-blue-400">table</span><span className="text-gray-300">.</span><span className="text-yellow-400">insert</span><span className="text-gray-300">(</span><span className="text-orange-400">req</span><span className="text-gray-300">.</span><span className="text-blue-400">body</span><span className="text-gray-300">)</span>
                  {'\n\n'}
                  {'  '}<span className="text-purple-400">return</span> <span className="text-gray-300">{'{'}</span>
                  {'\n'}
                  {'    '}<span className="text-green-300">"status"</span><span className="text-gray-300">:</span> <span className="text-green-300">"success"</span>
                  {'\n'}
                  {'  '}<span className="text-gray-300">{'}'}</span>
                </code>
              </pre>
            </div>

            <div className="flex flex-col justify-center space-y-4">
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold group-hover:scale-110 group-hover:bg-blue-600 transition-all duration-300">1</div>
                <div className="text-left">
                  <p className="font-semibold text-gray-200 group-hover:text-blue-400 transition-colors duration-300">Write Code</p>
                  <p className="text-sm text-gray-400">Use our built-in ORM for DB operations</p>
                </div>
              </div>
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold group-hover:scale-110 group-hover:bg-blue-600 transition-all duration-300">2</div>
                <div className="text-left">
                  <p className="font-semibold text-gray-200 group-hover:text-blue-400 transition-colors duration-300">Test in playground</p>
                  <p className="text-sm text-gray-400">See results instantly</p>
                </div>
              </div>
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold group-hover:scale-110 group-hover:bg-blue-600 transition-all duration-300">3</div>
                <div className="text-left">
                  <p className="font-semibold text-gray-200 group-hover:text-blue-400 transition-colors duration-300">Deploy</p>
                  <p className="text-sm text-gray-400">Get your production URL</p>
                </div>
              </div>

              <div className="mt-4 p-4 bg-gray-800/60 rounded-lg border border-gray-700 hover:border-blue-500 hover:bg-gray-800 transition-all duration-300 cursor-pointer">
                <p className="text-xs text-gray-500 mb-1">Your API endpoint</p>
                <p className="text-blue-400 font-mono text-sm break-all">https://tinyapi.xyz/abc123</p>
              </div>
            </div>
          </div>
        </div>

        {/* Use Cases Section */}
        <div className="w-full max-w-4xl mb-24 scroll-animate">
          <h2 className="text-2xl font-bold mb-6 text-gray-100">Perfect For</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "Building webhooks for Slack, Discord, or Telegram bots",
              "Creating CRUD APIs for side projects and MVPs",
              "Rapid prototyping without infrastructure hassle",
              "Serverless backends for mobile and web apps",
            ].map((useCase, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-gray-800/40 p-4 rounded-lg border border-gray-700 hover:border-blue-500 hover:bg-gray-800/60 transition-all duration-300 cursor-pointer group"
              >
                <div className="text-green-400 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">✓</div>
                <p className="text-gray-300 text-left text-sm group-hover:text-gray-100 transition-colors duration-300">{useCase}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Section */}
        <div className="w-full max-w-2xl bg-gradient-to-r from-blue-900/20 to-purple-900/20 backdrop-blur-md rounded-lg border border-blue-700/30 p-8 mb-24 hover:border-blue-600/50 transition-all duration-300 scroll-animate">
          <h2 className="text-2xl font-bold mb-6 text-gray-100">Start Free, Scale as You Grow</h2>
          <div className="flex items-center justify-center gap-6 md:gap-12">
            <div className="text-center hover:scale-105 transition-transform duration-300 cursor-pointer flex-1 max-w-[140px]">
              <div className="text-3xl font-bold text-blue-400 mb-2">$0</div>
              <p className="text-gray-300 text-sm">First API is Free</p>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-3xl text-blue-400/50 animate-pulse">→</div>
            </div>
            <div className="text-center hover:scale-105 transition-transform duration-300 cursor-pointer flex-1 max-w-[140px]">
              <div className="text-3xl font-bold text-purple-400 mb-2">Pro</div>
              <p className="text-gray-300 text-sm">More APIs + Flexible rate limits</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="pt-8 text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} tinyAPI. All rights reserved.</p>
        </footer>
      </div>

      <style>{`
        @keyframes slide {
          0% { transform: translateY(0); }
          100% { transform: translateY(-100%); }
        }
        .animate-slide {
          animation: slide 50s linear infinite;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }

        .animate-fade-in-delay-1 {
          opacity: 0;
          animation: fadeIn 0.8s ease-out 0.2s forwards;
        }

        .animate-fade-in-delay-2 {
          opacity: 0;
          animation: fadeIn 0.8s ease-out 0.4s forwards;
        }

        /* Scroll-triggered animations */
        .scroll-animate {
          opacity: 0.3;
          filter: blur(8px);
          transform: translateY(50px) scale(0.95);
          transition: opacity 0.8s ease-out, transform 0.8s ease-out, filter 0.8s ease-out;
        }

        .scroll-animate.show {
          opacity: 1;
          filter: blur(0px);
          transform: translateY(0) scale(1);
        }
      `}</style>
    </div>
  ) : (
    <Navigate to="/home" />
  );
};

export default Landing;
