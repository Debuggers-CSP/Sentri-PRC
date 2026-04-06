  import { User, LogOut } from "lucide-react";
  import { useAuth } from "../context/AuthContext";
  import { useNavigate } from "react-router";
  import { Button } from "./ui/button";
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "./ui/dropdown-menu";
  import { Avatar, AvatarFallback } from "./ui/avatar";

  export function UserProfile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

   // --- DEBUG START ---
  console.log("%cDEBUG NAVBAR: Current User Object:", "color: cyan; font-weight: bold;");
  console.log(user);
  // --- DEBUG END ---

  // If no user is logged in, don't render anything
  if (!user) {
    return null;
  }

  /**
   * INITIALS LOGIC
   * 1. Tries to get the first letter of First Name and Last Name.
   * 2. If those are missing (old test accounts), falls back to the first letter of the Username.
   * 3. Final fallback is "U".
   */
  const firstInitial = user.fname?.[0] || "";
  const lastInitial = user.lname?.[0] || "";
   const initials = (firstInitial + lastInitial).toUpperCase();

     // If initials is empty (meaning fname/lname are missing), fall back to username
  const finalDisplay = initials.length > 0 
    ? initials 
    : (user.username?.[0] || "U").toUpperCase();

  console.log(`DEBUG NAVBAR: Calculated Initials -> ${finalDisplay}`);

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleLogoutClick = () => {
    logout();           // Clear session in AuthContext
    navigate("/login"); // Move to login page to prevent "split" crashes on protected pages
  };
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-blue-600 text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleProfileClick}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => {
    logout();           // 1. Clear the user session in AuthContext
    navigate("/login"); // 2. Immediately move away to prevent a crash
}}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }