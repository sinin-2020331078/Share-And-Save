import React from 'react';
import { Link } from 'react-router-dom';
import { FaLeaf, FaHandsHelping, FaGlobeAmericas, FaHeart } from 'react-icons/fa';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About Share & Save</h1>
          <p className="text-xl text-orange-100 max-w-3xl mx-auto">
            Connecting communities to share resources, reduce waste, and help each other
          </p>
        </div>
      </div>

      {/* Our Mission */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <div className="w-24 h-1 bg-orange-500 mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-lg text-gray-600 mb-6">
              At Share & Save, we believe in the power of community to create sustainable change. 
              Our platform makes it easy for neighbors to share resources, reduce waste, and support 
              each other in meaningful ways.
            </p>
            <p className="text-lg text-gray-600 mb-6">
              Whether it's sharing unused items, offering discounted products, or helping someone 
              in need, every small act contributes to a larger movement of sustainability and 
              community support.
            </p>
            <Link 
              to="/signup" 
              className="inline-block px-6 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors duration-300"
            >
              Join Our Community
            </Link>
          </div>
          <div className="bg-gray-100 rounded-xl overflow-hidden shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="Community sharing" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <div className="w-24 h-1 bg-orange-500 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <FaLeaf className="text-4xl text-orange-500 mb-4" />,
                title: "Sustainability",
                description: "We promote reuse and recycling to reduce environmental impact"
              },
              {
                icon: <FaHandsHelping className="text-4xl text-orange-500 mb-4" />,
                title: "Community",
                description: "Building strong local connections is at our core"
              },
              {
                icon: <FaGlobeAmericas className="text-4xl text-orange-500 mb-4" />,
                title: "Accessibility",
                description: "Making resources available to everyone regardless of income"
              },
              {
                icon: <FaHeart className="text-4xl text-orange-500 mb-4" />,
                title: "Compassion",
                description: "Helping others is the foundation of everything we do"
              }
            ].map((value, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="text-center">
                  {value.icon}
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Story */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Story</h2>
          <div className="w-24 h-1 bg-orange-500 mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="bg-gray-100 rounded-xl overflow-hidden shadow-lg order-2 md:order-1">
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="Team working together" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="order-1 md:order-2">
            <p className="text-lg text-gray-600 mb-6">
              Share & Save was founded in 2023 by three passionate developers who saw an opportunity 
              to leverage technology for social good. After witnessing both waste and need in their 
              own communities, they envisioned a platform that could connect these two realities.
            </p>
            <p className="text-lg text-gray-600 mb-6">
              What started as a small university project quickly grew into a movement, with thousands 
              of users joining within the first year. Today, we're proud to support communities across 
              the country, helping people share resources and build meaningful connections.
            </p>
            <div className="mt-8">
              <Link 
                to="/team" 
                className="text-orange-500 hover:text-orange-600 font-medium transition-colors duration-300 inline-flex items-center"
              >
                Meet our team
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "10,000+", label: "Community Members" },
              { number: "25,000+", label: "Items Shared" },
              { number: "5,000+", label: "Meals Donated" },
              { number: "100+", label: "Communities Served" }
            ].map((stat, index) => (
              <div key={index} className="p-4">
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-orange-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to make a difference?</h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Join our growing community of people who believe in sharing and caring.
        </p>
        <div className="space-x-4">
          <Link 
            to="/signup" 
            className="inline-block px-6 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors duration-300"
          >
            Sign Up Now
          </Link>
          <Link 
            to="/contact" 
            className="inline-block px-6 py-3 border border-orange-500 text-orange-500 rounded-md hover:bg-orange-50 transition-colors duration-300"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;