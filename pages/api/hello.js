// pages/api/hello.js

import fs from 'fs';
import { Resend } from 'resend';
import multiparty from 'multiparty';
import { renderToStaticMarkup } from 'react-dom/server';
import { EmailTemplate } from '../../components/email-template';


export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadFile = async (req, res) => {
  const form = new multiparty.Form();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.status(500).json({ error: 'Error parsing the files' });
      return;
    }

    const file = files.file[0];
    const recipientEmail = fields.recipientEmail[0];
    const recipientName = fields.recipientName[0];

    // Read the file content
    const filePath = file.path;
    const fileContent = fs.readFileSync(filePath);
    const fileName = file.originalFilename;

    // Send email with Resend
    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
      const emailHtml = renderToStaticMarkup(<EmailTemplate firstName={recipientName} />);
    
      await resend.emails.send({
        from: 'your-email@example.com',
        to: recipientEmail,
        subject: 'File Attachment',
        html: emailHtml,
        attachments: [
          {
            filename: fileName,
            content: fileContent.toString('base64'),
          },
        ],
      });
    
      res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    } finally {
      // Delete the temporary file after sending email
      fs.unlinkSync(filePath);
    }
  });
};

export default uploadFile;
