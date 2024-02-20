import React from 'react';

function Footer() {
  return (
    <footer className="text-gray-600 body-font bg-gray-200">
      <div className="container px-5 py-8 mx-auto flex items-center sm:flex-row flex-col">
        <p className="text-sm text-gray-500 sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:mt-0 mt-4">
          © {new Date().getFullYear()} MyApp —
          <a href="https://twitter.com/myapp" className="text-gray-600 ml-1" rel="noopener noreferrer" target="_blank">@LegalEase</a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
