import { routesNames } from "router/routeNames";
import CreateProfile from "../createProfile";
import Profile from "../index";

const ProfileRoutes = () => {
  return [
    {
      path: routesNames.PROFILE.root,
      component: Profile,
      isExact: false,
      isPublic: false,
      children: [
        {
          path: routesNames.PROFILE.children.BRANDPROFILE,
          component: CreateProfile,
          isExact: true,
          children: [],
        },
        {
          path: routesNames.PROFILE.children.SERVICEPROFILE,
          component: CreateProfile,
          isExact: true,
          children: [],
        },
      ],
    },
  ];
};

export default ProfileRoutes;
