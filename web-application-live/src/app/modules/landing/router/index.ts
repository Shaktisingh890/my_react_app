import Signup from "../../iam/pages/signup";
import { routesNames } from "router/routeNames";
import Landing from "..";
import About from "../pages/about";
import Home from "../pages/home";
import Investor from "../pages/investor";
import Platform from "../pages/platform";

const LandingRoutes = () => {
  return [
    //to remove signup screen 
    // {
    //   path: routesNames.LANDING.HOME,
    //   component: Signup,
    //   isExact: true,
    //   isPublic: true,
    //   children: [],
    // },
    {
      path: routesNames.LANDING.ABOUT,
      component: About,
      isExact: true,
      isPublic: true,
      children: [],
    },
    {
      path: routesNames.LANDING.PLATFORM,
      component: Platform,
      isExact: true,
      isPublic: true,
      children: [],
    },
    {
      path: routesNames.LANDING.INVESTOR,
      component: Investor,
      isExact: true,
      isPublic: true,
      children: [],
    },
  ];
};

export default LandingRoutes;
