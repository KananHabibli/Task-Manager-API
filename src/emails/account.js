const sgMail = require('@sendgrid/mail')


sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'habiblikanan@gmail.com',
        subject: 'Thanks for joining in!',
        text: `Welcome to the app, ${name}. Let me how you go along with the app`
    })
}

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'habiblikanan@gmail.com',
        subject: 'We hope we can see you soon!',
        text: `See you soon, ${name} !`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}