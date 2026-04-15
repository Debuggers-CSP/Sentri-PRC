import { useState } from "react";
import { useNavigate } from "react-router";
import { Heart } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useAuth } from "../context/AuthContext";
import { pythonURI, fetchOptions } from '../../../../assets/js/api/config.js';

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const [successMessage, setSuccessMessage] = useState("");
const [errorMessage, setErrorMessage] = useState("");

 const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch(`${pythonURI}/login`, {
        ...fetchOptions,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          username: loginUsername,
          password: loginPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
          console.log("--- DEBUG STEP 2: FRONTEND LOGIN DATA ---");
        console.log("User object from backend:", data.user);
        console.log("Extracted fname:", data.user.fname);
        console.log("Extracted lname:", data.user.lname);
        // --- UPDATED LOGIC ---
        // 1. We get the real email from data.user.email
        // 2. We pass it as the first argument so AuthContext stores it
        console.log("DEBUG 1: Backend response user object:", data.user);
        login(
          data.user.email,
          loginPassword,
          data.user.username,
          data.user.id,
          data.user.fname,
          data.user.lname,
          data.user.joined_program
        );

        if (data.user.joined_program) {
          navigate(`/programs/${data.user.joined_program}`);
        } else {
          navigate("/");
        }
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
    setSuccessMessage("");

    try {
        const response = await fetch(`${pythonURI}/register`, {
          ...fetchOptions,
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                username: registerName,

                password: registerPassword,
                email: registerEmail,
                fname: firstName, // This key MUST be "fname"
                lname: lastName  // This key MUST be "lname"
            }),
        });

        if (response.ok) {
            setSuccessMessage("Account successfully registered! You can now login.");
            // Optional: clear the register fields
            setRegisterName("");
            setFirstName("");
            setLastName("");
            setRegisterEmail("");
            setRegisterPassword("");
           
        } else {
            const errorData = await response.json();
            setErrorMessage(errorData.message || "Registration failed");
        }
    } catch (err) {
        setErrorMessage("Connection Error: Could not reach server.");
    }
};
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8FAF5] to-[#E8F5E9] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <Heart className="w-10 h-10 text-[#005A2C]" />
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-[#1F3B2B]">Poway Recovery Center</h1>
          </div>
        </div>

        <Card>
          <CardHeader>  
            <h2 className="text-2xl text-center text-[#1F3B2B]">Welcome</h2>
            <p className="text-center text-[#5A7462] text-sm">
              Sign in or create an account to continue
            </p>
          </CardHeader>
          <CardContent>
            {/* Success Feedback */}
  {successMessage && (
    <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded text-sm text-center">
      {successMessage}
    </div>
  )}

  {/* Error Feedback */}
  {errorMessage && (
    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm text-center">
      {errorMessage}
    </div>
  )}
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-username">Username</Label>
                    <Input
                      id="login-username"
                      type="text"
                      placeholder="Your username"
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                      autoComplete="off"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      autoComplete="off"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-[#005A2C] hover:bg-[#124627]">
                    Sign In
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Username</Label>
                    <Input
                      id="register-name"
                      type="text"
                      placeholder="Choose a username"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-first-name">First Name</Label>
                    <Input
                      id="register-first-name"
                      type="text"
                      placeholder="John"
                      value={firstName}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="you@example.com"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="••••••••"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-[#005A2C] hover:bg-[#124627]">
                    Create Account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center text-sm text-[#5A7462]">
              <p>All information is kept confidential and HIPAA-compliant</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}