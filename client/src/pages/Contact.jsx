import React from "react";

function Contact() {
  return (
    <div className="min-h-screen backgroundcolor text-foreground dark:text-darkforeground flex justify-center items-center px-6 animate-fadeIn">
      <div className="bg-muted dark:bg-darkmuted p-8 rounded-xl shadow-lg max-w-lg w-full">
        <h1 className="text-3xl font-bold text-center mb-6">Contact Us</h1>
        <form className="space-y-4">
          {/* Name Input */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium">
              Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-black"
            />
          </div>

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-black"
            />
          </div>

          {/* Message Input */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium">
              Message:
            </label>
            <textarea
              id="message"
              name="message"
              required
              className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-black h-32 resize-none"
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 px-4 rounded-lg shadow-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default Contact;
