import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingBag, FaTag, FaUtensils, FaUsers, FaHandPaper, FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';

const LandingPage = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const categoryVariants = {
    hover: {
      y: -5,
      scale: 1.05,
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl">
              Share & Save
            </h1>
            <p className="mt-6 text-xl text-orange-100 max-w-2xl mx-auto">
              Your community marketplace for sharing resources, saving money, and reducing waste.
            </p>
            <div className="mt-10">
              <Link 
                to="/signup" 
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-orange-600 bg-white hover:bg-gray-50 transition-all duration-300 hover:shadow-md"
              >
                Get Started
                <FaArrowRight className="ml-2" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Categories Section */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 -mt-12">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="grid grid-cols-2 md:grid-cols-5 gap-0.5 bg-gray-200">
            {[
              { icon: <FaShoppingBag className="text-3xl mb-2" />, text: "Free Products", to: "/free-products" },
              { icon: <FaTag className="text-3xl mb-2" />, text: "Discount Products", to: "/discount-products" },
              { icon: <FaUtensils className="text-3xl mb-2" />, text: "Food", to: "/food" },
              { icon: <FaUsers className="text-3xl mb-2" />, text: "Community", to: "/community" },
              { icon: <FaHandPaper className="text-3xl mb-2" />, text: "Request", to: "/request" }
            ].map((item, index) => (
              <motion.div 
                key={index}
                ivariants={itemVariants}
                whileHover="hover"
                cvariants={categoryVariants}
                className="bg-white"
              >
                <Link 
                  to={item.to} 
                  className="flex flex-col items-center p-6 hover:bg-orange-50 transition-all duration-300 group"
                >
                  <div className="text-orange-500 group-hover:text-orange-600 transition-colors">
                    {item.icon}
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-orange-600 transition-colors">
                    {item.text}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* How It Works Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-600 mx-auto">
              Join thousands in sharing resources and saving together
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: "List or Request", 
                description: "Post items you want to share or request what you need", 
                color: "bg-orange-100 text-orange-600" 
              },
              { 
                title: "Connect", 
                description: "Find local community members to exchange with", 
                color: "bg-blue-100 text-blue-600" 
              },
              { 
                title: "Share & Save", 
                description: "Complete the exchange and enjoy the benefits", 
                color: "bg-green-100 text-green-600" 
              }
            ].map((step, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold`}>
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold text-center mb-4 text-gray-800">{step.title}</h3>
                <p className="text-gray-600 text-center">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Meet Our Team</h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-600 mx-auto">
              The passionate people behind Share & Save
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { 
                name: "Ehsanul Haque Sinin", 
                role: "Full-stack Developer",
                img: require('../assets/team-member-1.jpg'),
                facebook: "https://www.facebook.com/share/18gQq8ixNQ/",
                github: "https://github.com/sinin-2020331078",
                linkedin: "https://www.linkedin.com/in/ehsanul-haque-sinin"
              },
              { 
                name: "Amit Biswas", 
                role: "Full-stack Developer",
                img: require('../assets/team-member-2.jpg'),
                facebook: "https://www.facebook.com/amitbiswas709254",
                github: "https://github.com/amit-biswas-106"
              },
              { 
                name: "Md. Tazbir Hossain Akash", 
                role: "Full-stack Developer",
                img: require('../assets/team-member-3.jpg'),
                facebook: "https://facebook.com/tazbirhossain.akash.3",
                github: "https://github.com/oneakash",
                linkedin: "https://www.linkedin.com/in/tazbirhossain-akash/"
              }
            ].map((member, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="relative w-48 h-48 mx-auto mb-6 group">
                  <div className="absolute inset-0 bg-orange-500 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-full h-full object-cover rounded-full border-4 border-white shadow-lg"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">{member.name}</h3>
                <p className="text-orange-600 mt-2">{member.role}</p>
                <div className="mt-4 flex justify-center space-x-4">
                  <a href={member.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-orange-500 transition-colors">
                    <span className="sr-only">Facebook</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.675 0h-21.35C.592 0 0 .593 0 1.326v21.348C0 23.406.592 24 1.325 24h11.494v-9.294H9.691v-3.622h3.128V8.413c0-3.1 1.894-4.788 4.659-4.788 1.325 0 2.464.099 2.797.143v3.24l-1.92.001c-1.505 0-1.796.716-1.796 1.765v2.317h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.594 1.323-1.326V1.326C24 .593 23.406 0 22.675 0z" />
                    </svg>
                  </a>

                  <a href={member.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-orange-500 transition-colors">
                    <span className="sr-only">GitHub</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-orange-500 transition-colors">
                    <span className="sr-only">LinkedIn</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to join the sharing community?</h2>
          <p className="text-xl text-orange-100 mb-8 max-w-3xl mx-auto">
            Start sharing resources, saving money, and building connections today.
          </p>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4">
            <Link 
              to="/signup" 
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-orange-600 bg-white hover:bg-gray-50 transition-all duration-300 hover:shadow-md"
            >
              Sign Up Now
              <FaArrowRight className="ml-2" />
            </Link>
            <Link 
              to="/about" 
              className="inline-flex items-center px-6 py-3 border border-white text-base font-medium rounded-md shadow-sm text-white bg-transparent hover:bg-white hover:bg-opacity-10 transition-all duration-300"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;