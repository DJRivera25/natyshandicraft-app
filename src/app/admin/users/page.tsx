'use client';

import { useEffect, useState, useCallback } from 'react';
import AdminButton from '@/components/AdminButton';
import AdminModal from '@/components/AdminModal';
import AdminLoading from '@/components/AdminLoading';
import AdminError from '@/components/AdminError';
import StatusBadge from '@/components/StatusBadge';
import axios from 'axios';
import Pagination from '@/components/Pagination';
import { useDebounce } from '@/hooks/useDebounce';

interface User {
  id: string;
  fullName: string;
  email: string;
  isAdmin: boolean;
  status?: 'active' | 'banned';
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);
  const [role, setRole] = useState<'all' | 'admin' | 'user'>('all');
  const [status, setStatus] = useState<'all' | 'active' | 'banned'>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 20;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params: Record<string, string | number> = {
        page,
        limit,
      };
      if (debouncedSearch) params.search = debouncedSearch;
      if (role !== 'all') params.role = role;
      if (status !== 'all') params.status = status;
      const res = await axios.get('/api/admin/users', { params });
      setUsers(res.data.users);
      setTotalPages(Math.ceil(res.data.total / limit));
    } catch {
      setError('Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, role, status, page, limit]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // TODO: Implement ban/unban API and logic
  const handleBanUnban = async (user: User) => {
    // Placeholder for ban/unban logic
    alert(
      `Would ${user.status === 'banned' ? 'unban' : 'ban'} user: ${user.fullName}`
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-amber-900 mb-6">Users</h1>
      {/* Search/Filter Bar */}
      <div className="flex flex-wrap gap-2 items-center mb-4">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 border border-amber-200 rounded-lg text-sm focus:ring-amber-500 focus:border-amber-500 bg-white min-w-[180px]"
        />
        <select
          value={role}
          onChange={(e) => {
            setRole(e.target.value as 'all' | 'admin' | 'user');
            setPage(1);
          }}
          className="px-3 py-2 border border-amber-200 rounded-lg text-sm focus:ring-amber-500 focus:border-amber-500 bg-white"
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as 'all' | 'active' | 'banned');
            setPage(1);
          }}
          className="px-3 py-2 border border-amber-200 rounded-lg text-sm focus:ring-amber-500 focus:border-amber-500 bg-white"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="banned">Banned</option>
        </select>
      </div>
      {/* Stats Bar */}
      <div className="flex flex-wrap gap-4 items-center mb-2 text-sm text-gray-700 font-medium">
        <span>Users: {users.length}</span>
      </div>
      <div className="bg-white rounded-xl shadow p-6 border border-amber-200/60">
        {loading ? (
          <AdminLoading message="Loading users..." />
        ) : error ? (
          <AdminError error={error} />
        ) : users.length === 0 ? (
          <div className="text-center text-gray-500 py-12">No users found.</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-amber-50">
                    <th className="px-4 py-2 text-left font-semibold text-amber-800">
                      Name
                    </th>
                    <th className="px-4 py-2 text-left font-semibold text-amber-800">
                      Email
                    </th>
                    <th className="px-4 py-2 text-left font-semibold text-amber-800">
                      Role
                    </th>
                    <th className="px-4 py-2 text-left font-semibold text-amber-800">
                      Status
                    </th>
                    <th className="px-4 py-2 text-left font-semibold text-amber-800">
                      Joined
                    </th>
                    <th className="px-4 py-2 text-left font-semibold text-amber-800">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.id || user.email}
                      className="border-b last:border-0"
                    >
                      <td className="px-4 py-2 font-medium text-gray-900">
                        {user.fullName}
                      </td>
                      <td className="px-4 py-2">{user.email}</td>
                      <td className="px-4 py-2">
                        {user.isAdmin ? 'Admin' : 'User'}
                      </td>
                      <td className="px-4 py-2">
                        <StatusBadge
                          status={
                            user.status === 'banned' ? 'banned' : 'active'
                          }
                        />
                      </td>
                      <td className="px-4 py-2">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 flex gap-2 flex-wrap">
                        <AdminButton
                          variant="outline"
                          onClick={() => {
                            setSelectedUser(user);
                            setShowDetails(true);
                          }}
                        >
                          View
                        </AdminButton>
                        {user.isAdmin ? null : (
                          <AdminButton
                            variant={
                              user.status === 'banned' ? 'primary' : 'danger'
                            }
                            onClick={() => handleBanUnban(user)}
                          >
                            {user.status === 'banned' ? 'Unban' : 'Ban'}
                          </AdminButton>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
            <div className="flex justify-center items-center gap-2 mt-2 mb-1 text-xs text-gray-600 font-medium">
              Page {page} of {totalPages}
            </div>
          </>
        )}
      </div>
      {/* User Details Modal */}
      <AdminModal
        open={showDetails && !!selectedUser}
        title="User Details"
        onClose={() => setShowDetails(false)}
      >
        {selectedUser && (
          <div className="space-y-2 text-sm">
            <div>
              <strong>Name:</strong> {selectedUser.fullName}
            </div>
            <div>
              <strong>Email:</strong> {selectedUser.email}
            </div>
            <div>
              <strong>Role:</strong> {selectedUser.isAdmin ? 'Admin' : 'User'}
            </div>
            <div>
              <strong>Status:</strong>{' '}
              <StatusBadge
                status={selectedUser.status === 'banned' ? 'banned' : 'active'}
              />
            </div>
            <div>
              <strong>Joined:</strong>{' '}
              {new Date(selectedUser.createdAt).toLocaleDateString()}
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  );
}
