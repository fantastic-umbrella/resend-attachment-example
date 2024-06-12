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