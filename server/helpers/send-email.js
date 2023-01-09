const config = require("config");
const nodemailer = require("nodemailer");
const nodeoutlook = require('nodejs-nodemailer-outlook');
const { isProductionEnv } = require("./env");
const logger = require("./logger");

async function sendEmail({
    to,
    subject,
    html,
    from = config.get("emailFrom"),
    attachments,
}) {
    if (!isProductionEnv()) {
        // Don't send email in the development env.
        return;
    }
    try {
        /*
        const transporter = nodemailer.createTransport(config.get("smtpOptions"));
        // transporter.verify().then(console.log).catch(console.error);
        await transporter.sendMail({ from, to, subject, html, attachments });
        */
        await nodeoutlook.sendEmail({
            auth: config.get("outlookSmtpOptions.auth"),
            from,
            to,
            subject,
            html,
            text: html,
            attachments,
            // onError: (e) => logger.error(e),
            onSuccess: (i) => logger.debug(i)
        }
        );
    } catch (err) {
        throw `Failed to send email, error=${err}`;
    }
}

module.exports = sendEmail;
