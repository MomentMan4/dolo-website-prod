"use client"

import { motion } from "framer-motion"
import { Shield, Lock, GitBranch, Users, Zap, Database } from "lucide-react"

const PrivateBuildPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            className="text-4xl lg:text-6xl font-bold text-gray-800 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Build in Private. Launch with Confidence.
          </motion.h1>
          <motion.p
            className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Custom digital infrastructure for brands that need more than just a website. Advanced features,
            integrations, and full-stack solutions built to your exact specifications.
          </motion.p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <Shield className="w-8 h-8 text-[#FF6B35] mr-3" />
                <h2 className="text-xl font-semibold text-gray-800">Isolated Environment</h2>
              </div>
              <p className="text-gray-600">
                Your code and data are completely isolated from the outside world with enterprise-grade security
                protocols.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <Lock className="w-8 h-8 text-[#007196] mr-3" />
                <h2 className="text-xl font-semibold text-gray-800">Secure Access</h2>
              </div>
              <p className="text-gray-600">
                Control who has access to your private build environment with role-based permissions and authentication.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <GitBranch className="w-8 h-8 text-[#FF5073] mr-3" />
                <h2 className="text-xl font-semibold text-gray-800">Version Control</h2>
              </div>
              <p className="text-gray-600">
                Track changes and revert to previous versions with ease using integrated version control systems.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <Users className="w-8 h-8 text-[#003B6F] mr-3" />
                <h2 className="text-xl font-semibold text-gray-800">Team Collaboration</h2>
              </div>
              <p className="text-gray-600">
                Enable seamless collaboration between your team members with shared workspaces and real-time updates.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <Zap className="w-8 h-8 text-[#FF6B35] mr-3" />
                <h2 className="text-xl font-semibold text-gray-800">High Performance</h2>
              </div>
              <p className="text-gray-600">
                Optimized infrastructure ensures your applications run at peak performance with minimal latency.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <Database className="w-8 h-8 text-[#007196] mr-3" />
                <h2 className="text-xl font-semibold text-gray-800">Data Management</h2>
              </div>
              <p className="text-gray-600">
                Comprehensive data management solutions with backup, recovery, and analytics capabilities.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            className="text-3xl lg:text-4xl font-bold text-gray-800 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Development Roadmap
          </motion.h2>
          <motion.p
            className="text-lg text-gray-600 max-w-2xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Our strategic approach to building your custom solution from concept to launch.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Discovery", desc: "Understanding your requirements and technical needs" },
              { step: "02", title: "Architecture", desc: "Designing the technical foundation and infrastructure" },
              { step: "03", title: "Development", desc: "Building your custom solution with regular updates" },
              { step: "04", title: "Launch", desc: "Deploying and optimizing your private build environment" },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-[#FF6B35] to-[#FF5073] rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise Grade Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            className="text-3xl lg:text-4xl font-bold text-gray-800 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Enterprise Grade Security
          </motion.h2>
          <motion.p
            className="text-lg text-gray-600 max-w-3xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Built with the highest security standards in mind. Your data and applications are protected by
            industry-leading security measures and compliance protocols.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "End-to-End Encryption", desc: "All data is encrypted in transit and at rest" },
              { title: "Compliance Ready", desc: "GDPR, HIPAA, and SOC 2 compliance available" },
              { title: "24/7 Monitoring", desc: "Continuous security monitoring and threat detection" },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-lg shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-gradient-to-r from-[#003B6F] to-[#007196]">
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            className="text-3xl lg:text-4xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Ready to Start Building Privately?
          </motion.h2>
          <motion.p
            className="text-lg text-gray-200 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Let's discuss your project requirements and create a custom solution that meets your exact needs.
          </motion.p>
          <motion.button
            className="bg-[#FF6B35] hover:bg-[#FF5073] text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started Today
          </motion.button>
        </div>
      </section>
    </div>
  )
}

// Export both named and default exports
export { PrivateBuildPage }
export default PrivateBuildPage
