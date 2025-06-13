import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FaLock, FaCreditCard, FaMoneyBillWave } from 'react-icons/fa';

const Payment = () => {
  const navigate = useNavigate();
  const { cartItems, total, clearCart } = useCart();
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
    bkashNumber: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Implement actual payment processing
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear cart after successful payment
      clearCart();
      
      // Show success message and redirect
      alert('Payment successful! Thank you for your purchase.');
      navigate('/home');
    } catch (error) {
      alert('Payment failed. Please try again.');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-6">Add some items to your cart before proceeding to payment.</p>
            <button
              onClick={() => navigate('/free-products')}
              className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Browse Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Payment</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Payment Form */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Payment Details</h2>
              
              {/* Payment Method Selection */}
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Payment Method</label>
                <div className="grid grid-cols-3 gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 rounded-lg border-2 flex flex-col items-center ${
                      paymentMethod === 'card' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
                    }`}
                  >
                    <FaCreditCard className="text-2xl mb-2" />
                    <span>Card</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bkash')}
                    className={`p-4 rounded-lg border-2 flex flex-col items-center ${
                      paymentMethod === 'bkash' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
                    }`}
                  >
                    
                    <span>bKash</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-4 rounded-lg border-2 flex flex-col items-center ${
                      paymentMethod === 'cod' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
                    }`}
                  >
                    <FaMoneyBillWave className="text-2xl mb-2" />
                    <span>Cash</span>
                  </button>
                </div>
              </div>

              {paymentMethod === 'card' && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Card Number</label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Cardholder Name</label>
                    <input
                      type="text"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      placeholder="Ehsan Haque"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-2">Expiry Date</label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">CVV</label>
                      <input
                        type="text"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        placeholder="123"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Delivery Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Sylhet, Bangladesh"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-2">City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="City"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Postal Code</label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        placeholder="12345"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+880 1XXX XXXXXX"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center"
                  >
                    <FaLock className="mr-2" />
                    Pay {total.toFixed(2)} taka
                  </button>
                </form>
              )}

              {paymentMethod === 'bkash' && (
                <div className="space-y-4">
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <p className="text-orange-800 mb-2">Send payment to this bKash number:</p>
                    <p className="text-xl font-bold text-orange-900">01XXXXXXXXX</p>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Your bKash Number</label>
                    <input
                      type="text"
                      name="bkashNumber"
                      value={formData.bkashNumber}
                      onChange={handleInputChange}
                      placeholder="01XXXXXXXXX"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Transaction ID</label>
                    <input
                      type="text"
                      name="transactionId"
                      value={formData.transactionId}
                      onChange={handleInputChange}
                      placeholder="8N7A6B5C4D"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Delivery Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Sylhet, Bangladesh"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+880 1XXX XXXXXX"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>
                  <button
                    onClick={handleSubmit}
                    className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center"
                  >
                    <FaLock className="mr-2" />
                    Pay {total.toFixed(2)} taka
                  </button>
                </div>
              )}

              {paymentMethod === 'cod' && (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">Pay with cash when your order arrives.</p>
                  <button
                    onClick={handleSubmit}
                    className="bg-green-500 text-white px-8 py-3 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Place Order
                  </button>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Order Summary</h2>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={`${item.type}_${item.id}`} className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          <span className="text-gray-400">No image</span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">{item.title}</h3>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-medium text-gray-800">
                      {(item.price * item.quantity).toFixed(2)} taka
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t mt-6 pt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-800">{total.toFixed(2)} taka</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-800">Free</span>
                </div>
                <div className="flex justify-between items-center font-bold text-lg mt-4 pt-4 border-t">
                  <span>Total</span>
                  <span className="text-orange-500">{total.toFixed(2)} taka</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment; 