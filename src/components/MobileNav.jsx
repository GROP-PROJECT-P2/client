import { useState } from "react";

function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNav = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      {/* Hamburger Button */}
      <button onClick={toggleNav} className="text-white focus:outline-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Mobile Navigation Sheet */}
      <div
        className={`fixed inset-0 bg-gray-800 bg-opacity-50 z-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleNav}
      >
        {/* Sheet Content */}
        <div
          className={`fixed right-0 top-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Sheet Header */}
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-semibold text-gray-800">Menu</h2>
            <button
              onClick={toggleNav}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Sheet Content - Navigation Links */}
          <nav className="flex flex-col p-4">
            <a
              href="/login"
              className="py-3 px-4 text-gray-700 hover:bg-blue-50 hover:text-blue-500 rounded-md transition-colors"
              onClick={toggleNav}
            >
              Login
            </a>
            <a
              href="/about"
              className="py-3 px-4 text-gray-700 hover:bg-blue-50 hover:text-blue-500 rounded-md transition-colors"
              onClick={toggleNav}
            >
              Tentang Kami
            </a>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default MobileNav;
