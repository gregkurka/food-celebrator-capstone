import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

function Footer() {
  return (
    <footer className="w-full bg-background dark:bg-darkbackground text-foreground dark:text-darkforeground py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
        {/* Navigation Links */}
        <nav className="flex space-x-6 text-sm mb-4">
          <Link
            to="/about"
            className="hover:text-secondary dark:hover:text-darksecondary transition"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="hover:text-secondary dark:hover:text-darksecondary transition"
          >
            Contact
          </Link>
          <Link
            to="/privacy"
            className="hover:text-secondary dark:hover:text-darksecondary transition"
          >
            Privacy Policy
          </Link>
        </nav>

        {/* Social Media Icons */}
        <div className="flex space-x-4 mb-4">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 dark:text-gray-500 hover:text-primary dark:hover:text-darkprimary transition text-xl"
          >
            <FaFacebook />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 dark:text-gray-500 hover:text-primary dark:hover:text-darkprimary transition text-xl"
          >
            <FaTwitter />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 dark:text-gray-500 hover:text-primary dark:hover:text-darkprimary transition text-xl"
          >
            <FaInstagram />
          </a>
        </div>

        {/* Copyright */}
        <p className="text-gray-400 text-xs">
          &copy; {new Date().getFullYear()} Food Celebrator. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
