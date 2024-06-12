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
