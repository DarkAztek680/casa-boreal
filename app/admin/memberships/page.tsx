'use client';

import { useState, useEffect } from 'react';
import { CreditCardIcon } from '@heroicons/react/24/outline';

interface Membership {
  id: string;
  planType: string;
  isActive: boolean;
  creditsLeft?: number;
  endDate?: string;
  userEmail?: string;
}

export default function MembershipsAdminPage() {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [editCredits, setEditCredits] = useState<number>(0);
  const [editActive, setEditActive] = useState<boolean>(false);
  const [editFeedback, setEditFeedback] = useState<string>('');

  useEffect(() => {
    fetch('/api/admin/memberships')
      .then(res => res.json())
      .then(setMemberships);
  }, []);

  const handleEdit = (membership: Membership) => {
    setEditId(membership.id);
    setEditCredits(membership.creditsLeft ?? 0);
    setEditActive(membership.isActive);
  };

  const saveEdit = async () => {
    if (editId) {
      const res = await fetch(`/api/admin/memberships/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ creditsLeft: editCredits, isActive: editActive }),
      });
      if (res.ok) {
        setEditFeedback('¡Membresía actualizada!');
        setTimeout(() => setEditFeedback(''), 2000);
        setEditId(null);
        refreshMemberships();
      } else {
        setEditFeedback('Error al actualizar membresía');
      }
    }
  };

  const refreshMemberships = async () => {
    const res = await fetch('/api/admin/memberships');
    setMemberships(await res.json());
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center mb-4 space-x-2">
        <CreditCardIcon className="h-6 w-6 text-blue-500" />
        <h1 className="text-2xl font-bold">Administrar Membresías</h1>
      </div>
      <ul className="space-y-2">
        {memberships.map((membership) => (
          <li key={membership.id} className="border rounded p-2 flex flex-col md:flex-row justify-between items-center">
            <div className="flex-1">
              <div><span className="font-bold">Plan:</span> {membership.planType}</div>
              <div><span className="font-bold">Email:</span> {membership.userEmail}</div>
              <div><span className="font-bold">Créditos:</span> {membership.creditsLeft ?? '-'}</div>
              <div><span className="font-bold">Fin:</span> {membership.endDate ? new Date(membership.endDate).toLocaleDateString() : '-'}</div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className={membership.isActive ? "px-2 py-1 text-xs font-bold bg-green-100 text-green-700 rounded" : "px-2 py-1 text-xs font-bold bg-gray-200 text-gray-700 rounded"}>
                {membership.isActive ? 'Activa' : 'Inactiva'}
              </span>
              <button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition" onClick={() => handleEdit(membership)}>Editar</button>
            </div>
          </li>
        ))}
      </ul>
      {/* Membership edit modal */}
      {editId && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold mb-4">Editar Membresía</h3>
            <div className="mb-2">
              <label className="block mb-1">Créditos</label>
              <input type="number" className="border rounded px-2 py-1 w-full" value={editCredits} onChange={e => setEditCredits(Number(e.target.value))} />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Activa</label>
              <input type="checkbox" checked={editActive} onChange={e => setEditActive(e.target.checked)} />
            </div>
            {editFeedback && <div className="mb-2 text-green-600">{editFeedback}</div>}
            <div className="flex justify-end space-x-2">
              <button className="bg-gray-300 px-4 py-2 rounded" onClick={() => setEditId(null)}>Cancelar</button>
              <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={saveEdit}>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
