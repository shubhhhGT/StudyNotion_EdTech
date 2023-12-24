// import mongoose for creating a schema
const mongoose = require('mongoose');
const mailSender = require('../utils/mailSender');
const emailTemplate = require('../mail/templates/emailVerificationTemplate');

// Create and export the schema
const otpSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
        },
        otp: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now(),
            expires: 5*60,
        }
    }
)

// A function to send emails
async function sendVerificationEmail(email, otp){
    try{
        const mailResponse = await mailSender(email, 'Verification Email from StudyNotion', emailTemplate(otp));
        console.log("Email sent Suceessfully", mailResponse);
    } catch(error){
        console.log("error occured while sending email", error);
        throw error;
    }
}

otpSchema.pre('save', async function (next){
    await sendVerificationEmail(this.email, this.otp);
    next();
})

module.exports = mongoose.model('OTP', otpSchema);