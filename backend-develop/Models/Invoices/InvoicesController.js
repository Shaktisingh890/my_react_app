var Service = require('../../Services');
var Models = require('../../Models');
var ControllerModule = require('../../Controllers/ControllerModule').ControllerModule;
var UniversalFunctions = require('../../Utils/UniversalFunctions');
var controllerHelper = require('../../Controllers/commonControllerFunctions');
var Config = require('../../constant');

const config = require("config");
var NotificationManager = require('../../Lib/NotificationManager');

const stripe = require('stripe')(config.get("stripe").secretKey);

const dateFn = require('date-fns');
const Handlebars = require('handlebars');

function startSection(sectionName) {

    console.log('=====================' + sectionName + '===================')
}


function InvoicesController(service) {


    //console.log('============================================InvoicesController controller initialised')
    ControllerModule.call(this, service);
}

InvoicesController.prototype = Object.create(ControllerModule.prototype)

InvoicesController.prototype.parentEdit = InvoicesController.prototype.edit;

InvoicesController.prototype.edit = async function(data, callback) {

    try {
        const invoice = await this.service.viewAsyncById(data.criteria, {}, {lean: true, limit: 1});

        if(invoice.paymentStatus !== Config.APP_CONSTANTS.DATABASE_KEYS.paymentStatus.inProcess) {
            const errMsg = "Only In-Process payments can be marked as completed."
            return callback(Config.APP_CONSTANTS.STATUS_MSG.ERROR.customError(errMsg));
        } else {
            const updatedInvoice = await this.service.editAsync(data.criteria, data.projection, data.options);
        }

        return callback(null, updatedInvoice);

    } catch(err) {
        return callback(err);
    }

}

InvoicesController.prototype.sendInvoices = async function sendInvoices(data) {

    const hireCriteria = { proposalId: data.payload.proposalId, serviceProviderId: data.userData._id, isDeleted: false, population: [{ path: "brandId" }, { path: "projectId" }] };

    const hiringArr = await Service.makeModule.hirings.viewAsync(hireCriteria, {}, { lean: true, limit: 1 });

    if (!hiringArr.length) {
        const errMsg = "You can only send invoice once you are hired against this proposal.";
        return Promise.reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.customError(errMsg));
    }

    const hiring = hiringArr[0];

    const objToSave = data.payload;

    objToSave.serviceProviderId = data.userData._id;
    objToSave.brandId = hiring.brandId._id;
    objToSave.projectId = hiring.projectId._id;
    objToSave.proposalId = hiring.proposalId;
    objToSave.hiringId = hiring._id;

    const commissionRange = Config.APP_CONSTANTS.EXTRA_VARS.platformFeeRange;

    const commissionObj = commissionRange.filter(x => (x.from <= data.payload.invoiceAmount && (!x.to || x.to > data.payload.invoiceAmount)));

    const commissionPercent = commissionObj[0].fee;

    const commissionAmount = UniversalFunctions.decimalToTwoPoints((data.payload.invoiceAmount * commissionPercent) / 100);

    objToSave.brandCommissionPercent = commissionPercent;
    objToSave.brandCommisionAmount = commissionAmount;

    objToSave.spCommissionPercent = commissionPercent;
    objToSave.spCommissionAmount = commissionAmount;

    objToSave.totalCommissionAmount = UniversalFunctions.decimalToTwoPoints(objToSave.brandCommisionAmount + objToSave.spCommissionAmount);

    objToSave.payableByBrand = UniversalFunctions.decimalToTwoPoints(data.payload.invoiceAmount + objToSave.brandCommisionAmount);

    objToSave.spAmount = UniversalFunctions.decimalToTwoPoints(data.payload.invoiceAmount - objToSave.spCommissionAmount);

    console.log(objToSave, Math.round(objToSave.payableByBrand * 100));

    const priceObj = {
        unit_amount: Math.round(objToSave.payableByBrand * 100),
        currency: 'usd',
        product_data: { name: hiring.projectId.name, metadata: { hiringId: hiring._id } },
    }

    const stripePrice = await stripe.prices.create(priceObj);

    const redirectUrl = config.get("webUrl").brandPaymentListUrl + data.payload.proposalId;

    const linkObj = {
        line_items: [{ price: stripePrice.id, quantity: 1 }],
        after_completion: { type: 'redirect', redirect: { url: redirectUrl } },
        expand: ["line_items"]
    }

    const paymentLink = await stripe.paymentLinks.create(linkObj);

    objToSave.paymentLink = paymentLink.url;
    objToSave.stripeLinkId = paymentLink.id;
    objToSave.linkObj = JSON.stringify(paymentLink);

    const invoice = await this.service.addAsync(objToSave);

    const proposal = await Service.makeModule.proposals.editAsync({ _id: invoice.proposalId }, { status: Config.APP_CONSTANTS.DATABASE_KEYS.proposalStatus.paymentPending }, {});

    // const prevInvoices = await this.service.multiEditAsync({ _id: { $ne: invoice._id }, proposalId: invoice.proposalId }, { isDeleted: true }, { multi: true });

    const invoiceEmail = await this.sendNewInvoiceEmail(hiring.brandId, data.userData, hiring.projectId, invoice.invoice, "invoiceUploaded");

    await sendNewInvoiceNotificationToBrand(hiring.brandId, data.userData, hiring.projectId, invoice, "NEW_INVOICE_RECEIVED");

    return invoice;

}

