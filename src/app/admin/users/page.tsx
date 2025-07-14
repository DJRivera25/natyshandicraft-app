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
import { Users } from 'lucide-react';
import { updateUserRoles } from '@/utils/api/user';
import { useSession } from 'next-auth/react';

interface User {
  id: string;
  fullName: string;
  email: string;
  isAdmin: boolean;
  status?: 'active' | 'banned';
  createdAt: string;
  mobileNumber?: string;
  isChatSupport?: boolean;
  isSuperAdmin?: boolean;
}

interface SessionUser {
  id: string;
  email?: string;
  isAdmin?: boolean;
  isSuperAdmin?: boolean;
  [key: string]: unknown;
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
  const { data: session } = useSession();
  const isSuperAdmin = (session?.user as SessionUser)?.isSuperAdmin;

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
          <>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-amber-900">
                  User Details
                </h2>
                <p className="text-amber-700 text-xs sm:text-sm">
                  Account information and status
                </p>
              </div>
            </div>
            <div className="space-y-4 text-sm max-h-[60vh] overflow-y-auto p-2 sm:p-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-600" />
                <span className="font-semibold text-gray-900">
                  {selectedUser.fullName}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700">Email:</span>
                <span>{selectedUser.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700">
                  Mobile Number:
                </span>
                <span>{selectedUser.mobileNumber || '—'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700">Role:</span>
                <span>{selectedUser.isAdmin ? 'Admin' : 'User'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700">Status:</span>
                <StatusBadge
                  status={
                    selectedUser.status === 'banned' ? 'banned' : 'active'
                  }
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700">Joined:</span>
                <span>
                  {new Date(selectedUser.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            {isSuperAdmin && (
              <div className="space-y-2 mt-4 border-t pt-4">
                <h3 className="font-semibold text-amber-900 text-sm mb-2">
                  Role Management
                </h3>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={!!selectedUser.isAdmin}
                      onChange={async (e) => {
                        const updated = await updateUserRoles(selectedUser.id, {
                          isAdmin: e.target.checked,
                        });
                        setSelectedUser(
                          (u) => u && { ...u, isAdmin: updated.isAdmin }
                        );
                        fetchUsers();
                      }}
                    />
                    Admin
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={!!selectedUser.isChatSupport}
                      onChange={async (e) => {
                        const updated = await updateUserRoles(selectedUser.id, {
                          isChatSupport: e.target.checked,
                        });
                        setSelectedUser(
                          (u) =>
                            u && { ...u, isChatSupport: updated.isChatSupport }
                        );
                        fetchUsers();
                      }}
                    />
                    Chat Support
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={!!selectedUser.isSuperAdmin}
                      onChange={async (e) => {
                        const updated = await updateUserRoles(selectedUser.id, {
                          isSuperAdmin: e.target.checked,
                        });
                        setSelectedUser(
                          (u) =>
                            u && { ...u, isSuperAdmin: updated.isSuperAdmin }
                        );
                        fetchUsers();
                      }}
                    />
                    Super Admin
                  </label>
                </div>
              </div>
            )}
          </>
        )}
      </AdminModal>
    </div>
  );
}
