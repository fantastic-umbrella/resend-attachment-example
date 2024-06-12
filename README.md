# Resend Attachment Example

This tutorial walks through creating a Next.js application that sends attachments using Resend, React Email, and Tailwind CSS. After completing this, you'll have a Next.js application to upload files and email the files to a recipient of your choosing.

## Table of Contents
- [Prerequisite](#Prerequisite)
- [Installing Dependencies](#Installing-Dependencies)
- [App Configuration](#App-Configuration)
- [Expected Project Structure](#Expected-Project-Structure)
- [Running the application](#Running-the-application)

## Prerequisite

To complete this tutorial, create a free [Resend](https://resend.com/) account and API Key for sending email, if you don't already have one. Resend allows you to deliver transactional and marketing emails at scale with a first-class developer experience. 

## Installing Dependencies

1. Install a fresh Next.js application.
   
```
npx create-next-app
```

2. You'll be asked some questions, to set the app up properly, answer them as the following:

```
✔ What is your project named? … [resend-attachment-example]
✔ Would you like to use TypeScript? … *No* 
✔ Would you like to use ESLint? … *Yes*
✔ Would you like to use Tailwind CSS? … *Yes*
✔ Would you like to use `src/` directory? … *No*
✔ Would you like to use App Router? (recommended) … *No*
✔ Would you like to customize the default import alias (@/*)? … *No*
```

3. Change directories into the app name you created:

```
cd resend-attachment-example
```

4. Install Resend, React Email, and Multipart (for handling file uploads):

```
npm install resend @react-email/components multiparty
```

## App Configuration

### 1. Resend API Key

In the application's root directory, create a `.env` file to store your Resend API Key.

```
// .env

RESEND_API_KEY=RESEND-API-KEY
```

Where `RESEND-API-KEY` is your API Key. To generate a new Resend API Key: 
1. Navigate to [API Keys](https://resend.com/api-keys).
2. Select `Create API Key`.

> [!NOTE]
> Save your API Key in your .env file, you'll only see this API Key once after generating. 

### 2. Hello.js File

The hello.js file handles our uploading logic of the attachment. 

In the `pages/api` directory, update the `hello.js` file With the contents of:

```
// pages/api/hello.js

import fs from 'fs';
import { Resend } from 'resend';
import multiparty from 'multiparty';
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
      await resend.emails.send({
        from: 'your-email@example.com',
        to: recipientEmail,
        subject: 'File Attachment',
        react: EmailTemplate({ firstName: recipientName }),
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
```

> [!NOTE]
> Make sure to update `from: 'your-email@example.com'` to use a verified domain from within your Resend account. 

If you haven't already set up a domain, now is a great time! To add and verify a domain within Resend:

1. Navigate to [Domains](https://resend.com/domains) within your Resend account.
2. Select `Add Domain`.
3. Add the TXT and MX records to your DNS provider for your domain.
4. Select `Verify Domain` while viewing the domain in Resend to complete verification.

> [!NOTE]
> Verifying your domain in Resend helps you follow recommendations from Gmail and Yahoo for best deliverability.

### 3. Index.js File

The index.js handles the front-end logic for the form to subject the attachment.

In the `pages` directory, update the `index.js` file with the contents of:

```
// pages/index.js

import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState(null);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleRecipientEmailChange = (e) => {
    setRecipientEmail(e.target.value);
  };

  const handleRecipientNameChange = (e) => {
    setRecipientName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('recipientEmail', recipientEmail);
    formData.append('recipientName', recipientName);

    const response = await fetch('/api/hello', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      setMessage('Email sent successfully!');
    } else {
      setMessage('Failed to send email.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Upload and Send File</h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-4">
            <span className="text-gray-700">Recipient Name</span>
            <input
              type="text"
              onChange={handleRecipientNameChange}
              value={recipientName}
              className="block w-full mt-2 p-2 border rounded dark:text-black"
              required
            />
          </label>
          <label className="block mb-4">
            <span className="text-gray-700">Recipient Email</span>
            <input
              type="email"
              onChange={handleRecipientEmailChange}
              value={recipientEmail}
              className="block w-full mt-2 p-2 border rounded dark:text-black"
              required
            />
          </label>
          <label className="block mb-4">
            <span className="text-gray-700">Upload File</span>
            <input
              type="file"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100 mt-2"
              required
            />
          </label>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 font-semibold py-2 px-4 rounded dark:text-wite text-white"
          >
            Submit
          </button>
        </form>
        {message && (
          <p className="mt-4 text-center text-gray-600">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

```


### 4. Create the _app.js File

In the `pages` directory, update the `_app.js` file with the contents of:

```
// pages/_app.js

import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp
```

### 5. Config set-up

This ensures React Email will run properly. 

Within the `jsconfig.json` file, add:

```
{
  "compilerOptions": {
    "jsx": "react",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```


### 6. React Email Set-up

React Email handles email templates, using Tailwind.

Create a new folder in the root directory named `components`. Create a file named `email-template.tsx`. With the contents of:

```
// components/mail-template.tsx

import { Tailwind } from "@react-email/components";
import React from "react";

interface EmailTemplateProps {
  firstName: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
}) => (
  <html>
    <Tailwind>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6 font-sans">Attached Emails</h2>
            <p className="mt-4 text-center font-sans text-gray-600">
                Thank you for sending an email, {firstName}.
            </p>
            <p className="mt-4 text-center font-sans text-gray-600">
                Find your files attached to this message.
            </p>
          </div>
      </div>
    </Tailwind>
  </html>
);


export default EmailTemplate;
```

## Expected Project Structure

Once the files are created, the expected project structure is:

```
resend-attachment-example/
├── node_modules/
├── public/
├── styles/
│   ├── globals.css
├── pages/
│   ├── api/
│   │   └── hello.js
│   ├── _app.js
│   └── index.js
├── .env
├── jsconfig.json
├── .gitignore
├── package.json
├── README.md
├── tailwind.config.js
├── postcss.config.js
└── next.config.js
```



## Running the Application

Once you've added the necessary files and directory, run: 

```
npm run dev
```

This will run the application locally, and you'll be able to send emails from your web browser.

