import React, { useEffect, useState } from 'react';
import { ClipboardList } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface Complaint {
  id: string;
  name: string;
  phone: string;
  address: string;
  district: string;
  service_category: string;
  status: string;
  created_at: string;
  description: string;
  admin_response?: string;
  user_email: string;
}

function AdminPanel() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ district: '', status: '', category: '' });
  const [adminResponse, setAdminResponse] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchComplaints();
    subscribeToComplaints();
  }, []);

  const subscribeToComplaints = () => {
    const subscription = supabase
      .channel('complaints_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'complaints'
        },
        () => {
          fetchComplaints();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const fetchComplaints = async () => {
    try {
      const { data, error } = await supabase
        .from('complaints')
        .select('id, name, phone, address, district, service_category, status, created_at, description, admin_response, user_email')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComplaints(data || []);
    } catch (error) {
      console.error('Error fetching complaints:', error);
      toast.error('Failed to fetch complaints');
    } finally {
      setLoading(false);
    }
  };

  const updateComplaintStatus = async (id: string, status: string) => {
    if (updating) return;
    
    try {
      setUpdating(true);
      const { error: updateError } = await supabase
        .from('complaints')
        .update({ 
          status,
          admin_response: adminResponse || undefined
        })
        .eq('id', id);

      if (updateError) throw updateError;

      toast.success('Status updated successfully');
      setAdminResponse('');
      setSelectedComplaint(null);
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast.error(error.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const filteredComplaints = complaints.filter(complaint => {
    return (
      (!filter.district || complaint.district === filter.district) &&
      (!filter.status || complaint.status === filter.status) &&
      (!filter.category || complaint.service_category === filter.category)
    );
  });

  const districts = [...new Set(complaints.map(c => c.district))].sort();
  const categories = [...new Set(complaints.map(c => c.service_category))].sort();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <ClipboardList className="mx-auto h-12 w-12 text-blue-600" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Kerala Public Grievance Portal</h2>
          <p className="mt-2 text-gray-600">Admin Dashboard</p>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <select
            value={filter.district}
            onChange={(e) => setFilter({ ...filter, district: e.target.value })}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">All Districts</option>
            {districts.map((district) => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>

          <select
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            value={filter.category}
            onChange={(e) => setFilter({ ...filter, category: e.target.value })}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredComplaints.map((complaint) => (
              <li key={complaint.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-blue-600">{complaint.name}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(complaint.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">Phone:</span> {complaint.phone}
                      </p>
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">District:</span> {complaint.district}
                      </p>
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">Category:</span> {complaint.service_category}
                      </p>
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">Email:</span> {complaint.user_email}
                      </p>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">Description:</span> {complaint.description}
                      </p>
                    </div>
                    
                    {selectedComplaint === complaint.id && (
                      <div className="mt-4">
                        <textarea
                          value={adminResponse}
                          onChange={(e) => setAdminResponse(e.target.value)}
                          placeholder="Enter your response..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          rows={3}
                        />
                      </div>
                    )}
                  </div>
                  <div className="ml-6">
                    <button
                      onClick={() => setSelectedComplaint(complaint.id)}
                      className="mb-2 text-sm text-blue-600 hover:text-blue-800"
                    >
                      Add Response
                    </button>
                    <select
                      value={complaint.status}
                      onChange={(e) => updateComplaintStatus(complaint.id, e.target.value)}
                      disabled={updating}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;