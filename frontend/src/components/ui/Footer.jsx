function Footer() {
  return (
    <footer className="w-full bg-white/80 backdrop-blur-sm shadow-inner mt-20 ">
      <div className="max-w-7xl mx-auto px-6 py-6 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600">
        <p>&copy; 2025 ClassSync. All rights reserved.</p>
        <div className="flex space-x-4 mt-2 sm:mt-0">
          <a href="#" className="hover:text-indigo-600">Privacy Policy</a>
          <a href="#" className="hover:text-indigo-600">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
export default Footer;