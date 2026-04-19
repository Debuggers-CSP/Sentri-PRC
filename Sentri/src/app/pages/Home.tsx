import { useState } from "react";
import { useNavigate } from "react-router";
import { Heart } from "lucide-react"; 
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useAuth } from "../context/AuthContext";
import { pythonURI, fetchOptions } from '../../../../assets/js/api/config.js';
import HeroSection from "../components/HeroSection";

export function Home() {
  const navigate = useNavigate();
  const { user, login } = useAuth();

  // --- AUTH STATES ---
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // --- AUTH FUNCTIONS ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    try {
      const response = await fetch(`${pythonURI}/login`, {
        ...fetchOptions,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: loginUsername, password: loginPassword }),
      });
      const data = await response.json();
      if (response.ok) {
        login(data.user.email, loginPassword, data.user.username, data.user.id, data.user.fname, data.user.lname);
        navigate("/profile"); 
      } else {
        setErrorMessage(data.message || "Invalid credentials");
      }
    } catch (err) {
      setErrorMessage("Connection error.");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    try {
      const response = await fetch(`${pythonURI}/register`, {
        ...fetchOptions,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          username: registerName, 
          password: registerPassword, 
          email: registerEmail, 
          fname: firstName, 
          lname: lastName 
        }),
      });
      if (response.ok) {
        setSuccessMessage("Account registered successfully! You can now login.");
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Registration failed");
      }
    } catch (err) {
      setErrorMessage("Connection error.");
    }
  };

  return (
    <div className="relative min-h-screen bg-[#F8FAF5] overflow-hidden">
      
      {/* 1. THE CLOUD HERO SECTION (Imported Component) */}
      <div className="relative">
        <HeroSection />

        {/* 2. OVERLAY THE LOGIN BOX ON THE RIGHT SIDE */}
        {!user && (
          <div className="absolute inset-0 z-30 pointer-events-none">
            <div className="mx-auto h-full max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-end">
              <div className="w-full max-w-md pointer-events-auto mt-[-5vh]">
                <Card className="shadow-2xl border-none bg-white/90 backdrop-blur-md rounded-[32px]">
                  <CardContent className="p-8">
                    <Tabs defaultValue="login" className="w-full">
                      <TabsList className="grid w-full grid-cols-2 mb-8 bg-blue-50/50 rounded-xl p-1">
                        <TabsTrigger value="login" className="rounded-lg font-semibold data-[state=active]:bg-blue-600 data-[state=active]:text-white">Login</TabsTrigger>
                        <TabsTrigger value="register" className="rounded-lg font-semibold data-[state=active]:bg-blue-600 data-[state=active]:text-white">Register</TabsTrigger>
                      </TabsList>

                      {/* Feedback Messages */}
                      {successMessage && <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-xl text-xs text-center border border-green-100">{successMessage}</div>}
                      {errorMessage && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-xl text-xs text-center border border-red-100">{errorMessage}</div>}

                      <TabsContent value="login">
                        <form onSubmit={handleLogin} className="space-y-5">
                          <div className="space-y-1.5">
                            <Label className="text-xs font-bold uppercase text-blue-900 tracking-wider ml-1">Username</Label>
                            <Input 
                              placeholder="Enter username" 
                              value={loginUsername} 
                              onChange={(e) => setLoginUsername(e.target.value)} 
                              className="bg-white border-blue-50 h-12 rounded-2xl focus:ring-2 focus:ring-blue-500"
                              required 
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs font-bold uppercase text-blue-900 tracking-wider ml-1">Password</Label>
                            <Input 
                              type="password" 
                              placeholder="••••••••" 
                              value={loginPassword} 
                              onChange={(e) => setLoginPassword(e.target.value)} 
                              className="bg-white border-blue-50 h-12 rounded-2xl focus:ring-2 focus:ring-blue-500"
                              required 
                            />
                          </div>
                          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 rounded-2xl font-bold text-lg shadow-lg shadow-blue-200 transition-all active:scale-[0.98]">
                            Sign In
                          </Button>
                        </form>
                      </TabsContent>

                      <TabsContent value="register">
                        <div className="max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
                          <form onSubmit={handleRegister} className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                              <Input placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="h-11 rounded-xl" required />
                              <Input placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} className="h-11 rounded-xl" required />
                            </div>
                            <Input placeholder="Username" value={registerName} onChange={(e) => setRegisterName(e.target.value)} className="h-11 rounded-xl" required />
                            <Input type="email" placeholder="Email" value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} className="h-11 rounded-xl" required />
                            <Input type="password" placeholder="Password" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} className="h-11 rounded-xl" required />
                            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 rounded-2xl font-bold">
                              Create Account
                            </Button>
                          </form>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* 3. LOGGED IN STATE SHORTCUT */}
        {user && (
          <div className="absolute inset-0 z-30 pointer-events-none">
             <div className="mx-auto h-full max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-end">
                <div className="w-full max-w-sm pointer-events-auto bg-white/10 backdrop-blur-md p-8 rounded-[32px] border border-white/20 text-white text-center shadow-2xl">
                  <Heart className="w-12 h-12 mx-auto mb-4 text-blue-400 fill-current" />
                  <h3 className="text-2xl font-bold mb-2">Welcome, {user.fname}!</h3>
                  <Button onClick={() => navigate("/profile")} className="w-full bg-white text-blue-600 hover:bg-blue-50 h-12 rounded-2xl font-black">
                    OPEN HUB
                  </Button>
                </div>
             </div>
          </div>
        )}
      </div>

      {/* REMAINDER OF PAGE (EMPTY AS REQUESTED) */}
    </div>
  );
}