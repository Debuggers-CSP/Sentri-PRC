import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { Heart } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useAuth } from "../context/AuthContext";

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

 const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5001/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          username: loginUsername, // Updated from loginEmail
          password: loginPassword,
        }),
      });

      const data = await response.json();
      console.log("Backend response:", data.message);
    } catch (err) {
      console.error("Connection Error:", err);
    }
};

 const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
        const response = await fetch("http://localhost:5001/register", { // Make sure URL matches
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                username: registerName, // Match the key your backend expects
                password: registerPassword,
                email: registerEmail   // Match the key your backend expects
            }),
        });

        if (response.ok) {
            console.log("Registration successful!");
            navigate("/login"); // Redirect user to login page
        } else {
            const errorData = await response.json();
            alert(errorData.message || "Registration failed");
        }
    } catch (err) {
        console.error("Connection Error:", err);
    }
};
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <Heart className="w-10 h-10 text-blue-600" />
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-gray-900">Poway Recovery Center</h1>
          </div>
        </div>

        <Card>
          <CardHeader>  
            <h2 className="text-2xl text-center text-gray-900">Welcome</h2>
            <p className="text-center text-gray-600 text-sm">
              Sign in or create an account to continue
            </p>
          </CardHeader>
          <CardContent>
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
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
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
                      placeholder="John Doe"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
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
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                    Create Account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center text-sm text-gray-600">
              <p>All information is kept confidential and HIPAA-compliant</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
