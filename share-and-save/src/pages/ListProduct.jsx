import React from 'react';

const ListProduct = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">List a Free Item</h1>
      
      <div className="max-w-2xl mx-auto">
        <div className="card p-6">
          <form className="space-y-6">
            {/* Product Information */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Product Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Product Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary"
                    placeholder="Enter product name"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Category</label>
                  <select className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary">
                    <option value="">Select a category</option>
                    <option value="books">Books</option>
                    <option value="furniture">Furniture</option>
                    <option value="toys">Toys</option>
                    <option value="clothing">Clothing</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Condition</label>
                  <select className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary">
                    <option value="">Select condition</option>
                    <option value="new">New</option>
                    <option value="used">Used</option>
                    <option value="good">Good</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Description</label>
                  <textarea
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary"
                    rows="4"
                    placeholder="Describe your product..."
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Product Images */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Product Images</h2>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <div className="space-y-2">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary-dark"
                    >
                      <span>Upload images</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        multiple
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Location</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Address</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary"
                    placeholder="Enter your address"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary"
                      placeholder="Enter city"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">State</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary"
                      placeholder="Enter state"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg w-full transition">
              List Free Item
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ListProduct; 