const PrivateBuildPage = () => {
  return (
    <div className="bg-gray-100">
      {/* Hero Section */}
      <section className="py-8 bg-white">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Build in Private. Launch with Confidence.</h1>
          <p className="text-lg text-gray-600">Develop your product in a secure, isolated environment.</p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Isolated Environment</h2>
              <p className="text-gray-600">Your code and data are completely isolated from the outside world.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Secure Access</h2>
              <p className="text-gray-600">Control who has access to your private build environment.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Version Control</h2>
              <p className="text-gray-600">Track changes and revert to previous versions with ease.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="py-8">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Roadmap</h2>
          <p className="text-lg text-gray-600">Our plans for the future of private builds.</p>
          {/* Roadmap items could go here */}
        </div>
      </section>

      {/* Enterprise Grade Section */}
      <section className="py-8">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Enterprise Grade Security</h2>
          <p className="text-lg text-gray-600">Built with the highest security standards in mind.</p>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-8 bg-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Start Building Privately Today</h2>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Get Started</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-4 text-center text-gray-500">&copy; 2023 Private Build</footer>
    </div>
  )
}

export default PrivateBuildPage
