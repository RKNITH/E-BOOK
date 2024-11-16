import nodemailer from "nodemailer";
import { MailtrapClient } from "mailtrap";

interface VerificationMailOptions {
  link: string;
  to: string;
  name: string;
}

const TOKEN = process.env.MAILTRAP_TOKEN!;

const client = new MailtrapClient({ token: TOKEN });

const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_TEST_USER,
    pass: process.env.MAILTRAP_TEST_PASS,
  },
});

const sendVerificationMailProd = async (options: VerificationMailOptions) => {
  const sender = {
    email: "no-reply@fsniraj.dev",
    name: "User Sign In",
  };
  const recipients = [
    {
      email: options.to,
    },
  ];

  await client.send({
    from: sender,
    to: recipients,
    template_uuid: "e1e23630-8364-4fdb-814f-32eea50e192f",
    template_variables: {
      user_name: options.name,
      sign_in_link: options.link,
    },
  });
};

const sendVerificationTestMail = async (options: VerificationMailOptions) => {
  await transport.sendMail({
    to: options.to,
    from: process.env.VERIFICATION_MAIL,
    subject: "Auth Verification",
    html: `
            <div>
              <p>Please click on <a href="${options.link}">this link</a> to verify you account.</p>
            </div> 
          `,
  });
};

const mail = {
  async sendVerificationMail(options: VerificationMailOptions) {
    if (process.env.NODE_ENV === "development")
      await sendVerificationTestMail(options);
    else await sendVerificationMailProd(options);
  },
};

export default mail;
