import { routesNames } from "router/routeNames";

export const publicPaths = {
  // landing paths
  home: `${routesNames.LANDING.HOME}`,
  about: `${routesNames.LANDING.ABOUT}`,
  platform: `${routesNames.LANDING.PLATFORM}`,
  investor: `${routesNames.LANDING.INVESTOR}`,

  // iam paths
  //to remove signup screen
  // signup: `${routesNames.IAM.root}${routesNames.IAM.children.SIGNUP}`,
  brandAccount: `${routesNames.IAM.root}${routesNames.IAM.children.BRAND}`,
  serviceAccount: `${routesNames.IAM.root}${routesNames.IAM.children.SERVICE}`,
  login: `${routesNames.IAM.root}${routesNames.IAM.children.LOGIN}`,
  forgotPwd: `${routesNames.IAM.root}${routesNames.IAM.children.FORGOTPWD}`,
  thankYouPage: `${routesNames.IAM.root}${routesNames.IAM.children.THANKYOUPAGE}`,
  changePwd: `${routesNames.IAM.root}${routesNames.IAM.children.CHANGEPWD}`,
  verifyEmail: `${routesNames.IAM.root}${routesNames.IAM.children.VERIFYEMAIL}`,
};

export const privatePaths = {
  // dashboard paths
  dashboard: `${routesNames.DASHBOARD.root}`,
  dashboardProfile: `${routesNames.DASHBOARD.root}${routesNames.DASHBOARD.children.PROFILE}`,
  dashboardExpansion: `${routesNames.DASHBOARD.root}${routesNames.DASHBOARD.children.EXPANSIONPLANS}`,
  dashboardBreifing: `${routesNames.DASHBOARD.root}${routesNames.DASHBOARD.children.PROJECTBREIFING}`,
  dashboardDiscussion: `${routesNames.DASHBOARD.root}${routesNames.DASHBOARD.children.DISCUSSIONROOM}`,
  dashboardProposal: `${routesNames.DASHBOARD.root}${routesNames.DASHBOARD.children.PROPOSALMANAGEMENT}`,
  talkToExpert: `${routesNames.DASHBOARD.root}${routesNames.DASHBOARD.children.TALKTOEXPERT}`,
  marketplace: `${routesNames.DASHBOARD.root}${routesNames.DASHBOARD.children.MARKETPLACE}`,
  selectNewBrief: `${routesNames.DASHBOARD.root}${routesNames.DASHBOARD.children.SELECT_PROJECT}`,
  viewProject: `${routesNames.DASHBOARD.root}${routesNames.DASHBOARD.children.VIEW_PROJECT}`,
  dashboardContactUs: `${routesNames.DASHBOARD.root}${routesNames.DASHBOARD.children.CONTACT_US}`,
  dashboardSearch: `${routesNames.DASHBOARD.root}${routesNames.DASHBOARD.children.SEARCH}`,
  createProjectBriefingForm: `${routesNames.DASHBOARD.root}${routesNames.DASHBOARD.children.CREATE_PROJECT_BRIEFING_FORM}`,
  editProjectBriefingForm: `${routesNames.DASHBOARD.root}${routesNames.DASHBOARD.children.EDIT_PROJECT_BRIEFING_FORM}`,
  payments: `${routesNames.DASHBOARD.root}${routesNames.DASHBOARD.children.PAYMENTS}`,
  createNewPayment: `${routesNames.DASHBOARD.root}${routesNames.DASHBOARD.children.CREATE_NEW_PAYMENT}`,

  // profile paths
  brandProfile: `${routesNames.PROFILE.root}${routesNames.PROFILE.children.BRANDPROFILE}`,
  serviceProfile: `${routesNames.PROFILE.root}${routesNames.PROFILE.children.SERVICEPROFILE}`,
};