function sendNewInvoiceNotificationToBrand(brand, serviceProvider, project, invoice, template) {

    const handlebarObj = {
        serviceProviderName: serviceProvider.businessName,
        projectName: project.name
    }

    const notifObj = Config.APP_CONSTANTS.NOTIFICATIONS.PUSH[template];

    notifObj.message = UniversalFunctions.renderMessageFromTemplateAndVariables(notifObj.message, handlebarObj);

    notifObj.userId = brand._id;
    notifObj.sentBy = serviceProvider._id;
    notifObj.notificationType = Config.APP_CONSTANTS.NOTIFICATIONS.TYPE.INVOICE;

    notifObj.extraData = { _id: invoice._id, projectId: project._id, brandId: brand._id, serviceProviderId: serviceProvider._id, proposal: invoice.proposalId };

    return Service.makeModule.notifications.addAsync(notifObj);

}

InvoicesController.prototype.sendNewInvoiceEmail = function sendNewInvoiceEmail(brand, serviceProvider, project, fileObj, template) {

    return new Promise((resolve, reject) => {

        const obj = {
            brandName: brand.businessName,
            serviceProviderName: serviceProvider.businessName,
            projectName: project.name,
            proposalUrl: config.get("webUrl").proposalUrl
        }

        // const s3 = config.get('s3Bucket');

        // const key = fileObj.original.split(`${s3.bucketUrl}/`)[1];

        // const splitArr = key.split("/");

        // const extSplitArr = splitArr[splitArr.length - 1].split(".");

        // const fileExt = extSplitArr[extSplitArr.length - 1];

        const emailObj = {
            title: template,
            handlebarData: obj,
            email: brand.email,
            // sendAttachement: true,
            // bucket: s3.name,
            // key: key,
            // filename: fileObj.name || "invoice." + fileExt
        }

        console.log("sendNewInvoiceEmail==>", emailObj);

        NotificationManager.sendEmailToUser(emailObj, (err, res) => {

            console.log("sendNewInvoiceEmail===>", err, res);

            resolve({});

        })

    })

}

InvoicesController.prototype.getInvoicesForBrand = async function getInvoicesForBrand(data) {

    const criteria = {
        brandId: data.userData._id,
        proposalId: data.payload.proposalId,
        isDeleted: false,
        population: [{ path: "serviceProviderId", select: "businessName logo" }, { path: "projectId", select: "title" }]
    };

    const projection = { stripeLinkId: 0, linkObj: 0 };

    const invoices = await this.service.viewAsync(criteria, projection, { lean: true, sort: { createdAt: -1 } });

    return invoices;

}

InvoicesController.prototype.getInvoicesForServiceProvider = async function getInvoicesForServiceProvider(data) {

    const criteria = {
        serviceProviderId: data.userData._id,
        proposalId: data.payload.proposalId,
        isDeleted: false,
        population: [{ path: "brandId", select: "businessName logo" }, { path: "projectId", select: "title" }]
    };

    const projection = { stripeLinkId: 0, linkObj: 0 };

    const invoices = await this.service.viewAsync(criteria, projection, { lean: true, sort: { createdAt: -1 } });

    return invoices;

}

