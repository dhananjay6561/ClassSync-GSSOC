function Footer() {
  return (
    <footer className="w-full bg-white/90 backdrop-blur-md shadow-inner mt-20 px-6 text-gray-700">
      <div className="w-full px-8 py-8 sm:px-12 lg:px-16 xl:px-20 flex flex-col lg:flex-row justify-between items-center text-sm space-y-6 lg:space-y-0 animate-fade-in">

        {/* Logo and copyright */}
        <div className="flex items-center space-x-3">
          <img
            src="/logo.svg"
            alt="ClassSync Logo"
            className="w-10 h-10 transition-transform duration-300 hover:scale-110"
          />
          <p className="transition-transform duration-300 ease-in-out hover:scale-105 hover:text-indigo-500">
            &copy; 2025 ClassSync. All rights reserved.
          </p>
        </div>

        {/* Links and GitHub */}
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-8">

          <div className="flex space-x-6">
            <a
              href="#"
              className="hover:text-indigo-500 transition-colors duration-300 underline-offset-2 hover:underline"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="hover:text-indigo-500 transition-colors duration-300 underline-offset-2 hover:underline"
            >
              Terms of Service
            </a>
          </div>

          <div className="flex items-center space-x-2 group">
            <svg
              className="w-5 h-5 text-gray-600 group-hover:text-indigo-500 transition-colors duration-300"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
         <div className="relative group inline-block">
  <a
    href="https://github.com/dhananjay6561/ClassSync"
    target="_blank"
    rel="noopener noreferrer"
    className="hover:text-indigo-500 transition-colors duration-300 underline-offset-2 hover:underline"
  >
    GitHub
  </a>

  {/* Tooltip */}
  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-indigo-500 text-white text-xs font-medium px-3 py-1 rounded shadow-md z-10 whitespace-nowrap">
   Explore on GitHub
  </div>
</div>

          </div>

        </div>
      </div>
    </footer>
  );
}

export default Footer;
