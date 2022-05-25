import { MailService } from "@sendgrid/mail";
import applicationConfigRelease from "../utils/application.config.release";

export const useMail = () => {
  const sendMail = async(to:string, subject?: string, text?: string, attachments?: Array<any>) => {
    const sgMail = new MailService()
    sgMail.setApiKey(applicationConfigRelease.SENDGRID_API_KEY);
    const msg = {
      to: to,
      from: applicationConfigRelease.SENDER_EMAIL,
      subject: subject ?? 'Sending with SendGrid is Fun',
      text: text ?? 'and easy to do anywhere, even with Node.js',
      attachments: attachments ?? []
    };

    try {
      await sgMail.send(msg)
    } catch (error) {
    console.log(error); 
    }
  }
  return {sendMail}
}