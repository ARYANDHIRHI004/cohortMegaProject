import Mailgen from "mailgen"
import nodemailer from "nodemailer"

const sendMail = async (options) => {
    const mailGenerator = new Mailgen({
        Theme: 'default',
        product: {
            name: "Task manager",
            link: "https://google.com"
        },
    })

    let emailBody = mailGenerator.generate(options.mailGenContent);
    let emailText = mailGenerator.generatePlaintext(options.mailGenContent);

    const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_HOST,
        port: process.env.MAILTRAP_PORT,
        secure: false, 
        auth: {
            user: process.env.MAILTRAP_USER,
            pass: process.env.MAILTRAP_PASS,
        },
      });

      const mail = {
        from: 'aryan@noreply.com', // sender address
        to: options.email, // list of receivers
        subject: options.subject, // Subject line
        text: emailText, // plain text body
        html:emailBody, // html body
      }
      
      try {
          await transporter.sendMail(mail);
          return true
        } catch (error) {
            console.log("Email failed");
            return false
        }
    }
    
const emailVerificationMailGenContent = (username, verificationUrl)=>{
        return {
            body: {
                name: username,
                intro: "Welcome to our App",
                action: {
                    instruction: "To get started with our app",
                    button: {
                        color: "#12BC55",
                        text: "Verify your email",
                        link: verificationUrl
                    }
                },
                outro: "End" 
            }
        }
}

const passwordResetMailGenContent = (username, passwordResetUrl)=>{
    return {
        body: {
            name: username,
            intro: "Welcome to our App",
            action: {
                instruction: "To get started with our app",
                button: {
                    color: "#12BC55",
                    text: "Reset Password",
                    link: passwordResetUrl
                }
            },
            outro: "End" 
        }
    }
}

export {
    sendMail,
    passwordResetMailGenContent,
    emailVerificationMailGenContent,
}
