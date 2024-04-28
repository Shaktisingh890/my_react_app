import { routesNames } from "router/routeNames";
import IAM from "../index";
import ChangePwd from "../pages/changePwd";
import CreateAccount from "../pages/createAccount";
import ForgotPwd from "../pages/forgotPwd";
import ThankYouPage from "../pages/thankYouPage";
import Login from "../pages/login";
import Signup from "../pages/signup";
import EmailVerification from "../pages/emailVerification";

const IAMRoutes = () => {
  return [
    {
      path: routesNames.IAM.root,
      component: IAM,
      isExact: false,
      isPublic: true,
      children: [
        // {
        //   path: routesNames.IAM.children.SIGNUP,
        //   component: Signup,
        //   isExact: true,
        //   isPublic: true,
        //   children: [],
        // },
        {
          path: routesNames.IAM.children.BRAND,
          component: CreateAccount,
          isExact: true,
          isPublic: true,
          children: [],
        },
        {
          path: routesNames.IAM.children.SERVICE,
          component: CreateAccount,
          isExact: true,
          isPublic: true,
          children: [],
        },
        {
          path: routesNames.IAM.children.LOGIN,
          component: Login,
          isExact: true,
          isPublic: true,
          children: [],
        },
        {
          path: routesNames.IAM.children.FORGOTPWD,
          component: ForgotPwd,
          isExact: true,
          isPublic: true,
          children: [],
        },
        {
          path: routesNames.IAM.children.THANKYOUPAGE,
          component: ThankYouPage,
          isExact: true,
          isPublic: true,
          children: [],
        },
        {
          path: routesNames.IAM.children.CHANGEPWD,
          component: ChangePwd,
          isExact: true,
          isPublic: true,
          children: [],
        },
        {
          path: routesNames.IAM.children.VERIFYEMAIL,
          component: EmailVerification,
          isExact: true,
          isPublic: true,
          children: [],
        },
      ],
    },
  ];
};

export default IAMRoutes;
