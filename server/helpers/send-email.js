const config = require("config");
const nodemailer = require("nodemailer");
const { isProductionEnv } = require("./env");

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
    const transporter = nodemailer.createTransport(config.get("smtpOptions"));
    // transporter.verify().then(console.log).catch(console.error);
    try {
        await transporter.sendMail({ from, to, subject, html, attachments });
    } catch (err) {
        throw `Failed to send email, error=${err}`;
    }
}

module.exports = sendEmail;
