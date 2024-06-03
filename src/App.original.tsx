import { useState } from 'react'
import { BrowserRouter, Route, Link, Routes } from 'react-router-dom'

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <BrowserRouter>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 bg-white shadow-lg transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out z-30 md:relative md:translate-x-0 w-64`}
        >
          <div className="flex flex-col h-full overflow-y-auto">
            <div className="p-4 font-bold text-xl border-b">MyApp</div>
            <nav className="flex-1 p-4 space-y-2">
              <Link
                to="/"
                className="block py-2 px-4 hover:bg-gray-200 rounded"
              >
                Ater
              </Link>
              <Link
                to="/about"
                className="block py-2 px-4 hover:bg-gray-200 rounded"
              >
                About
              </Link>
              <Link
                to="/services"
                className="block py-2 px-4 hover:bg-gray-200 rounded"
              >
                Services
              </Link>
              <Link
                to="/contact"
                className="block py-2 px-4 hover:bg-gray-200 rounded"
              >
                Contact
              </Link>
              <Link
                to="/"
                className="block py-2 px-4 hover:bg-gray-200 rounded"
              >
                Home
              </Link>
              <Link
                to="/about"
                className="block py-2 px-4 hover:bg-gray-200 rounded"
              >
                About
              </Link>
              <Link
                to="/services"
                className="block py-2 px-4 hover:bg-gray-200 rounded"
              >
                Services
              </Link>
              <Link
                to="/contact"
                className="block py-2 px-4 hover:bg-gray-200 rounded"
              >
                Contact
              </Link>
              <Link
                to="/"
                className="block py-2 px-4 hover:bg-gray-200 rounded"
              >
                Home
              </Link>
              <Link
                to="/about"
                className="block py-2 px-4 hover:bg-gray-200 rounded"
              >
                About
              </Link>
              <Link
                to="/services"
                className="block py-2 px-4 hover:bg-gray-200 rounded"
              >
                Services
              </Link>
              <Link
                to="/contact"
                className="block py-2 px-4 hover:bg-gray-200 rounded"
              >
                Contact
              </Link>
              <Link
                to="/"
                className="block py-2 px-4 hover:bg-gray-200 rounded"
              >
                Home
              </Link>
              <Link
                to="/about"
                className="block py-2 px-4 hover:bg-gray-200 rounded"
              >
                About
              </Link>
              <Link
                to="/services"
                className="block py-2 px-4 hover:bg-gray-200 rounded"
              >
                Services
              </Link>
              <Link
                to="/contact"
                className="block py-2 px-4 hover:bg-gray-200 rounded"
              >
                Contact
              </Link>
              <Link
                to="/"
                className="block py-2 px-4 hover:bg-gray-200 rounded"
              >
                Home
              </Link>
              <Link
                to="/about"
                className="block py-2 px-4 hover:bg-gray-200 rounded"
              >
                About
              </Link>
              <Link
                to="/services"
                className="block py-2 px-4 hover:bg-gray-200 rounded"
              >
                Services
              </Link>
              <Link
                to="/contact"
                className="block py-2 px-4 hover:bg-gray-200 rounded"
              >
                Contact
              </Link>
              <Link
                to="/"
                className="block py-2 px-4 hover:bg-gray-200 rounded"
              >
                Home
              </Link>
              <Link
                to="/about"
                className="block py-2 px-4 hover:bg-gray-200 rounded"
              >
                About
              </Link>
              <Link
                to="/services"
                className="block py-2 px-4 hover:bg-gray-200 rounded"
              >
                Services
              </Link>
              <Link
                to="/contact"
                className="block py-2 px-4 hover:bg-gray-200 rounded"
              >
                Contact
              </Link>
              <Link
                to="/"
                className="block py-2 px-4 hover:bg-gray-200 rounded"
              >
                Home
              </Link>
              <Link
                to="/about"
                className="block py-2 px-4 hover:bg-gray-200 rounded"
              >
                About
              </Link>
              <Link
                to="/services"
                className="block py-2 px-4 hover:bg-gray-200 rounded"
              >
                Services
              </Link>
              <Link
                to="/contact"
                className="block py-2 px-4 hover:bg-gray-200 rounded"
              >
                Contact
              </Link>
            </nav>
          </div>
        </div>

        {/* Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black opacity-50 z-20 md:hidden"
            onClick={toggleSidebar}
          ></div>
        )}

        {/* Main Content */}
        <div className="flex flex-col flex-1 w-full overflow-hidden">
          <header className="flex items-center justify-between bg-white shadow p-4">
            <button className="md:hidden" onClick={toggleSidebar}>
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <nav className="hidden md:flex space-x-4">
              <Link
                to="/"
                className="py-2 px-4 hover:border-b-2 border-blue-500"
              >
                Home
              </Link>
              <Link
                to="/about"
                className="py-2 px-4 hover:border-b-2 border-blue-500"
              >
                About
              </Link>
              <Link
                to="/services"
                className="py-2 px-4 hover:border-b-2 border-blue-500"
              >
                Services
              </Link>
              <Link
                to="/contact"
                className="py-2 px-4 hover:border-b-2 border-blue-500"
              >
                Contact
              </Link>
            </nav>
          </header>
          <main className="flex-1 overflow-y-auto p-4">
            {Array.from(new Array(100)).map((_, i) => (
              <div key={i} className="border-b p-4">
                <h1 className="text-2xl font-bold">Title</h1>
                <p className="text-gray-600">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Voluptatem, quibusdam.
                </p>
              </div>
            ))}
          </main>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
