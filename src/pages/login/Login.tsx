export const Home = () => {
  return (
    <div className="max-w-md w-full p-8 bg-white shadow-lg rounded-lg">
      <span className="text-4xl font-bold text-blue-600 mb-4">
        Welcome to Entix Academy
      </span>
      <p className="text-blue-300 mb-8">Empowering minds through education.</p>
      <form className="mb-4">
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-gray-700 font-bold mb-2"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
        >
          Log In
        </button>
      </form>
      <p className="text-sm text-gray-600">
        Don't have an account?{' '}
        <a href="#" className="text-blue-500 hover:text-blue-600">
          Sign up
        </a>
      </p>
    </div>
  )
}
