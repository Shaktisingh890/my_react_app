 'use strict';

 var language = require('./Languages');

 const countries = require('./Countries');

 const worldCities = require('./WorldCities');

 const worldLanguages = require('./WorldLanguages');

 var ADMIN_ACCESS_TOKEN = "";

 var env = {
     DEV: 'DEV',
     LIVE: 'LIVE',
     LOCAL: 'LOCAL'
 }
 var objectKeys = function(obj) {
     return Object.keys(obj);
 }

 var objectValues = function(obj) {
     var ar = [];
     Object.values(obj).forEach(function(k) {
         ar.push(obj[k]);
     });
     return ar;
 }

 var objectKeys = function(obj) {
     return Object.keys(obj);
 }

 var objectValues = function(obj) {

     let ar = [];

     Object.keys(obj).forEach(function(k) {
         ar.push(obj[k]);
     })
     return ar;
 }


 var SERVER = {
     env: env,
     APP_NAME: 'Expanter',
     PORTS: {
         HAPI: 7007
     },
     TOKEN_EXPIRATION_IN_MINUTES: 600,
     JWT_SECRET_KEY: 'sUPerSeCuREKeY$$E*P@ntEr$$&^$^&$^%C$^%34Ends',
     GOOGLE_API_KEY: '',
     COUNTRY_CODE: '+852',
     THUMB_WIDTH: 100,
     THUMB_HEIGHT: 100,
     DOMAIN_NAME: 'https://www.expanter.com',
     SUPPORT_EMAIL: '',
     DEBUGGING: false,
     ENV: env.DEV


 };


 var POST_IMAGE_SIZE = {

     width: 630,
 }

 var PAGE_LIMIT = {
     NOTIFICATION: 5,
     USER_FILTER: 10,
     BOOKING_HISTORY: 20,
     DEFAULT_LIMIT: 10
 }

 var USER_FILTER_DISTANCE = {
     MIN: 0,
     MAX: 25
 }

 const PDF_TEMPLATES = {

    "shareProject": {
        header: `<html><head><title>{{{name}}} - Project Brief by {{{brandName}}}</title><style type="text/css">body{font-family:Arial;background-color:#eef2fc}.header img{width:100%}</style></head><body><div class="header"><img src="https://expntr-public-images.s3.ap-east-1.amazonaws.com/frame-2899.png"></div></body></html>`,
        body: `<html><head><title>{{{name}}} - Project Brief by {{{brandName}}}</title><style type="text/css">body{font-family:Arial}.header img{width:100%}.data-section{margin:40px 40px}.title-p{font-weight:400;color:#000;font-size:14px;line-height:17px}.value-p{font-size:16px;line-height:25px;padding:40px;background:rgba(71,105,249,.08);background:rgba(71,105,249,.08);border-radius:5px;padding:.5rem 1rem;width:fit-content;margin-top:.5rem}.section-title{font-weight:500;color:#4769f9;font-size:18px;line-height:21.6px;width:25%}.bFfbdt{border-top:1px solid #db93ff;height:.1px;opacity:.2;width:75%;float:right;margin-top:-10px}.li-value-p{margin-left:-40px;font-size:16px;line-height:25px;padding:40px;background:rgba(71,105,249,.08);background:rgba(71,105,249,.08);border-radius:5px;padding:.5rem 1rem;width:fit-content;margin-top:.5rem}.footer{display:flex;height:100px}.footer img{width:100%}@page{size:A4}footer,header{width:100%}.noPageBreak{page-break-inside:avoid}header{position:absolute;top:0}footer,header{position:fixed}footer{bottom:0}</style></head><body><div class="header"><img src="https://expntr-public-images.s3.ap-east-1.amazonaws.com/frame-2899.png"></div><div class="data-section"><div><div class="noPageBreak"><div class="section-title">Brand Details</div><div class="bFfbdt"></div></div><div class="noPageBreak"><div style="float:left;width:50%"><p class="title-p">Name</p><p class="value-p">{{{brandName}}}</p></div><div style="float:right;width:50%;margin-top:40px"><img style="width:75px;float:right" src="{{brandLogoUrl}}"></div><div style="clear:both"></div></div><div class="noPageBreak"><p class="title-p">Overview</p><p class="value-p">{{{brandOverview}}}</p></div><div class="noPageBreak"><p class="title-p">Industry</p><div><ul style="list-style-type:none">{{#each brandIndustry}}<li class="li-value-p">{{ this }}</li>{{/each}}</ul></div></div></div><div><div class="noPageBreak"><div class="section-title">Project Details</div><div class="bFfbdt"></div></div><div class="noPageBreak"><p class="title-p">Title</p><p class="value-p">{{{name}}}</p></div><div class="noPageBreak"><p class="title-p">Project Type</p><p class="value-p">{{{briefType}}}</p></div><div class="noPageBreak"><p class="title-p">Project Overview</p><p class="value-p">{{{projectOverview}}}</p></div><div class="noPageBreak"><p class="title-p">Objective</p><p class="value-p">{{{objective}}}</p></div></div><div class="noPageBreak"><div class="noPageBreak"><div class="section-title">Ideal Service Provider</div><div class="bFfbdt"></div></div><div class="noPageBreak" style="width:100%"><div style="float:left;width:50%"><p class="title-p">Company Size</p><p class="value-p">{{{teamSize}}}</p></div><div style="float:right;width:50%"><div style="float:left"><p class="title-p">Required Experience</p><p class="value-p">{{{experience}}}</p></div><div style="clear:both"></div></div><div style="clear:both"></div></div><div class="noPageBreak" style="width:100%"><div style="float:left;width:50%"><p class="title-p">Industry Experience</p><div><ul style="list-style-type:none">{{#each industryExperience}}<li class="li-value-p">{{ this }}</li>{{/each}}</ul></div></div><div style="float:right;width:50%"><div style="float:left"><p class="title-p">Segment Experience</p><div><ul style="list-style-type:none">{{#each segmentExperience}}<li class="li-value-p">{{ this }}</li>{{/each}}</ul></div></div><div style="clear:both"></div></div><div style="clear:both"></div></div></div><div><div class="noPageBreak"><div class="section-title">Budget & Timeline</div><div class="bFfbdt"></div></div><div class="noPageBreak" style="float:left;width:50%"><p class="title-p">Budget Type</p><div><ul style="list-style-type:none">{{#each budgetTypes}}<li class="li-value-p">{{ this }}</li>{{/each}}</ul></div></div><div class="noPageBreak" style="float:right;width:50%"><div style="float:left"><p class="title-p">Budget</p><div><ul style="list-style-type:none">{{#each budgetArr}}<li class="li-value-p">{{ this }}</li>{{/each}}</ul></div></div><div style="clear:both"></div></div><div style="clear:both"></div><div class="noPageBreak"><p class="title-p">Timeline</p><p class="value-p">{{{startingTimeline}}}</p></div><div class="noPageBreak"><p class="title-p">China Locations</p><div><ul style="list-style-type:none">{{#each chinaOfficeLocation}}<li class="li-value-p">{{ this }}</li>{{/each}}</ul></div></div><div class="noPageBreak"><p class="title-p">Language(s) Spoken</p><div class="noPageBreak"><ul style="list-style-type:none">{{#each languageSpoken}}<li class="li-value-p">{{ this }}</li>{{/each}}</ul></div></div></div></div></body></html>`,
        footer: `<html><head><title>{{{name}}} - Project Brief by {{{brandName}}}</title><style type="text/css">body{font-family:Arial;background-color:#eef2fc}.footer img{width:100%}</style></head><body><div class="footer"><img src="https://expntr-public-images.s3.ap-east-1.amazonaws.com/footer.png"></div></body></html>`,
     },
     "invoice": {
        body: `<html><head><title>Invoice</title><style type="text/css">body{font-family:Arial}.header img{width:350px}.data-section{margin:40px 40px}.title-p{font-weight:400;color:#000;font-size:14px;line-height:17px}.value-p{font-size:16px;line-height:25px;padding:40px;background:rgba(71,105,249,.08);background:rgba(71,105,249,.08);border-radius:5px;padding:.5rem 1rem;width:fit-content;margin-top:.5rem}.section-title{font-weight:500;color:#4769f9;font-size:18px;line-height:21.6px;width:25%}.bFfbdt{border-top:1px solid #db93ff;height:.1px;opacity:.2;width:75%;float:right;margin-top:-10px}.li-value-p{margin-left:-40px;font-size:16px;line-height:25px;padding:40px;background:rgba(71,105,249,.08);background:rgba(71,105,249,.08);border-radius:5px;padding:.5rem 1rem;width:fit-content;margin-top:.5rem}.footer{display:flex;height:100px}.footer img{width:100%}@page{size:A4}.table-row-border{border-bottom:1px solid #acabab}.noPageBreak{page-break-inside:avoid}header{position:absolute;top:0}.header{text-align:center}</style></head><body><div class="header"><img src="https://expntr-public-images.s3.ap-east-1.amazonaws.com/Expanter-text-logo-background.png"><h1>Invoice</h1><p style="border-bottom:1px solid #db93ff"></p></div><div class="data-section"><div><div class="noPageBreak"><div style="float:left;width:50%"><p class="title-p">Date: {{{invoiceDate}}}</p></div><div style="clear:both"></div></div></div><div><div class="noPageBreak"><div style="float:left;width:50%"><p class="title-p">From</p><p class="value-p">{{{serviceProviderName}}}</p></div><div style="float:right;width:50%"><p class="title-p">To</p><p class="value-p">{{{brandName}}}</p></div><div style="clear:both"></div></div></div><div><div class="noPageBreak"><div class="section-title">Payment Details</div><div class="bFfbdt"></div></div><div class="noPageBreak"><p class="title-p">Project</p><p class="value-p">{{{projectName}}}</p></div><div class="noPageBreak"><p class="title-p">Services</p><p class="value-p">{{{services}}}</p></div><div class="noPageBreak"><p class="title-p">Milestone</p><p class="value-p">{{{milestone}}}</p></div><div class="noPageBreak"><p class="title-p">Due Date</p><p class="value-p">{{{dueDate}}}</p></div></div><div><div class="noPageBreak"><div class="section-title">Cost Breakup</div><div class="bFfbdt"></div></div><div><table border="0" cellpadding="10" cellspacing="0" width="100%"><tr><td class="table-row-border">1. Project Fee</td><td class="table-row-border" style="text-align:center">{{{projectFee}}}</td></tr><tr><td class="table-row-border">2. Platform Fee</td><td class="table-row-border" style="text-align:center">{{{platformFee}}}</td></tr><tr><td class="table-row-border" style="text-align:right">{{{totalAmountType}}}</td><td class="table-row-border" style="text-align:center">{{{finalAmount}}}</td></tr></table></div></div></div><div class="footer"><div style="width:30%"><img style="float:left;width:50px" src="https://expntr-public-images.s3.ap-east-1.amazonaws.com/expanter-logo100x100.png"></div><div style="width:40%;padding:16px;text-align:center"><span>Contact: &nbsp<a style="text-decoration:none" href="mailto:hello@expanter.com">hello@expanter.com</a></span></div><div style="width:30%;padding:16px;margin-right:25px"><span style="float:right"><a style="text-decoration:none" href="https://expanter.com">www.expanter.com</a></span></div><div style="clear:both"></div></div></body></html>`
     }

 }

 var NOTIFICATIONS = {
     TYPE: {
         MESSAGE: "MESSAGE",
         PROPOSAL: "PROPOSAL",
         PROFILE: "PROFILE",
         INVOICE: "INVOICE",
         PROJECT: "PROJECT",
         HIRING: "HIRING"
     },
     PUSH: {
         NEW_MESSAGE: {
             flag: 101,
             screen: "CHAT",
             message: "{{userName}} has sent you a message."
         },
         NEW_PROPOSAL_RECEIVED: {
             flag: 102,
             screen: "PROPOSAL_MANAGEMENT",
             message: "{{serviceProviderName}} has sent a proposal regarding your project {{projectName}}."
         },
         UPDATED_PROPOSAL_RECEIVED: {
             flag: 103,
             screen: "PROPOSAL_MANAGEMENT",
             message: "{{serviceProviderName}} has sent an updated proposal regarding your project {{projectName}}."
         },
         PROFILE_VALIDATED: {
             flag: 104,
             screen: "PROFILE",
             message: "Your profile has been validated. Welcome to Expanter."
         },
         NEW_INVOICE_RECEIVED: {
            flag: 105,
            screen: "PAYMENTS",
            message: "{{serviceProviderName}} has sent an invoice regarding your project {{projectName}}."
         },
         NEW_PROPOSAL_REQUEST: {
             flag: 106,
             screen: "PROJECT_DETAIL",
             message: "{{brandName}} has requested proposal regarding project {{projectName}}."
         },
         NEW_PROJECT_BRIEFING: {
             flag: 107,
             screen: "CHAT",
             message: "{{brandName}} has sent you a briefing regarding project {{projectName}}."
         },
         HIRED: {
             flag: 108,
             screen: "PROPOSAL_MANAGEMENT",
             message: "You are hired by {{brandName}} for project {{projectName}}."
         },
         UPDATED_INVOICE_RECEIVED: {
             flag: 105,
             screen: "PAYMENTS",
             message: "{{serviceProviderName}} has sent an updated invoice regarding your project {{projectName}}."
         },
     }

 }

 var WEB_VIEW_TITLE = {

 }

 var DATABASE = {
     maritalStatus: {
         single: 'Single',
         married: 'Married',
         widow: 'Widow',
         divorced: 'Divorced',
         separated: 'Separated'
     },
     gender: {
         male: 'Male',
         female: 'Female',
         other: 'Other'
     },
     deviceType: {
         iOS: 'ios',
         android: 'android',
         website: 'web'
     },
     userType: {
         user: 'user',
         admin: 'admin'
     },
     userRole: {
         brand: 'Brand',
         serviceProvider: 'Service Provider'
     },
     permissions: {
         none: "none",
         read: "read",
         add: "add",
         edit: "edit",
         delete: "delete"
     },
     profilePicPrefix: {
         original: 'original_',
         thumb: 'thumb_'
     },
     logoPrefix: {
         original: 'logo_',
         thumb: 'logoThumb_'
     },
     documentPrefix: 'document_',
     registeredFrom: {
         webPanel: 'web-panel',
         adminPanel: 'admin-panel',
         app: 'app'
     },
     couponType: {
         cashback: 'cashback',
         discount: 'discount',
     },
     discoutnType: {
         percent: 'percent',
         unit: 'unit',
     },
     language: {
         EN: 'EN',
         ES_MX: 'ES_MX',
         HIN: 'HIN'
     },
     mediaTypes: {
         file: "file",
         image: "image",
         video: "video",
         audio: "audio"
     },
     companyTypes: {
         distributor: "Distributor",
         serviceProvider: "Service Provider"
     },
     mainSpecialities: {
         managementConsulting: "Management & Consulting",
         marketResearch: "Market Research ( information services)",
         marketingAdvertising: "Marketing & Advertising",
         TP_eCommercePartner: "TP (eCommerce partner)",
         IT_Services: "Information Technology & Services",
         corporateServices: "Corporate services",
         realEstate: "Real estate",
         staffingRecruitingHR: "Staffing & Recruiting; Human Resources",
         retailDesign: "Retail Design",
         supplyChainLogistics: "Logistics & Supply chain"
     },
     distributorType: {
         wholeseller: "Wholeseller",
         retailer: "Retailer",
         brandOperator: "Brand operator"
     },
     industryExperience: {
         cosmetics: "Beauty & Personal Care",
         fashionAccessories: "Luxury & Fashion",
         watchJewellery: "Watch & Jewellery",
         homeInterior: "Home & Interior ",
         healthMedical: "Health & Medical",
         education: "Education",
         sports: "Sports",
         artEntertainment: "Art & Entertainment",
         techPlatforms: "Tech & platforms",
         hospitalityTravel: "Hospitality & Travel",
         financeBusiness: "Finance & Business",
         realEstateConstruction: "Real estate & Construction"
     },
     businessModel: {
         eCommerce: "eCommerce",
         wholesale: "wholesale",
         distribution: "distribution"
     },
     businessSize: {
         smallBusiness: "Small Business (<$10M)",
         midMarket: "Mid Market ($10M - $1B)",
         enterprise: "Enterprise (>$1B)"
     },
     companyRegistrationTypes: {
         selfEmployed: "Self-employed",
         privatelyOwned: "Privately Owned",
         partnership: "Partnership",
         public: "Public"
     },
     segmentExperience: {
         luxury: "Luxury",
         premium: "Premium",
         mass: "Mass"
     },
     annualTurnover: {
         "below500K": "Below 500K",
         "500Kto1.5M": "500K to 1.5M",
         "1.5Mto5M": "1.5M to 5M",
         "5Mto10M": "5M to 10M",
         "10Mto50M": "10M to 50M",
         "50Mto500M": "50M to 500M",
         "over500M": "Over 500M"
     },
     staffSize: {
         "2-10": "2 - 10",
         "11-50": "11 - 50",
         "51-200": "51 - 200",
         "201-500": "201 - 500",
         "501-1000": "501 - 1000",
         "1000+": "1000+"
     },
     foundingHistory: {
         "<1Year": "< 1 Year",
         "1-3Years": "1 - 3 Years",
         "3-5Years": "3 - 5 Years",
         "5-10Years": "5 - 10 Years",
         ">10Years": "More than 10 Years"
     },
     experienceInChina: {
         "<1Year": "< 1 Year",
         "1-3Years": "1 - 3 Years",
         "3-5Years": "3 - 5 Years",
         "5-10Years": "5 - 10 Years",
         ">10Years": "More than 10 Years"
     },
     projectBriefingTypes: {
         "managementConsulting": "Management & Consulting",
         "marketResearch": "Market Research",
         "marketingAdvertising": "Marketing & Advertising",
         "ecommerceSetupOperations": "eCommerce Operation Services (TP)",
         "informationTechServices": "Information Technology & Services",
         "logisticsSupplyChain": "Logistics & Supply chain",
         "corporateServices": "Corporate services ( Legal, Accounting, Tax etc)",
         "staffingRecruitingHR": "Staffing & Recruiting; Human Resources",
         "storeDesignRealState": "Store Design & Real estate ",
         "brandDistributorsOperators": "Distributors & Operators",
         "wholesellerRetailer": "Wholeseller & Retailer"
     },
     projectBriefingDescription: {
         "managementConsulting": "In China, brand management and consultancy usually should be your first point of contact as they take care of initial brand-market fit, entry and growth strategies, commercial and marketing  planning, and bridging you with relevent partners and parties who do best in specific work, they also provide hands-on support from project management to daily operations, an ideal partner if you do not have management team yet in China. Typically brand management and consultancy charge retainers.",
         "marketResearch": "In China, market research can help you identify your potential audience, their behaviors so to effectively develop your positioning and communications. The scopes usually include consumer insights, data collection, brand naming, quantitative survey, focus groups, market strategy etc. Typically market research agencies charge project fees.",
         "marketingAdvertising": "In China, localizing your brand and integrate to local social and digital ecosystem is key. This category of providers ranges from branding and communication agencies to develop campaigns, creatives, to digital marketing and social media agencies that look after your Chinese social media accounts and content on Wechat, Weibo to Little Red Book. Some agencies also specializes in KOL and influencer marketing, video production, some has more experiential marketing and event focus. Others specialized in SEO, performance marketing that drives your campaign ROI. Typically marketing agencies charge retainer or project fees.",
         "ecommerceSetupOperations": "In China, TP stands for Tmall Partner or Trade Partner for eCommerce. one-stop operation, sales and marketing solutions for brands that aim to utilize China's largest eCommerce platform such as Tmall, JD and others. Typically TP charge retainer service fee plus commission of sales. Some TP even become distributors and buy stock from brands if they feel confident.",
         "informationTechServices": "In China, you will need local IT and digital technology solutions to build your Chinese webiste, eCommerce sites, develop web apps and Wechat miniprograms, IT & CRM systems to name a few. They typically charge project fees ",
         "logisticsSupplyChain": "In China, lead time to market is essential and the choice of a seasonned Logistics partner will help you navigate through the specifics of this market: Customs clearance, labelling compliance, fabric testing if required, setting up of distribution center in free zone trading...",
         "corporateServices": "In China, those services covers strategic advisory and administrative functions such as accounting/finance, human resources and legal services to ensure a good corporate structure and practice.",
         "staffingRecruitingHR": "In China, international recruiting firms compete with local renowned ones. These firms not only support on recruitment but advise on labour laws, succession plans, staff retaining. if you are not at the stage to establish your own team, you can always rely on Expanter's <ask expert> service which we provide you interim management and operation experetise.",
         "storeDesignRealState": "In China, choosing a reliable and cost effective design/project management firm is crucial in managing your ROI. There are several high standards ones that can deliver world class projects (stand alone stores, shop in shop, pop ups...) on a timely manner. They typically charge project fees or management fees; if you choose to establish full channel retail operations, you must work with landlords of shopping malls, retail avenues and supporting property management agencies. They offer service including but not limited to securing and developing locations, facilitating transaction between buyers and sellers of properties, valuation and maintenance of properties.",
         "brandDistributorsOperators": "In China, unless your route to market is to go direct and fully operate your brand, brand operators can develop your distribution network (retail, wholesale, digital commerce) without having to incorporate a legal structure in the country. A few models can be accessed: JV, franchisee/licensee or hybrid models. Selecting a great brand operator is critical in your China journey.",
         "wholesellerRetailer": "In China, one direct way to start trading is to adress the growing number of destinations known as multi-brands stores or department stores (international or purely local). This wholesale approach allows not only to generate immediate income but also test the consumer's appeal in diffrent regions"
     },
     wayOfOperations: {
         "directApproach": "Direct Approach",
         "distribution": "Distribution",
         "equityPartnership": "Equity Partnership",
         "directConsumerCrossBorderEcommerce": "Direct to Consumer - Cross border eCommerce",
         "directConsumerCrossBorderMultichannel": "Direct to Consumer - Cross border Multichannel",
         "combination": "Combination"
     },
     projectObjectives: {
         "Market Study & Research": "Market Study & Research",
         "Build Market Expansion Strategy & Setup operations": "Build Market Expansion Strategy & Setup operations",
         "Build Brand Awareness & Manage Social Media": "Build Brand Awareness & Manage Social Media",
         "Full Channel Expansions": "Full Channel Expansions",
         "Cross Border eCommerce Expansion": "Cross Border eCommerce Expansion",
         "Wholesale Distribution Partnership Expansion": "Wholesale Distribution Partnership Expansion"
     },
     requiredExperience: {
         "none": "No Requirement",
         "lessThan3years": "Less than 3 years",
         "3-5years": "3 - 5 years",
         "5-10years": "5 - 10 years",
         "over10years": "Over 10 years"
     },
     // languageSpoken: {
     //     "chinese": "Chinese",
     //     "english": "English",
     //     "french": "French",
     //     "italian": "Italian",
     //     "german": "German",
     //     "dutch": "Dutch",
     //     "spanish": "Spanish"
     // },
     teamSizeRequirements: {
         "none": "No Requirement",
         "lessThan10": "Less than 10",
         "10-30people": "10 - 30 People",
         "30-50people": "30 - 50 People",
         "50-80people": "50 - 80 People",
         "80-100people": "80 - 100 People",
         "over100people": "Over 100 People"
     },
     projectStartingFee_USD: {
         "notSure": "Not sure yet",
         "lessThan1000": "< $1000 (USD)",
         "1000-5000": "$1000 (USD) - $5000 (USD)",
         "5000-10000": "$5000 (USD) - $10000 (USD)",
         "10000-50000": "$10000 (USD) - $50000 (USD)",
         "over50000": "Over $50000 (USD)"
     },
     budgetTypes: {
         "retainerBased": "Retainer Based",
         "projectBased": "Project Based",
         "commissionBased": "Commission Based"
     },
     startingTimeline: {
         "notSure": "Not sure yet",
         "immediately": "Immediately",
         "next3months": "Next 3 months",
         "next6months": "Next 6 months"
     },
     queryStatus: {
         "pending": "Pending",
         "contacted": "Contacted",
         "resolved": "Resolved"
     },
     serviceProviderTypes: {
         "serviceProvider": "Service Provider",
         "partnerDistributor": "Partner (Brand distributors and Operators)",
         "partnerWholesellers": "Partner (Whole-sellers and Multi-brands Retailers)"
     },
     chatStatus: {
         "pending": "Pending",
         "active": "Active",
         "blocked": "Blocked"
     },
     chatInitSources: {
         search: "Search",
         marketplace: "Marketplace"
     },
     proposalCostTypes: {
         fixed: "Fixed",
         hourly: "Hourly"
     },
     proposalStatus: {
         sent: "Sent",
         hired: "Hired",
         paymentPending: "paymentPending",
         paid: "Paid",
         completed: "Completed"
     },
     projectStatus: {
         active: "Active",
         archived: "Archived",
         inactive: "Inactive",
         completed: "Completed"
     },
     paymentStatus: {
         pending: "Pending",
         inProcess: "In Process",
         failed: "Failed",
         expired: "Expired",
         completed: "Completed"
     },
     paymentMethods: {
         bankTransfer: "Bank Transfer",
         card: "Card"
     }

 }


 var DATABASE_KEYS = {};

 const createDatabaseKeysObj = function() {

     for (let key in DATABASE) {

         var innerKeys = Object.keys(DATABASE[key]);

         innerKeys.forEach(function(elem) {
             if (!DATABASE_KEYS[key]) {
                 DATABASE_KEYS[key] = {}
             }
             DATABASE_KEYS[key][elem] = elem;
         })

     }
 }

 createDatabaseKeysObj();

 var USER_CONSTANTS = {
     countries: {
         server: countries.smallLetterNames,
         show: countries.names
     },
     chinaCities: {
         server: worldCities.china.cities_en_small,
         show: worldCities.china.cities_en
     },
     chinaProvinces: {
         server: worldCities.china.provinces_en_small,
         show: worldCities.china.provinces_en
     },
     languageSpoken: {
         server: worldLanguages.smallLetterNames,
         show: worldLanguages.names
     },
     maritalStatus: {
         server: objectKeys(DATABASE.maritalStatus),
         show: objectValues(DATABASE.maritalStatus)
     },
     gender: {
         server: objectKeys(DATABASE.gender),
         show: objectValues(DATABASE.gender)
     },
     deviceType: {
         server: objectKeys(DATABASE.deviceType),
         show: objectValues(DATABASE.deviceType)
     },
     userRole: {
         server: objectKeys(DATABASE.userRole),
         show: objectValues(DATABASE.userRole)
     },
     userType: {
         server: objectKeys(DATABASE.userType),
         show: objectValues(DATABASE.userType)
     },
     mediaTypes: {
         server: objectKeys(DATABASE.mediaTypes),
         show: objectValues(DATABASE.mediaTypes)
     },
     companyTypes: {
         server: objectKeys(DATABASE.companyTypes),
         show: objectValues(DATABASE.companyTypes)
     },
     mainSpecialities: {
         server: objectKeys(DATABASE.mainSpecialities),
         show: objectValues(DATABASE.mainSpecialities)
     },
     distributorType: {
         server: objectKeys(DATABASE.distributorType),
         show: objectValues(DATABASE.distributorType)
     },
     industryExperience: {
         server: objectKeys(DATABASE.industryExperience),
         show: objectValues(DATABASE.industryExperience)
     },
     businessModel: {
         server: objectKeys(DATABASE.businessModel),
         show: objectValues(DATABASE.businessModel)
     },
     businessSize: {
         server: objectKeys(DATABASE.businessSize),
         show: objectValues(DATABASE.businessSize)
     },
     companyRegistrationTypes: {
         server: objectKeys(DATABASE.companyRegistrationTypes),
         show: objectValues(DATABASE.companyRegistrationTypes)
     },
     segmentExperience: {
         server: objectKeys(DATABASE.segmentExperience),
         show: objectValues(DATABASE.segmentExperience)
     },
     annualTurnover: {
         server: objectKeys(DATABASE.annualTurnover),
         show: objectValues(DATABASE.annualTurnover)
     },
     staffSize: {
         server: objectKeys(DATABASE.staffSize),
         show: objectValues(DATABASE.staffSize)
     },
     foundingHistory: {
         server: objectKeys(DATABASE.foundingHistory),
         show: objectValues(DATABASE.foundingHistory)
     },
     experienceInChina: {
         server: objectKeys(DATABASE.experienceInChina),
         show: objectValues(DATABASE.experienceInChina)
     },
     projectBriefingTypes: {
         server: objectKeys(DATABASE.projectBriefingTypes),
         show: objectValues(DATABASE.projectBriefingTypes)
     },
     projectBriefingDescription: {
         server: objectKeys(DATABASE.projectBriefingDescription),
         show: objectValues(DATABASE.projectBriefingDescription)
     },
     wayOfOperations: {
         server: objectKeys(DATABASE.wayOfOperations),
         show: objectValues(DATABASE.wayOfOperations)
     },
     projectObjectives: {
         server: objectKeys(DATABASE.projectObjectives),
         show: objectValues(DATABASE.projectObjectives)
     },
     requiredExperience: {
         server: objectKeys(DATABASE.requiredExperience),
         show: objectValues(DATABASE.requiredExperience)
     },
     // languageSpoken: {
     //     server: objectKeys(DATABASE.languageSpoken),
     //     show: objectValues(DATABASE.languageSpoken)
     // },
     teamSizeRequirements: {
         server: objectKeys(DATABASE.teamSizeRequirements),
         show: objectValues(DATABASE.teamSizeRequirements)
     },
     projectStartingFee_USD: {
         server: objectKeys(DATABASE.projectStartingFee_USD),
         show: objectValues(DATABASE.projectStartingFee_USD)
     },
     budgetTypes: {
         server: objectKeys(DATABASE.budgetTypes),
         show: objectValues(DATABASE.budgetTypes)
     },
     startingTimeline: {
         server: objectKeys(DATABASE.startingTimeline),
         show: objectValues(DATABASE.startingTimeline)
     },
     queryStatus: {
         server: objectKeys(DATABASE.queryStatus),
         show: objectValues(DATABASE.queryStatus)
     },
     serviceProviderTypes: {
         server: objectKeys(DATABASE.serviceProviderTypes),
         show: objectValues(DATABASE.serviceProviderTypes)
     },
     chatStatus: {
         server: objectKeys(DATABASE.chatStatus),
         show: objectValues(DATABASE.chatStatus)
     },
     chatInitSources: {
         server: objectKeys(DATABASE.chatInitSources),
         show: objectValues(DATABASE.chatInitSources)
     },
     proposalCostTypes: {
         server: objectKeys(DATABASE.proposalCostTypes),
         show: objectValues(DATABASE.proposalCostTypes)
     },
     proposalStatus: {
         server: objectKeys(DATABASE.proposalStatus),
         show: objectValues(DATABASE.proposalStatus)
     },
     projectStatus: {
         server: objectKeys(DATABASE.projectStatus),
         show: objectValues(DATABASE.projectStatus)
     },
     paymentStatus: {
         server: objectKeys(DATABASE.paymentStatus),
         show: objectValues(DATABASE.paymentStatus)
     },
     paymentMethods: {
         server: objectKeys(DATABASE.paymentMethods),
         show: objectValues(DATABASE.paymentMethods)
     }
 };

 var STATUS_MSG = {

     ERROR: {

         customError: function(message) {

             return {
                 statusCode: 400,
                 success: false,
                 type: 'CUSTOM_ERROR',
                 customMessage: message

             }
         },

         NOT_AUTHENTICATED_FACEBOOK_USER: {


         },

         NOT_AUTHORIZED_TO_PERFORM_THIS_REQUEST: {
             statusCode: 400,
             success: false,
             type: 'NOT_AUTHORIZED_TO_PERFORM_THIS_REQUEST',
             customMessage: 'You are not authorized to perfom this request.'

         },
         REVEIW_OF_UNDEFINED: {
             statusCode: 400,
             success: false,
             type: 'REVEIW_OF_UNDEFINED',
             customMessage: 'Please send the review entity!'
         },
         NOT_ASSOCIATED_WITH_US: {
             statusCode: 400,
             success: false,
             type: 'NOT_ASSOCIATED_WITH_US',
             customMessage: 'User is not associated with ' + SERVER.APP_NAME + ' anymore. please contact support!'
         },
         INVALID_ID_PROVIDED: {
             statusCode: 400,
             success: false,
             type: 'INVALID_ID_PROVIDED',
             customMessage: 'Unable to delete! Invalid Id provided'
         },
         INVALID_CONSTANT_TYPE: {
             statusCode: 400,
             success: false,
             type: 'INVALID_CONSTANT_TYPE',
             customMessage: 'Invalid Constant Type'
         },
         INTEREST_NAME_EXIST: {
             statusCode: 400,
             success: false,
             type: 'INTEREST_NAME_EXIST',
             customMessage: 'Interest name already exist!'
         },
         CUSTOM_ERROR: {
             statusCode: 400,
             success: false,
             type: 'CUSTOM_ERROR',
             customMessage: 'CUSTOM_ERROR'
         },

         ARTICLE_NOT_EXIST: {
             statusCode: 400,
             success: false,
             type: 'ARTICLE_NOT_EXIST',
             customMessage: 'Article does not exists.'
         },
         INVALID_PINCODE_ID: {
             statusCode: 400,
             success: false,
             type: 'INVALID_PINCODE_ID',
             customMessage: 'Invalid pincode id'
         },
         COUPON_ALREADY_APPLIED: {
             statusCode: 400,
             success: false,
             type: 'COUPON_ALREADY_APPLIED',
             customMessage: 'Sorry, But this coupon is already applied by you.'
         },
         REQUEST_NOT_FOUND: {
             statusCode: 400,
             success: false,
             type: 'REQUEST_NOT_FOUND',
             customMessage: 'Invalid request there is no entity related to it'
         },
         INVALID_DELETION: {
             statusCode: 400,
             success: false,
             type: 'INVALID_DELETION',
             customMessage: 'Invalid deletion there is an entity related to it'
         },
         ACCOUNT_BLOCKED: {
             statusCode: 400,
             success: false,
             type: 'ACCOUNT_BLOCKED',
             customMessage: 'Your account has been blocked by Admin. Please write us at hello@expanter.com.'
         },
         INVALID_USER_PASS: {
             statusCode: 400,
             success: false,
             type: 'INVALID_USER_PASS',
             customMessage: 'Invalid username or password'
         },
         TOKEN_ALREADY_EXPIRED: {
             statusCode: 401,
             success: false,
             customMessage: 'Token Already Expired',
             type: 'TOKEN_ALREADY_EXPIRED'
         },
         DB_ERROR: {
             statusCode: 400,
             success: false,
             customMessage: "Sorry , It's not you .\n It's Us.",
             type: 'DB_ERROR'
         },
         INVALID_ID: {
             statusCode: 400,
             success: false,
             customMessage: 'We could not find these details for you. Please try again.',
             type: 'INVALID_ID'
         },
         APP_ERROR: {
             statusCode: 400,
             success: false,
             customMessage: 'Application Error',
             type: 'APP_ERROR'
         },
         ADDRESS_NOT_FOUND: {
             statusCode: 400,
             success: false,
             customMessage: 'Address not found',
             type: 'ADDRESS_NOT_FOUND'
         },
         IMP_ERROR: {
             statusCode: 500,
             success: false,
             customMessage: 'Implementation Error',
             type: 'IMP_ERROR'
         },
         NO_EMAIL_TEMPLATE: {
             statusCode: 500,
             success: false,
             customMessage: 'Implementation Error due to missing email template',
             type: 'NO_EMAIL_TEMPLATE'
         },
         APP_VERSION_ERROR: {
             statusCode: 400,
             success: false,
             customMessage: 'One of the latest version or updated version value must be present',
             type: 'APP_VERSION_ERROR'
         },
         INVALID_TOKEN: {
             statusCode: 401,
             customMessage: 'Invalid token provided',
             type: 'INVALID_TOKEN'
         },
         INVALID_CODE: {
             statusCode: 400,
             success: false,
             customMessage: 'Invalid Verification Code',
             type: 'INVALID_CODE'
         },
         DEFAULT: {
             statusCode: 400,
             success: false,
             customMessage: 'Error',
             type: 'DEFAULT'
         },
         PHONE_NO_EXIST: {
             statusCode: 400,
             success: false,
             customMessage: 'Phone No Already Exist',
             type: 'PHONE_NO_EXIST'
         },
         EMAIL_EXIST: {
             statusCode: 400,
             success: false,
             customMessage: 'Email Already Exist',
             type: 'EMAIL_EXIST'
         },
         USERNAME_EXIST: {
             statusCode: 400,
             success: false,
             customMessage: 'This username is already taken.',
             type: 'USERNAME_EXIST'
         },
         NO_REQ_FOUND: {
             statusCode: 400,
             success: false,
             customMessage: 'No such verfication request found.',
             type: 'NO_REQ_FOUND'
         },
         REQ_ALREADY_UPDATED: {
             statusCode: 400,
             success: false,
             customMessage: 'You have already updated this verification request.',
             type: 'REQ_ALREADY_UPDATED'
         },
         DUPLICATE: {
             statusCode: 400,
             success: false,
             customMessage: 'Duplicate Entry',
             type: 'DUPLICATE'
         },
         DUPLICATE_ADDRESS: {
             statusCode: 400,
             success: false,
             customMessage: 'Address Already Exist',
             type: 'DUPLICATE_ADDRESS'
         },
         UNIQUE_CODE_LIMIT_REACHED: {
             statusCode: 400,
             success: false,
             customMessage: 'Cannot Generate Unique Code, All combinations are used',
             type: 'UNIQUE_CODE_LIMIT_REACHED'
         },
         INVALID_REFERRAL_CODE: {
             statusCode: 400,
             success: false,
             customMessage: 'Invalid Referral Code',
             type: 'INVALID_REFERRAL_CODE'
         },
         FACEBOOK_ID_PASSWORD_ERROR: {
             statusCode: 400,
             success: false,
             customMessage: 'Only one field should be filled at a time, either facebookId or password',
             type: 'FACEBOOK_ID_PASSWORD_ERROR'
         },
         INVALID_EMAIL: {
             statusCode: 400,
             success: false,
             customMessage: 'Invalid Email Address',
             type: 'INVALID_EMAIL'
         },
         PASSWORD_REQUIRED: {
             statusCode: 400,
             success: false,
             customMessage: 'Password is required',
             type: 'PASSWORD_REQUIRED'
         },
         INVALID_COUNTRY_CODE: {
             statusCode: 400,
             success: false,
             customMessage: 'Invalid Country Code, Should be in the format +52',
             type: 'INVALID_COUNTRY_CODE'
         },
         INVALID_PHONE_NO_FORMAT: {
             statusCode: 400,
             success: false,
             customMessage: 'Phone no. cannot start with 0',
             type: 'INVALID_PHONE_NO_FORMAT'
         },
         COUNTRY_CODE_MISSING: {
             statusCode: 400,
             success: false,
             customMessage: 'You forgot to enter the country code',
             type: 'COUNTRY_CODE_MISSING'
         },
         INVALID_PHONE_NO: {
             statusCode: 400,
             success: false,
             customMessage: 'Phone No. & Country Code does not match to which the OTP was sent',
             type: 'INVALID_PHONE_NO'
         },
         PHONE_NO_MISSING: {
             statusCode: 400,
             success: false,
             customMessage: 'You forgot to enter the phone no.',
             type: 'PHONE_NO_MISSING'
         },
         NOTHING_TO_UPDATE: {
             statusCode: 400,
             success: false,
             customMessage: 'Nothing to update',
             type: 'NOTHING_TO_UPDATE'
         },
         NOT_FOUND: {
             statusCode: 400,
             success: false,
             customMessage: 'User Not Found.',
             type: 'NOT_FOUND'
         },
         INVALID_RESET_PASSWORD_TOKEN: {
             statusCode: 400,
             success: false,
             customMessage: 'Invalid Reset Password Token',
             type: 'INVALID_RESET_PASSWORD_TOKEN'
         },
         INCORRECT_PASSWORD: {
             statusCode: 400,
             customMessage: 'Incorrect Password.',
             type: 'INCORRECT_PASSWORD'
         },
         EMPTY_VALUE: {
             statusCode: 400,
             success: false,
             customMessage: 'Empty String Not Allowed',
             type: 'EMPTY_VALUE'
         },
         PHONE_NOT_MATCH: {
             statusCode: 400,
             success: false,
             customMessage: "Phone No. Doesn't Match",
             type: 'PHONE_NOT_MATCH'
         },
         SAME_PASSWORD: {
             statusCode: 400,
             success: false,
             customMessage: 'Old password and new password are same',
             type: 'SAME_PASSWORD'
         },
         ACTIVE_PREVIOUS_SESSIONS: {
             statusCode: 400,
             success: false,
             customMessage: 'You already have previous active sessions, confirm for flush',
             type: 'ACTIVE_PREVIOUS_SESSIONS'
         },
         INVALID_EST_ID: {
             statusCode: 400,
             success: false,
             customMessage: 'Invalid EstablishmentId',
             type: 'INVALID_EST_ID'
         },
         EMAIL_ALREADY_EXIST: {
             statusCode: 400,
             success: false,
             customMessage: 'This email address already exists for another account.',
             type: 'EMAIL_ALREADY_EXIST'
         },
         ERROR_PROFILE_PIC_UPLOAD: {
             statusCode: 400,
             success: false,
             customMessage: 'Error occured in Profile Pic upload.',
             type: 'ERROR_PROFILE_PIC_UPLOAD'
         },
         PHONE_ALREADY_EXIST: {
             statusCode: 400,
             success: false,
             customMessage: 'Phone No. Already Exists',
             type: 'PHONE_ALREADY_EXIST'
         },
         INVALID_JSON: {
             statusCode: 400,
             success: false,
             customMessage: 'Invalid Json Format.',
             type: 'INVALID_JSON'
         },
         EMAIL_NOT_FOUND: {
             statusCode: 400,
             success: false,
             customMessage: 'You are not registered with us.',
             type: 'EMAIL_NOT_FOUND'
         },
         FACEBOOK_ID_NOT_FOUND: {
             statusCode: 400,
             success: false,
             customMessage: 'Facebook Id Not Found',
             type: 'FACEBOOK_ID_NOT_FOUND'
         },
         PHONE_NOT_FOUND: {
             statusCode: 400,
             success: false,
             customMessage: 'Phone No. Not Found',
             type: 'PHONE_NOT_FOUND'
         },
         INCORRECT_OLD_PASS: {
             statusCode: 400,
             success: false,
             customMessage: 'Incorrect Old Password',
             type: 'INCORRECT_OLD_PASS'
         },
         UNAUTHORIZED: {
             statusCode: 401,
             success: false,
             customMessage: 'You are not authorized to perform this action',
             type: 'UNAUTHORIZED'
         },
         UNAUTHORIZED_ACCESS: {
             statusCode: 400,
             success: false,
             customMessage: 'You are not authorized to perform this action',
             type: 'UNAUTHORIZED_ACCESS'
         },
         VENDOR_EXIST: {
             statusCode: 400,
             success: false,
             customMessage: 'A vendor is already exist with same email or phone number.',
             type: 'VENDOR_EXIST'
         },
         VENDOR_NOT_EXIST: {
             statusCode: 400,
             success: false,
             customMessage: 'You are not registered as a Vendor.',
             type: 'VENDOR_NOT_EXIST'
         },
         INVALID_ADDRESS: {
             statusCode: 400,
             success: false,
             type: 'INVALID_ADDRESS',
             customMessage: 'Pick-up or Drop-off address is not valid.'

         },
         ALREADY_PLACED: {
             statusCode: 400,
             success: false,
             type: 'ALREADY_PLACED',
             customMessage: 'This booking is already confirmed.'

         },
         INVALID_COUPON_APPLIED: {
             statusCode: 400,
             success: false,
             type: 'INVALID_COUPON_APPLIED',
             customMessage: 'Invalid coupon code.'
         },
         NO_OF_USERS_EXCEED: {
             statusCode: 400,
             success: false,
             type: 'NO_OF_USERS_EXCEED',
             customMessage: 'You missed the deal. This coupon is now invalid.'
         },
         COUPON_EXPIRED: {
             statusCode: 400,
             success: false,
             type: 'COUPON_EXPIRED',
             customMessage: 'This coupon has been expired.'
         },
         CANT_DELETE: {
             statusCode: 400,
             success: false,
             type: 'CANT_DELETE',
             customMessage: 'This booking cannot be deleted now.'
         },
         CANT_EDIT: {
             statusCode: 400,
             success: false,
             type: 'CANT_EDIT',
             customMessage: 'This booking cannot be edited now.'
         },
         NO_SERVICE: {
             statusCode: 400,
             success: false,
             type: 'NO_SERVICE',
             customMessage: 'We are not providing services in your area right now.'
         },
         PAYMENT_DETAILS_REQUIRED: {
             statusCode: 400,
             success: false,
             type: 'PAYMENT_DETAILS_REQUIRED',
             customMessage: 'Payment details are required or you can also pay with cash.'
         },
         SERVER_ERROR: {
             statusCode: 400,
             success: false,
             type: 'SERVER_ERROR',
             customMessage: 'There is some error at server side. Will fix this soon.'
         },
         NO_FILE_FOUND: {
             statusCode: 400,
             success: false,
             type: 'NO_FILE_FOUND',
             customMessage: "File not found."
         },
         RECORD_NOT_FOUND: {
             statusCode: 400,
             success: false,
             type: 'RECORD_NOT_FOUND',
             customMessage: "Record not found."
         },
         CANT_FIND: {
             statusCode: 400,
             success: false,
             type: 'CANT_FIND',
             customMessage: "User not found."
         },
         ERROR_FILE_UPLOAD: {
             statusCode: 400,
             success: false,
             customMessage: 'Error occured in file upload.',
             type: 'ERROR_FILE_UPLOAD'
         },
         CANT_CHAT_WITH_SELF: {
             statusCode: 400,
             success: false,
             customMessage: 'You cannot initiate discussion with yourself.',
             type: 'CANT_CHAT_WITH_SELF'
         },
         ALREADY_SUBMITTED_PROPOSAL: {
             statusCode: 400,
             success: false,
             customMessage: 'You have already submitted proposal to this project. Manage your proposals in Proposal Management section',
             type: 'ALREADY_SUBMITTED_PROPOSAL'
         },
         CANT_UPDATE_PROPOSAL_AFTER_HIRED: {
             statusCode: 400,
             success: false,
             customMessage: 'You have been hired against this proposal. Hence you cannot update this proposal.',
             type: 'CANT_UPDATE_PROPOSAL_AFTER_HIRED'
         },
         ALREADY_HIRED_SERVICE_PROVIDER: {
             statusCode: 400,
             success: false,
             customMessage: 'You have already hired this service provider.',
             type: 'ALREADY_HIRED_SERVICE_PROVIDER'
         },
         USER_NOT_FOUND: {
             statusCode: 400,
             success: false,
             customMessage: 'User not found.',
             type: 'USER_NOT_FOUND'
         },
         CANT_CHAT_WITH_SAME_USER_ROLE: function(userRole) {
             return {
                 statusCode: 400,
                 success: false,
                 customMessage: `Being a ${userRole}, You cannot initiate discussion with other ${userRole}.`,
                 type: 'CANT_CHAT_WITH_SAME_USER_ROLE'
             }
         },
         ALREADY_HIRED_FOR_PROJECT: {
             statusCode: 400,
             success: false,
             customMessage: 'You have already hired for this project.',
             type: 'ALREADY_HIRED_FOR_PROJECT'
         }

     },
     SUCCESS: {

         PLEASE_ENTER_OTP: {
             statusCode: 201,
             success: true,
             customMessage: 'Please verify your phone number. Your otp has been sent to your registered number.',
             type: 'PLEASE_ENTER_OTP'
         },

         PHONE_NOT_FOUND: {
             statusCode: 210,
             success: true,
             customMessage: 'Please provide your Phone Number.',
             type: 'PHONE_NOT_FOUND'
         },

         PHONE_NOT_VERIFIED: {
             statusCode: 212,
             success: true,
             customMessage: 'Please provide your Phone Number.Your phone is not verified yet.',
             type: 'PHONE_NOT_VERIFIED'
         },
         PHONE_ALREADY_VERIFIED: {
             statusCode: 213,
             success: true,
             customMessage: 'Your phone number is already verified for this booking. Proceed to confirm.',
             type: 'PHONE_ALREADY_VERIFIED'
         },
         CREATED: {
             success: true,
             statusCode: 201,
             customMessage: 'Created Successfully',
             type: 'CREATED'
         },
         RESET_TOKEN_SENT: {
             success: true,
             statusCode: 200,
             customMessage: 'Reset Password intsructions are sent on your registered email address, Please check your mail.',
             type: 'RESET_TOKEN_SENT'
         },
         DEFAULT: {
             success: true,
             statusCode: 200,
             customMessage: 'Success',
             type: 'DEFAULT'
         },
         UPDATED: {
             success: true,
             statusCode: 200,
             customMessage: 'Updated Successfully',
             type: 'UPDATED'
         },
         LOGOUT: {
             success: true,
             statusCode: 200,
             customMessage: 'Logged Out Successfully',
             type: 'LOGOUT'
         },
         DELETED: {
             success: true,
             statusCode: 200,
             customMessage: 'Deleted Successfully',
             type: 'DELETED'
         },
     }

 }


 var swaggerDefaultResponseMessages = [{
     code: 200,
     message: 'OK'
 }, {
     code: 400,
     message: 'Bad Request'
 }, {
     code: 401,
     message: 'Unauthorized'
 }, {
     code: 404,
     message: 'Data Not Found'
 }, {
     code: 500,
     message: 'Internal Server Error'
 }];


 var smsNotificationMessages = {
     verificationCodeMsg: 'Hi, Your 4 digit verification code for ' + SERVER.APP_NAME + ' is {{verificationCode}}.',
     userRegisterMsg: 'Hi {{userName}}, Thanks for registering with ' + SERVER.APP_NAME + '. You may call at 1800-3000-4243 for any further assistance.'
 }


 var emailNotificationMessages = {
     forgotPassword: {
         emailMessage: "Hi {{user_name}},<br><br>We have received a request to reset the password for your account.<br><br>If you made this request, please click on the link below or paste this into your browser to complete the process<br><br>{{password_reset_link}}<br><br>This link will work for 1 hour or until your password is reset.<br><br>If you did not ask to change your password, please ignore this email and your account will remain unchanged.<br><br><br>Thanks,<br>Expanter Team<br/>",
         emailSubject: "Reset your password - Expanter",
         sendCopyToAdmin: false
     },
     contactUsTemplate: {
         emailMessage: "Hi,<br><br>You have received a user query. Please find the details below:<br><br>First Name: {{{firstName}}}, Last Name: {{{lastName}}}<br><br>Business Name: {{{businessName}}}<br> Email: {{{email}}} <br> User Type: {{{userRole}}} <br> Subject: {{{subject}}} <br> Query: {{{query}}} <br><br><br>Thanks,<br>Expanter Team<br/>",
         emailSubject: "You have received a user query.",
         sendCopyToAdmin: false
     },
     talkToExpertTemplate: {
         emailMessage: "Hi,<br><br>You have received a user query. Please find the details below:<br><br>First Name: {{{firstName}}}, Last Name: {{{lastName}}}<br><br>Business Name: {{{businessName}}}<br> Email: {{{email}}} <br> User Type: {{{userRole}}} <br> Topic: {{{topic}}} <br> Query: {{{query}}} <br><br><br>Thanks,<br>Expanter Team<br/>",
         emailSubject: "User wants to talk to Expanter expert.",
         sendCopyToAdmin: false
     },
     userVerificationEmail: {
         emailMessage: "Hi {{user_name}},<br><br>Thanks for signing up to Expanter.<br><br>To confirm your email so that you can recover your account in the future. Click below link or paste the link in your browser to verify:<br><br>{{emailVerificationLink}}<br><br>If you have any difficulties please contact us at hello@expanter.com <br><br><br>Thanks,<br>Expanter Team<br/>",
         emailSubject: "Verify Email address",
         sendCopyToAdmin: false
     },
     expanterConnectsTemplate: {
         emailMessage: "Hi,<br><br>{{{brandName}}} wants to connect with a service provider. Please find the details of service provider below: <br><br>Name: {{{name}}}<br><br>Expanter id: {{{expanterid}}}<br><br>Email: {{{primary_email}}}<br>Webiste: {{{url}}} <br>Linkeding URL: {{{linkedin_url}}} <br>Description: {{{description}}} <br>Specialities: {{{specialities}}} <br>Additional Specialities: {{{additional_speciality}}} <br>Capabilities: {{{capabilities}}} <br>Industry: {{{industry}}} <br><br><br>Thanks,<br>Expanter Team<br />",
         emailSubject: "{{{brandName}}} wants to connect to a service provider",
         sendCopyToAdmin: false
     },
     newMessageReceived: {
         emailMessage: `Hi {{userName}}, <br/><br/> {{senderName}} has sent you a message regarding your project {{projectName}}. <br/><br/> <a href="{{chatUrl}}">View Message</a> <br><br> If you have any questions please contact us at hello@expanter.com <br><br><br>Thanks,<br>Expanter Team<br>`,
         emailSubject: `You received a new message`,
         sendCopyToAdmin: true
     },
     newProposalReceived: {
         emailMessage: `Hello {{brandName}}, <br/><br/> {{serviceProviderName}} has sent you a proposal regarding your project {{projectName}}.<br/><br/> <a href="{{proposalUrl}}">View Proposal</a> <br><br>If you have any questions please contact us at hello@expanter.com <br><br><br>Thanks,<br>Expanter Team<br>`,
         emailSubject: `You received a new proposal`,
         sendCopyToAdmin: true
     },
     proposalUpdated: {
         emailMessage: `Hello {{brandName}}, <br/><br/> {{serviceProviderName}} has sent you an updated proposal regarding your project {{projectName}}.<br/><br/> <a href="{{proposalUrl}}">View Proposal</a> <br><br>If you have any questions please contact us at hello@expanter.com <br><br><br>Thanks,<br>Expanter Team<br>`,
         emailSubject: `You received an updated proposal`,
         sendCopyToAdmin: true
     },
     invoiceUploaded: {
         emailMessage: `Hello {{brandName}}, <br/><br/> {{serviceProviderName}} has sent you an invoice regarding your project {{projectName}}.<br/><br/> <a href="{{proposalUrl}}">View Invoice</a><br><br> If you have any questions please contact us at hello@expanter.com <br><br><br>Thanks,<br>Expanter Team`,
         emailSubject: `You recieved an invoice`,
         sendCopyToAdmin: true
     },
     invoiceUpdated: {
         emailMessage: `Hello {{brandName}}, <br/><br/> {{serviceProviderName}} has sent you an updated invoice regarding your project {{projectName}}.<br/><br/> <a href="{{proposalUrl}}">View Invoice</a><br><br> If you have any questions please contact us at hello@expanter.com <br><br><br>Thanks,<br>Expanter Team`,
         emailSubject: `You recieved an updated invoice`,
         sendCopyToAdmin: true
     },
     askedForProposal: {
         emailMessage: `Hello {{serviceProviderName}}, <br/><br/> {{brandName}} has requested proposal regarding your project {{projectName}}.<br/><br/> <a href="{{projectUrl}}">View Project</a><br><br> If you have any questions please contact us at hello@expanter.com <br><br><br>Thanks,<br>Expanter Team`,
         emailSubject: `You recieved a new proposal request`,
         sendCopyToAdmin: true
     },
     hiredForProjectToSP: {
         emailMessage: `Hello {{serviceProviderName}}, <br/><br/> You are hired by {{brandName}} for project {{projectName}}.<br/><br/> <a href="{{proposalUrl}}">View Details</a> <br><br> If you have any questions please contact us at hello@expanter.com <br><br><br>Thanks,<br>Expanter Team`,
         emailSubject: `Congratulations, you are hired!`,
         sendCopyToAdmin: true
     },
     hiredForProjectToBrand: {
         emailMessage: `Hello {{brandName}}, <br/><br/> You have hired {{serviceProviderName}} for your project {{projectName}}.<br/><br/> <a href="{{proposalUrl}}">View Details</a> <br><br> If you have any questions please contact us at hello@expanter.com <br><br><br>Thanks,<br>Expanter Team`,
         emailSubject: `Congratulations on your new hire!`,
         sendCopyToAdmin: true
     },
     profileCreated: {
         emailMessage: `Hello {{businessName}}, <br/><br/> Thanks for creating your profile on Expanter.<br/><br/>Your profile and information you have provided is under our review. You will be notified if any changes required, or you will hear from us once your profile has been confirmed. <br><br><br>Thanks,<br>Expanter Team`,
         emailSubject: `Thanks for creating Your Profile`,
         sendCopyToAdmin: true
     },
     profileApproved: {
         emailMessage: `Hello {{businessName}}, <br/><br/> Thanks for creating your profile on Expanter.<br/><br/>Your profile has been validated. Welcome to Expanter Platform and become our verified user. Enjoy. <br><br>If you have any questions please contact us at hello@expanter.com<br><br><br>Thanks,<br>Expanter Team`,
         emailSubject: `Your Profile now is Validated!`,
         sendCopyToAdmin: true
     },
     brandSharedProjectBriefing: {
        emailMessage: `Hello {{serviceProviderName}}, <br/><br/> {{brandName}} has sent you a briefing regarding project {{projectName}}. <br/><br/> <a href="{{chatUrl}}">View Briefing</a> <br><br>If you have any questions please contact us at hello@expanter.com <br><br><br>Thanks,<br>Expanter Team`,
        emailSubject: `You recieved a briefing`,
        sendCopyToAdmin: true
     },
     projectCreationEmailToAdmin: {
        emailMessage: `Hello Admin, <br/><br/> Client {{brandName}} has created a new project {{projectName}}. <br/><br/> <a href="{{projectUrl}}">View Project</a> <br><br><br>Thanks,<br>Expanter Team`,
        emailSubject: `New project is live`,
        sendCopyToAdmin: false
     },
     projectUpdationEmailToAdmin: {
        emailMessage: `Hello Admin, <br/><br/> Client {{brandName}} has updated the project {{projectName}}. <br/><br/> <a href="{{projectUrl}}">View Project</a> <br><br><br>Thanks,<br>Expanter Team`,
        emailSubject: `A project is updated`,
        sendCopyToAdmin: false
     }
 };

 var languageSpecificMessages = {
     verificationCodeMsg: {
         EN: 'Your 4 digit verification code for Expanter is {{four_digit_verification_code}}',
         ES_MX: 'Los 4 dígitos de verificación para Expanter son {{four_digit_verification_code}}'
     }
 };

 const EXTRA_VARS = {
     platformFee: 15,
     platformFeeRange: [{
         from: 0,
         to: 2500,
         fee: 15
     }, {
         from: 2500,
         to: 6000,
         fee: 12
     }, {
         from: 6000,
         to: 12000,
         fee: 10
     }, {
         from: 12000,
         to: 50000,
         fee: 8
     }, {
         from: 50000,
         fee: 6
     }]
 }

 const ADMIN_BANK_ACCOUNT_DETAILS = {
     accountName: "Expanter International Limited",
     accountNumber: "47414109284",
     bankName: "Standard Chartered Bank (Hong Kong) Ltd",
     bankAddress: "32nd Floor, 4-4A Des Voeux Road Central",
     bankCode: "003",
     swiftCode: "SCBLHKHH",
     country: "Hong Kong SAR",
     branchCode: "474"
 }

 var APP_CONSTANTS = {
     SERVER: SERVER,
     USER_CONSTANTS: USER_CONSTANTS,
     ADMIN_CONSTANTS: USER_CONSTANTS,
     DATABASE: DATABASE,
     DATABASE_KEYS: DATABASE_KEYS,
     PAGE_LIMIT: PAGE_LIMIT,
     USER_FILTER_DISTANCE: USER_FILTER_DISTANCE,
     STATUS_MSG: STATUS_MSG,
     emailNotificationMessages: emailNotificationMessages,
     languageSpecificMessages: languageSpecificMessages,
     swaggerDefaultResponseMessages: swaggerDefaultResponseMessages,
     smsNotificationMessages: smsNotificationMessages,
     ADMIN_ACCESS_TOKEN: ADMIN_ACCESS_TOKEN,
     NOTIFICATIONS: NOTIFICATIONS,
     PDF_TEMPLATES: PDF_TEMPLATES,
     EXTRA_VARS: EXTRA_VARS,
     ADMIN_BANK_ACCOUNT_DETAILS: ADMIN_BANK_ACCOUNT_DETAILS
 };

 module.exports = APP_CONSTANTS;