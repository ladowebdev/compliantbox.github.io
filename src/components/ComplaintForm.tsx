import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const districts = [
  'Thiruvananthapuram',
  'Kollam',
  'Pathanamthitta',
  'Alappuzha',
  'Kottayam',
  'Idukki',
  'Ernakulam',
  'Thrissur',
  'Palakkad',
  'Malappuram',
  'Kozhikode',
  'Wayanad',
  'Kannur',
  'Kasaragod'
];

const serviceCategories = [
  'Water Supply (Kerala Water Authority)',
  'Electricity (KSEB)',
  'Road Maintenance (PWD)',
  'Waste Management',
  'Public Transport (KSRTC)',
  'Healthcare (Kerala Health Services)',
  'Education',
  'Agriculture',
  'Social Welfare',
  'Revenue Department',
  'Civil Supplies',
  'Police',
  'Local Self Government'
];

function ComplaintForm() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    district: '',
    service_category: '',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('complaints').insert({
        ...formData,
        user_id: user?.id || '00000000-0000-0000-0000-000000000000',
        user_email: user?.email || '',
        status: 'pending'
      });

      if (error) throw error;

      toast.success('പരാതി വിജയകരമായി സമർപ്പിച്ചു! (Complaint submitted successfully!)');
      setFormData({
        name: '',
        phone: '',
        address: '',
        district: '',
        service_category: '',
        description: ''
      });
    } catch (error: any) {
      toast.error('പരാതി സമർപ്പിക്കുന്നതിൽ പരാജയപ്പെട്ടു (Failed to submit complaint)');
      console.error('Error:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="absolute top-4 right-4 flex gap-4">
        <Link 
          to="/login"
          className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800"
        >
          {user ? 'My Dashboard' : 'Login / Sign Up'}
        </Link>
        <Link 
          to="/admin/login"
          className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800"
        >
          Admin Login
        </Link>
      </div>
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="text-center">
            <FileText className="mx-auto h-12 w-12 text-blue-600" />
            <h2 className="mt-6 text-3xl font-bold text-gray-900">പരാതി സമർപ്പിക്കുക</h2>
            <p className="mt-2 text-sm text-gray-600">
              Submit a Complaint
            </p>
          </div>
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  പേര് / Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="നിങ്ങളുടെ പേര് / Your name"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  ഫോൺ നമ്പർ / Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="ഫോൺ നമ്പർ / Phone number"
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  വിലാസം / Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="വിശദമായ വിലാസം / Full address"
                />
              </div>

              <div>
                <label htmlFor="district" className="block text-sm font-medium text-gray-700">
                  ജില്ല / District
                </label>
                <select
                  id="district"
                  name="district"
                  required
                  value={formData.district}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">ജില്ല തിരഞ്ഞെടുക്കുക / Select District</option>
                  {districts.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="service_category" className="block text-sm font-medium text-gray-700">
                  സേവന വിഭാഗം / Service Category
                </label>
                <select
                  id="service_category"
                  name="service_category"
                  required
                  value={formData.service_category}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">വിഭാഗം തിരഞ്ഞെടുക്കുക / Select Category</option>
                  {serviceCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  പരാതിയുടെ വിവരണം / Complaint Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="പരാതിയുടെ വിശദമായ വിവരണം / Detailed description of your complaint"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                പരാതി സമർപ്പിക്കുക (Submit Complaint)
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ComplaintForm;