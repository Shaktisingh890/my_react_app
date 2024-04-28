export const routesNames = {
  LANDING: {
    HOME: "/",
    ABOUT: "/about",
    PLATFORM: "/platform",
    INVESTOR: "/investor",
  },

  IAM: {
    root: "/user",
    children: {
      //to remove signup screen 
      // SIGNUP: "/signup",
      LOGIN: "/login",
      FORGOTPWD: "/forgotPassword",
      THANKYOUPAGE: "/thankyou",
      CHANGEPWD: "/changePassword",
      BRAND: "/signup/brand",
      SERVICE: "/signup/service",
      VERIFYEMAIL: "/verifyEmail",
    },
  },

  DASHBOARD: {
    root: "/dashboard",
    children: {
      PROFILE: "/profile",
      EXPANSIONPLANS: "/expansion_plans",
      PROJECTBREIFING: "/project_briefing",
      DISCUSSIONROOM: "/discussion_room/:id?",
      PROPOSALMANAGEMENT: "/proposal_management",
      TALKTOEXPERT: "/talk_to_expert",
      MARKETPLACE: "/marketplace",
      CONTACT_US: "/contact_us",

      SELECT_PROJECT: "/select_project_type",
      CREATE_PROJECT_BRIEFING_FORM: "/create/:briefType",
      VIEW_PROJECT: "/view_project/:screenName/:id",
      SEARCH: "/search/:screenName/:id",
      EDIT_PROJECT_BRIEFING_FORM: "/edit/:screenName/:id",
      PAYMENTS: "/payments/:id",
      CREATE_NEW_PAYMENT: "/createNewPayment"
    },
  },

  PROFILE: {
    root: "/profile",
    children: {
      BRANDPROFILE: "/brand",
      SERVICEPROFILE: "/serviceProvider",
    },
  },

  PROJECT_BRIEFING: {
    root: "/project_briefing",
    children: {
      PROJECT_BRIEFING_FORM: "/create/:briefType",
    },
  },
};
