export const iamKeys = {
  brandRegister: () => `/auth/email/registration/brand`,
  serviceRegister: () => `/auth/email/registration/serviceProvider`,
  forgotPassword: () => `/users/reset-password`,
  login: () => `/auth/email/login`,
  verifyIdToken: () => `users/reset-password/verify`,
  changeUserPassword: () => `users/reset-password`,
  emailVerification: (token: string) => `users/verifyEmail/${token}`,
};

export const profileKeys = {
  getUserById: (id: string) => `/users/${id}`,
  fileUpload: () => `/users/upload`,
};

export const talkToExperts = {
  talkToExpert: () => `/talkToExperts`,
};

export const contactThem = {
  contactUs: () => `/contactUs`,
};

export const dashboardKeys = {
  getConstants: () => `/constants`,
};

export const projectKeys = {
  createProject: () => `/projects`,
  fileUpload: () => `/users/upload`,
};
export const profileBriefingKeys = {
  getProjectBriefList: () => `/projects/briefs`,
  publishedBrief: (id: string) => `/projects/${id}`,
  searchServiceProvider: (id: string) => `/projects/${id}/serviceProviders`,
  shortlistedServiceProviders: () => `shortlistedServiceProviders`,
  removeShortlistedSp: (pId: string, spId: string) =>
    `shortlistedServiceProviders/${pId}/${spId}`,
  expanterContact: () => "/expanterConnects",
};

export const marketplaceKeys = {
  getMarketPlaceProjectList: () => `/projects`,
  marketPlaceProject: (id: string) => `/projects/${id}`,
  shareButton: (id: string) => `/projects/${id}/share`,
};

export const discussionRoomKeys = {
  getAllChats: () => `/chats`,
  chatDetails: (id: string) => `/chats/${id}`,
  getToken: (id: string) => `/chats/${id}/token`,
  askProposal: () => `/proposalInvites`,
  sentProjectBriefs: () => `/sentProjectBriefs`,
};

export const proposalManagementKeys = {
  getServiceProvider: () => `/proposals/serviceProvider`,
  getBrandProjects: () => `/proposals/brand`,
  proposalsBrand: () => `/proposals/brand`,
  viewPropos: (id: string) => `/proposals/${id}`,
  sendPropos: () => `/proposals`,
  editPropos: (id: string) => `/proposals/serviceProvider/${id}`,
  hireButton: () => `/hirings`,
  sendInvoice: () => `/invoices`,
  complete: (id: string) => `/proposals/brand/${id}`,
};

export const appNotifications = {
  notificationCount: () => "/notifications/counts",
  notificationAllRead: () => "/notifications/all/read",
  getAllNotifications: () => "/notifications",
  updateNotification: (id: string) => `/notifications/${id}`,
  viewedNotification: () => "/notifications/viewed",
};

export const paymentsKeys = {
  sendInvoice: () => "/invoices",
  updateInvoice: (id: string) => `invoices/${id}`,
  brandInvoiceList: () => "/invoices/brand",
  serviceProviderInvoiceList: () => "/invoices/serviceProvider",
  downloadInvoice: (id: string) => `/invoices/${id}/download  `,
  getExpanterBankAccounts: () => "/expanterBankAccounts",
  payViaBankTransfer: (id: string) => `/invoices/brand/${id} `,
};