InvoicesController.prototype.updateInvoiceDetails = async function updateInvoiceDetails(data) {

    const criteria = {
        serviceProviderId: data.userData._id,
        _id: data.payload._id,
        isDeleted: false,
        population: [{ path: "brandId" }, { path: "projectId" }]
    };

    const projection = {};

    const invoice = await this.service.viewAsyncById(criteria, {}, { lean: true, limit: 1 });

    if (invoice.isPaid || invoice.paymentStatus === Config.APP_CONSTANTS.DATABASE_KEYS.paymentStatus.completed) {

        const errMsg = "In process or completed invoices can't be updated.";
        return Promise.reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.customError(errMsg))

    } else {
        if (invoice.invoiceAmount != data.payload.invoiceAmount) {

            const oldPaymentLink = await stripe.paymentLinks.update(
                invoice.stripeLinkId, { active: false }
            );

            const stripeLinkObj = JSON.parse(invoice.linkObj);

            const priceId = stripeLinkObj.line_items.data[0].price.id;

            const price = await stripe.prices.update(
                priceId, { active: false }
            );

            const commissionRange = Config.APP_CONSTANTS.EXTRA_VARS.platformFeeRange;

            const commissionObj = commissionRange.filter(x => (x.from <= data.payload.invoiceAmount && (!x.to || x.to > data.payload.invoiceAmount)));

            const commissionPercent = commissionObj[0].fee;

            const commissionAmount = UniversalFunctions.decimalToTwoPoints((data.payload.invoiceAmount * commissionPercent) / 100);

            data.payload.brandCommissionPercent = commissionPercent;
            data.payload.brandCommisionAmount = commissionAmount;

            data.payload.spCommissionPercent = commissionPercent;
            data.payload.spCommissionAmount = commissionAmount;

            data.payload.totalCommissionAmount = UniversalFunctions.decimalToTwoPoints(data.payload.brandCommisionAmount + data.payload.spCommissionAmount);

            data.payload.payableByBrand = UniversalFunctions.decimalToTwoPoints(data.payload.invoiceAmount + data.payload.brandCommisionAmount);

            data.payload.spAmount = UniversalFunctions.decimalToTwoPoints(data.payload.invoiceAmount - data.payload.spCommissionAmount);

            const priceObj = {
                unit_amount: Math.round(data.payload.payableByBrand * 100),
                currency: 'usd',
                product_data: { name: invoice.projectId.name, metadata: { hiringId: invoice.hiringId } },
            }

            const stripePrice = await stripe.prices.create(priceObj);

            const redirectUrl = config.get("webUrl").brandPaymentListUrl + invoice.proposalId;

            const linkObj = {
                line_items: [{ price: stripePrice.id, quantity: 1 }],
                after_completion: { type: 'redirect', redirect: { url: redirectUrl } },
                expand: ["line_items"]
            }

            const paymentLink = await stripe.paymentLinks.create(linkObj);

            data.payload.paymentLink = paymentLink.url;
            data.payload.stripeLinkId = paymentLink.id;
            data.payload.linkObj = JSON.stringify(paymentLink);

        }

        const updatedInvoice = await this.service.editAsync({ _id: data.payload._id }, data.payload, { new: true });

        const invoiceEmail = await this.sendNewInvoiceEmail(invoice.brandId, data.userData, invoice.projectId, updatedInvoice.invoice, "invoiceUpdated");

        await sendNewInvoiceNotificationToBrand(invoice.brandId, data.userData, invoice.projectId, updatedInvoice, "UPDATED_INVOICE_RECEIVED");

        return updatedInvoice;

    }

}

