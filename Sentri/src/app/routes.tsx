import { createBrowserRouter } from "react-router";
import { Home } from "./pages/Home";
import { FindProgram } from "./pages/FindProgram";
import { FindMeeting } from "./pages/FindMeeting";
import { Login } from "./pages/Login";
import { ProgramRecommender } from "./pages/ProgramRecommender";
import { PRCGuide } from "./pages/PRCGuide";
import { Profile } from "./pages/Profile";
import { ProgramDetail } from "./pages/ProgramDetail";

import { Layout } from "./components/Layout"; 

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Layout><Home /></Layout>, // Wrapped
    },
    {
      path: "/login",
      element: <Login />, // Leave alone for now (standard)
    },
    {
      path: "/recommender",
      element: <ProgramRecommender />,
    },
    {
      path: "/programs",
      element: <Layout><FindProgram /></Layout>, // Wrapped
    },
    {
      path: "/programs/:programId",
      element: <Layout><ProgramDetail /></Layout>, // Wrapped
    },
    {
      path: "/meetings",
      element: <Layout><FindMeeting /></Layout>, // Wrapped
    },
    {
      path: "/profile",
      element: <Layout><Profile /></Layout>, // Wrapped
    },
  ],
  {
    basename: "/", 
  }
);