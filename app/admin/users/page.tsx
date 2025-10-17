'use client';

import { useState, useEffect } from 'react';
import { UsersIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

interface User {
  id: string;
  email: string;
  isAdmin: boolean;
  createdAt?: string;
}

export default function UsersAdminPage() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetch('/api/admin/users')
      .then(res => res.json())
      .then(setUsers);
  }, []);

  const handlePromote = async (id: string) => {
    await fetch(`/api/admin/users/${id}/promote`, { method: 'POST' });
    refreshUsers();
  };

  const handleDemote = async (id: string) => {
    await fetch(`/api/admin/users/${id}/demote`, { method: 'POST' });
    refreshUsers();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Seguro que quieres eliminar este usuario?')) {
      await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
      refreshUsers();
    }
  };

  const refreshUsers = async () => {
    const res = await fetch('/api/admin/users');
    setUsers(await res.json());
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center mb-4 space-x-2">
        <UsersIcon className="h-6 w-6 text-blue-500" />
        <h1 className="text-2xl font-bold">Administrar Usuarios</h1>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">Admin</th>
              <th className="py-2 px-4 border-b">Creado</th>
              <th className="py-2 px-4 border-b">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-50 transition">
                <td className="py-2 px-4">{user.email}</td>
                <td className="py-2 px-4">
                  {user.isAdmin ? (
                    <span className="inline-flex items-center px-2 py-1 text-xs font-bold bg-green-100 text-green-700 rounded">
                      <ShieldCheckIcon className="h-4 w-4 mr-1" /> Admin
                    </span>
                  ) : (
                    <span className="inline-block px-2 py-1 text-xs font-bold bg-gray-200 text-gray-700 rounded">Usuario</span>
                  )}
                </td>
                <td className="py-2 px-4">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}</td>
                <td className="py-2 px-4 space-x-2">
                  {!user.isAdmin && (
                    <button className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition" onClick={() => handlePromote(user.id)}>Promover</button>
                  )}
                  {user.isAdmin && (
                    <button className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 transition" onClick={() => handleDemote(user.id)}>Quitar Admin</button>
                  )}
                  <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition" onClick={() => handleDelete(user.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