InvoicesController.prototype.getStripePaymentWebhook = async function getStripePaymentWebhook(data) {

    const endpointSecret = config.get("stripe").webhookSecret;

    let event = data.body;

    console.log(data.body, data.sig, endpointSecret);

    try {
        event = stripe.webhooks.constructEvent(
            data.body,
            data.sig,
            endpointSecret
        );
    } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`, err.message);
        return Promise.reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.SERVER_ERROR);
    }

    console.log(event);

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            // Then define and call a function to handle the event checkout.session.completed

            const link = session.payment_link;

            const projection = {
                paymentStatus: Config.APP_CONSTANTS.DATABASE_KEYS.paymentStatus.inProcess,
                isPaid: true,
                paidAt: new Date(),
                checkoutSessionObj: JSON.stringify(session),
                paymentMethod: Config.APP_CONSTANTS.DATABASE_KEYS.paymentMethods.card
            };

            const invoice = await this.service.editAsync({ stripeLinkId: link }, projection, { new: true });

            const paymentLink = await stripe.paymentLinks.update(
                invoice.stripeLinkId, { active: false }
            );

            break;
            // ... handle other event types
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    return {};

}

InvoicesController.prototype.updatePaymentStatusByBrand = async function updatePaymentStatusByBrand(data) {

    const criteria = {
        brandId: data.userData._id,
        _id: data.payload._id,
        isDeleted: false
    };

    const invoice = await this.service.viewAsyncById(criteria, {}, { lean: true, limit: 1 });

    if (invoice.paymentStatus !== Config.APP_CONSTANTS.DATABASE_KEYS.paymentStatus.pending) {

        const errMsg = "This invoice payment is already in process or has been paid.";
        return Promise.reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.customError(errMsg))

    } else {

        const updatedInvoice = await this.service.editAsync({ _id: data.payload._id }, data.payload, { new: true });

        const paymentLink = await stripe.paymentLinks.update(
            invoice.stripeLinkId, { active: false }
        );

        return updatedInvoice;

    }

}

InvoicesController.prototype.downloadInvoice = async function downloadInvoice(data) {

    const criteria = {
        _id: data.payload._id,
        isDeleted: false,
        population: [{ path: "brandId", select: "businessName logo" }, { path: "serviceProviderId", select: "businessName logo" }, { path: "projectId", select: "name" }] 
    };

    if (data.userData.userRole === Config.APP_CONSTANTS.DATABASE_KEYS.userRole.brand) {
        criteria.brandId = data.userData._id;
    } else {
        criteria.serviceProviderId = data.userData._id;
    }

    const invoice = await this.service.viewAsyncById(criteria, {}, { lean: true, limit: 1 });

    const obj = await prepareDataForInvoicePDF(invoice, data.userData.userRole);

    const htmlTemplate = Config.APP_CONSTANTS.PDF_TEMPLATES.invoice.body;

    const updatedHtml = Handlebars.compile(htmlTemplate)(obj);

    const invoicePath = `../../invoice-${invoice._id}.pdf`;

    const pdfOptions = {
        format: 'A4',
        path: invoicePath,
        args: ["--no-sandbox"],
        printBackground: true,
        margin: {
            bottom: "50px",
            top: "30px"
        }

    }

    const fileObj = await UniversalFunctions.createPdfFromHTML(updatedHtml, pdfOptions, invoicePath);

    return fileObj;

}

InvoicesController.prototype.downloadInvoiceByAdmin = async function downloadInvoiceByAdmin(data) {

    const criteria = {
        _id: data.payload._id,
        isDeleted: false,
        population: [{ path: "brandId", select: "businessName logo" }, { path: "serviceProviderId", select: "businessName logo" }, { path: "projectId", select: "name" }] 
    };

    const invoice = await this.service.viewAsyncById(criteria, {}, { lean: true, limit: 1 });

    const obj = await prepareDataForInvoicePDF(invoice, data.payload.userRole);

    const htmlTemplate = Config.APP_CONSTANTS.PDF_TEMPLATES.invoice.body;

    const updatedHtml = Handlebars.compile(htmlTemplate)(obj);

    const invoicePath = `../../invoice-${invoice._id}.pdf`

    const pdfOptions = {
        format: 'A4',
        path: invoicePath,
        args: ["--no-sandbox"],
        printBackground: true,
        margin: {
            bottom: "50px",
            top: "30px"
        }

    }

    const fileObj = await UniversalFunctions.createPdfFromHTML(updatedHtml, pdfOptions, invoicePath);

    return fileObj;

}

function prepareDataForInvoicePDF(invoice, userRole) {

    return new Promise((resolve, reject) => {

        const obj = {
            serviceProviderName: invoice.serviceProviderId.businessName,
            brandName: invoice.brandId.businessName,
            projectName: invoice.projectId.name,
            invoiceDate: dateFn.format(invoice.createdAt, "dd/MM/yyyy"),
            dueDate: dateFn.format(invoice.dueDate, "dd/MM/yyyy"),
            services: invoice.services,
            milestone: invoice.milestone,
            projectFee: invoice.invoiceAmount
        }

        if (userRole === Config.APP_CONSTANTS.DATABASE_KEYS.userRole.brand) {
            obj.platformFee = `$${invoice.brandCommisionAmount}`;
            obj.finalAmount = `$${invoice.payableByBrand}`;
            obj.totalAmountType = "Total Amount"
        } else {
            obj.platformFee = `$${invoice.spCommissionAmount}`;
            obj.finalAmount = `$${invoice.spAmount}`;
            obj.totalAmountType = "Net Amount"
        }

        return resolve(obj);
    })

}


module.exports = {
    'invoices': new InvoicesController(Service.makeModule.invoices)
};;