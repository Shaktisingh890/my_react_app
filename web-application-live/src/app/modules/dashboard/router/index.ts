import ProjectBriefingForm from "app/modules/projectBriefing/pages/projectBriefingForm";
import SelectNewBrief from "app/modules/projectBriefing/pages/selectNewBrief";
import ViewProject from "app/modules/projectBriefing/pages/viewProject";
import { routesNames } from "router/routeNames";
import Dashboard from "..";
import ChatScreen from "../pages/chatScreen";
import ContactUs from "../pages/contactUs";
import CreateNewPayments from "../pages/createNewPayments";
import DiscussionRoom from "../pages/discussionRoom";
import ExpansionPlans from "../pages/expansionPlans";
import MarketPlace from "../pages/marketPlace";
import Payments from "../pages/payments";
import Profile from "../pages/profile/index";
import ProjectBriefing from "../pages/projectBriefing";
import ProposalManagement from "../pages/proposalManagement";
import Search from "../pages/search";
import TalkToExpert from "../pages/talkToExpert";

const DashboardRoutes = () => {
  return [
    {
      path: routesNames.DASHBOARD.root,
      component: Dashboard,
      isPublic: false,
      isExact: false,
      children: [
        {
          path: routesNames.DASHBOARD.children.PROFILE,
          component: Profile,
          isExact: true,
          children: [],
        },
        {
          path: routesNames.DASHBOARD.children.EXPANSIONPLANS,
          component: ExpansionPlans,
          isExact: true,
          children: [],
        },
        {
          path: routesNames.DASHBOARD.children.PROJECTBREIFING,
          component: ProjectBriefing,
          isExact: true,
          children: [],
        },
        {
          path: routesNames.DASHBOARD.children.DISCUSSIONROOM,
          component: DiscussionRoom,
          isExact: true,
          children: [],
        },
        {
          path: routesNames.DASHBOARD.children.PROPOSALMANAGEMENT,
          component: ProposalManagement,
          isExact: true,
          children: [],
        },
        {
          path: routesNames.DASHBOARD.children.TALKTOEXPERT,
          component: TalkToExpert,
          isExact: true,
          children: [],
        },
        {
          path: routesNames.DASHBOARD.children.MARKETPLACE,
          component: MarketPlace,
          isExact: true,
          children: [],
        },
        {
          path: routesNames.DASHBOARD.children.SELECT_PROJECT,
          component: SelectNewBrief,
          isExact: true,
          children: [],
        },
        {
          path: routesNames.DASHBOARD.children.VIEW_PROJECT,
          component: ViewProject,
          isExact: true,
          children: [],
        },
        {
          path: routesNames.DASHBOARD.children.CONTACT_US,
          component: ContactUs,
          isExact: true,
          children: [],
        },
        {
          path: routesNames.DASHBOARD.children.SEARCH,
          component: Search,
          isExact: true,
          children: [],
        },
        {
          path: routesNames.DASHBOARD.children.CREATE_PROJECT_BRIEFING_FORM,
          component: ProjectBriefingForm,
          isExact: true,
          children: [],
        },
        {
          path: routesNames.DASHBOARD.children.EDIT_PROJECT_BRIEFING_FORM,
          component: ProjectBriefingForm,
          isExact: true,
          children: [],
        },
        {
          path: routesNames.DASHBOARD.children.PAYMENTS,
          component: Payments,
          isExact: true,
          children: [],
        },
        {
          path: routesNames.DASHBOARD.children.CREATE_NEW_PAYMENT,
          component: CreateNewPayments,
          isExact: true,
          children: [],
        },
      ],
    },
  ];
};

export default DashboardRoutes;
