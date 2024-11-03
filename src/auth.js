// mailing service

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "live.smtp.mailtrap.io",
    port: 587,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_USER_PASSWORD,
    }
});


export async function sendMail({mailto, subject, text}){
    const mailOptions = {
        from: process.env.MAIL_USER_EMAIL,
        to: mailto,
        subject: subject,
        text: text
    }
    try {
        const response = await transporter.sendMail(mailOptions);
        return response;
    } catch (error) {
        throw error
    }
}



export async function passwordRecovery(req,res){
    const {useremail} = req.body
    if(!useremail){
        return res.status(400).json({msg: "Please Provide your email"})
    }
    try {
        const otp = Math.floor(Math.random() * 1000000);
        console.log(otp)
        const response = await sendMail({mailto: useremail, subject: "Password Recovery Mail", text: `Your Password Recovery Code is ${otp}\n It will expire after 5 minutes`})
        return res.status(200).json({msg: "Mail Sent Successfully", response})
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg: "Something went wrong"})
    }
}