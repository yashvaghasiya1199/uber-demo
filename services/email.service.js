const nodemailer = require("nodemailer");

async function emailService (email,otp) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        },
    });

    (async () => {
        const info = await transporter.sendMail({
            from: '<vy.hmr@gmail.com>',
            to: email,
            subject: "Hello ✔",
            text: "Hello user",
            html: `<b>Your OTP is: ${otp}</b>`,

        });

        console.log("Message sent:", info.messageId);
    })();
}






module.exports = {
    emailService,
}