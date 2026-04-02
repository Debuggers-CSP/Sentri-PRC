import { createBrowserRouter } from "react-router";
import { Home } from "./pages/Home";
import { FindProgram } from "./pages/FindProgram";
import { FindMeeting } from "./pages/FindMeeting";
import { Login } from "./pages/Login";
import { ProgramRecommender } from "./pages/ProgramRecommender";
import { MeetingRecommender } from "./pages/MeetingRecommender";
import { PRCGuide } from "./pages/PRCGuide";
import { Profile } from "./pages/Profile";
import { ProgramDetail } from "./pages/ProgramDetail";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/recommender",
      element: <ProgramRecommender />,
    },
    {
      path: "/meeting-recommender",
      element: <MeetingRecommender />,
    },
    {
      path: "/prc-guide",
      element: <PRCGuide />,
    },
    {
      path: "/programs",
      element: <FindProgram />,
    },
    {
      path: "/programs/:programId",
      element: <ProgramDetail />,
    },
    {
      path: "/meetings",
      element: <FindMeeting />,
    },
    {
      path: "/profile",
      element: <Profile />,
    },
  ],
  {
    /* ADD THIS SECOND ARGUMENT HERE */
    basename: "/", 
  }
);