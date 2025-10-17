import { getSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { UsersIcon, CreditCardIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

interface User {
  id: string;
  email: string;
  isAdmin: boolean;
  createdAt?: string;
}

interface Membership {
  id: string;
  planId: string;
  isActive: boolean;
  creditsLeft?: number;
  endDate?: string;
  userEmail?: string;
  plan?: {
    id: string;
    name: string;
    description: string;
    price: number;
    credits: number;
  };
}

export default function AdminPanel() {
  const [activeSection, setActiveSection] = useState<'users' | 'memberships' | 'plans' | 'calendar'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  // User actions
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  // Membership actions
  const [membershipEditId, setMembershipEditId] = useState<string | null>(null);
  const [editCredits, setEditCredits] = useState<number>(0);
  const [editActive, setEditActive] = useState<boolean>(false);
  const [editFeedback, setEditFeedback] = useState<string>('');
  const [showCreateMembership, setShowCreateMembership] = useState(false);
  const [newMembership, setNewMembership] = useState({
    userEmail: '',
  planId: '',
    creditsLeft: 0,
    endDate: '',
    isActive: true,
  });
  const [createFeedback, setCreateFeedback] = useState('');
  // Plan actions
  const [showCreatePlan, setShowCreatePlan] = useState(false);
  const [editPlanId, setEditPlanId] = useState<string | null>(null);
  const [planForm, setPlanForm] = useState({ name: '', description: '', price: 0, credits: 0 });
  const [planFeedback, setPlanFeedback] = useState('');

  const router = useRouter();

  useEffect(() => {
    async function checkAdmin() {
      const session = await getSession();
      if (session?.user?.isAdmin) { // Use isAdmin from the updated NextAuth types
        fetchData();
      } else {
        router.push('/');
      }
    }

    async function fetchData() {
      const usersResponse = await fetch('/api/admin/users');
      const membershipsResponse = await fetch('/api/admin/memberships');
      const plansResponse = await fetch('/api/admin/plans');

      if (usersResponse.ok && membershipsResponse.ok && plansResponse.ok) {
        setUsers(await usersResponse.json());
        setMemberships(await membershipsResponse.json());
        setPlans(await plansResponse.json());
      }
    }

    checkAdmin();
  }, [router]);

  // User management actions
  const handlePromote = async (id: string) => {
    await fetch(`/api/admin/users/${id}/promote`, { method: 'POST' });
    refreshUsers();
  };
  const handleDemote = async (id: string) => {
    await fetch(`/api/admin/users/${id}/demote`, { method: 'POST' });
    refreshUsers();
  };
  const handleDelete = async (id: string) => {
    setDeleteUserId(id);
  };
  const confirmDelete = async () => {
    if (deleteUserId) {
      await fetch(`/api/admin/users/${deleteUserId}`, { method: 'DELETE' });
      setDeleteUserId(null);
      refreshUsers();
    }
  };
  const cancelDelete = () => setDeleteUserId(null);
  const refreshUsers = async () => {
    const res = await fetch('/api/admin/users');
    setUsers(await res.json());
  };

  // Membership management actions
  const handleCreateMembership = async () => {
    const res = await fetch('/api/admin/memberships', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMembership),
    });
    if (res.ok) {
      setCreateFeedback('¡Membresía creada!');
      setTimeout(() => setCreateFeedback(''), 2000);
      setShowCreateMembership(false);
      setNewMembership({ userEmail: '', planId: '', creditsLeft: 0, endDate: '', isActive: true });
      const res2 = await fetch('/api/admin/memberships');
      setMemberships(await res2.json());
    } else {
      setCreateFeedback('Error al crear membresía');
    }
  };
  const refreshMemberships = async () => {
    const res = await fetch('/api/admin/memberships');
    setMemberships(await res.json());
  };

  // Plan management actions
  const handleCreatePlan = async () => {
    const res = await fetch('/api/admin/plans', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(planForm),
    });
    if (res.ok) {
      setPlanFeedback('¡Plan creado!');
      setTimeout(() => setPlanFeedback(''), 2000);
      setShowCreatePlan(false);
      setPlanForm({ name: '', description: '', price: 0, credits: 0 });
      const res2 = await fetch('/api/admin/plans');
      setPlans(await res2.json());
    } else {
      setPlanFeedback('Error al crear plan');
    }
  };

  const handleEditPlan = (plan: any) => {
    setEditPlanId(plan.id);
    setPlanForm({ name: plan.name, description: plan.description, price: plan.price, credits: plan.credits });
  };

  const saveEditPlan = async () => {
    if (editPlanId) {
      const res = await fetch(`/api/admin/plans/${editPlanId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(planForm),
      });
      if (res.ok) {
        setPlanFeedback('¡Plan actualizado!');
        setTimeout(() => setPlanFeedback(''), 2000);
        setEditPlanId(null);
        const res2 = await fetch('/api/admin/plans');
        setPlans(await res2.json());
      } else {
        setPlanFeedback('Error al actualizar plan');
      }
    }
  };

  const handleDeletePlan = async (id: string) => {
    if (window.confirm('¿Seguro que quieres eliminar este plan?')) {
      await fetch(`/api/admin/plans/${id}`, { method: 'DELETE' });
      const res2 = await fetch('/api/admin/plans');
      setPlans(await res2.json());
    }
  };

  if (!users.length && !memberships.length && !plans.length) {
    return <p>Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r shadow-lg p-6 space-y-8">
        <div className="flex items-center space-x-2 mb-8">
          <ShieldCheckIcon className="h-8 w-8 text-blue-600" />
          <span className="text-2xl font-bold text-blue-600">Admin</span>
        </div>
        <nav className="space-y-4">
          <button onClick={() => setActiveSection('users')} className={`flex items-center space-x-2 text-gray-700 hover:text-blue-600 w-full text-left ${activeSection === 'users' ? 'font-bold text-blue-600' : ''}`}>
            <UsersIcon className="h-5 w-5" />
            <span>Usuarios</span>
          </button>
          <button onClick={() => setActiveSection('memberships')} className={`flex items-center space-x-2 text-gray-700 hover:text-blue-600 w-full text-left ${activeSection === 'memberships' ? 'font-bold text-blue-600' : ''}`}>
            <CreditCardIcon className="h-5 w-5" />
            <span>Membresías</span>
          </button>
          <button onClick={() => setActiveSection('plans')} className={`flex items-center space-x-2 text-gray-700 hover:text-blue-600 w-full text-left ${activeSection === 'plans' ? 'font-bold text-blue-600' : ''}`}>
            <CreditCardIcon className="h-5 w-5" />
            <span>Planes</span>
          </button>
          <button onClick={() => setActiveSection('calendar')} className={`flex items-center space-x-2 text-gray-700 hover:text-blue-600 w-full text-left ${activeSection === 'calendar' ? 'font-bold text-blue-600' : ''}`}>
            <span>Calendario</span>
          </button>
        </nav>
      </aside>
      {/* Main content */}
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-8 text-center">Panel de Administración</h1>
        {activeSection === 'calendar' && (
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Gestión de Calendario y Clases</h2>
            {/* Render the calendar manager page in an iframe for now */}
            <iframe src="/admin/calendar" style={{ width: '100%', height: '600px', border: 'none' }} title="Calendar Management" />
          </section>
        )}
        {activeSection === 'users' && (
          <section className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4 space-x-2">
              <UsersIcon className="h-6 w-6 text-blue-500" />
              <h2 className="text-xl font-semibold">Usuarios</h2>
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
            {/* Modal for delete confirmation */}
            {deleteUserId && (
              <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
                  <h3 className="text-lg font-bold mb-4">¿Seguro que quieres eliminar este usuario?</h3>
                  <div className="flex justify-end space-x-2">
                    <button className="bg-gray-300 px-4 py-2 rounded" onClick={cancelDelete}>Cancelar</button>
                    <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={confirmDelete}>Eliminar</button>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}
        {activeSection === 'memberships' && (
          <section className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4 space-x-2">
              <CreditCardIcon className="h-6 w-6 text-blue-500" />
              <h2 className="text-xl font-semibold">Membresías</h2>
            </div>
            <button className="mb-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition" onClick={() => setShowCreateMembership(true)}>
              Crear Membresía
            </button>
            {/* Create Membership Modal */}
            {showCreateMembership && (
              <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
                  <h3 className="text-lg font-bold mb-4">Crear Membresía</h3>
                  <div className="mb-2">
                    <label className="block mb-1">Email del usuario</label>
                    <input type="email" className="border rounded px-2 py-1 w-full" value={newMembership.userEmail} onChange={e => setNewMembership({ ...newMembership, userEmail: e.target.value })} />
                  </div>
                  <div className="mb-2">
                    <label className="block mb-1">Plan</label>
                    <select className="border rounded px-2 py-1 w-full" value={newMembership.planId} onChange={e => setNewMembership({ ...newMembership, planId: e.target.value })}>
                      <option value="">Selecciona un plan</option>
                      {plans.map(plan => (
                        <option key={plan.id} value={plan.id}>{plan.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-2">
                    <label className="block mb-1">Créditos</label>
                    <input type="number" className="border rounded px-2 py-1 w-full" value={newMembership.creditsLeft} onChange={e => setNewMembership({ ...newMembership, creditsLeft: Number(e.target.value) })} />
                  </div>
                  <div className="mb-2">
                    <label className="block mb-1">Fecha de fin</label>
                    <input type="date" className="border rounded px-2 py-1 w-full" value={newMembership.endDate} onChange={e => setNewMembership({ ...newMembership, endDate: e.target.value })} />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1">Activa</label>
                    <input type="checkbox" checked={newMembership.isActive} onChange={e => setNewMembership({ ...newMembership, isActive: e.target.checked })} />
                  </div>
                  {createFeedback && <div className="mb-2 text-green-600">{createFeedback}</div>}
                  <div className="flex justify-end space-x-2">
                    <button className="bg-gray-300 px-4 py-2 rounded" onClick={() => setShowCreateMembership(false)}>Cancelar</button>
                    <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleCreateMembership}>Crear</button>
                  </div>
                </div>
              </div>
            )}
            <ul className="space-y-2">
              {memberships.map((membership) => (
                <li key={membership.id} className="border rounded p-2 flex flex-col md:flex-row justify-between items-center">
                  <div className="flex-1">
                    <div><span className="font-bold">Plan:</span> {membership.plan?.name ?? '-'}</div>
                    <div><span className="font-bold">Email:</span> {membership.userEmail}</div>
                    <div><span className="font-bold">Créditos:</span> {membership.creditsLeft ?? '-'}</div>
                    <div><span className="font-bold">Fin:</span> {membership.endDate ? new Date(membership.endDate).toLocaleDateString() : '-'}</div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={membership.isActive ? "px-2 py-1 text-xs font-bold bg-green-100 text-green-700 rounded" : "px-2 py-1 text-xs font-bold bg-gray-200 text-gray-700 rounded"}>
                      {membership.isActive ? 'Activa' : 'Inactiva'}
                    </span>
                    <button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition" onClick={() => {
                      setMembershipEditId(membership.id);
                      setEditCredits(membership.creditsLeft ?? 0);
                      setEditActive(membership.isActive);
                    }}>Editar</button>
                  </div>
                </li>
              ))}
            </ul>
            {/* Membership edit modal */}
            {membershipEditId && (
              <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
                  <h3 className="text-lg font-bold mb-4">Editar Membresía</h3>
                  <div className="mb-2">
                    <label className="block mb-1">Plan</label>
                    <select className="border rounded px-2 py-1 w-full" value={(() => {
                      const membership = memberships.find(m => m.id === membershipEditId);
                      return membership?.planId || '';
                    })()} onChange={e => {
                      const membership = memberships.find(m => m.id === membershipEditId);
                      if (membership) membership.planId = e.target.value;
                      // For controlled input, you may want to use a state for editPlanId, but for simplicity we update directly
                    }}>
                      <option value="">Selecciona un plan</option>
                      {plans.map(plan => (
                        <option key={plan.id} value={plan.id}>{plan.name}</option>
                      ))}
                    </select>
                  </div>
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
                    <button className="bg-gray-300 px-4 py-2 rounded" onClick={() => setMembershipEditId(null)}>Cancelar</button>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={async () => {
                      if (membershipEditId) {
                        const membership = memberships.find(m => m.id === membershipEditId);
                        const res = await fetch(`/api/admin/memberships/${membershipEditId}`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ creditsLeft: editCredits, isActive: editActive, planId: membership?.planId }),
                        });
                        if (res.ok) {
                          setEditFeedback('¡Membresía actualizada!');
                          setTimeout(() => setEditFeedback(''), 2000);
                          setMembershipEditId(null);
                          refreshMemberships();
                        } else {
                          setEditFeedback('Error al actualizar membresía');
                        }
                      }
                    }}>Guardar</button>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}
        {activeSection === 'plans' && (
          <section className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4 space-x-2">
              <CreditCardIcon className="h-6 w-6 text-blue-500" />
              <h2 className="text-xl font-semibold">Planes</h2>
            </div>
            <button className="mb-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition" onClick={() => setShowCreatePlan(true)}>
              Crear Plan
            </button>
            {/* Create Plan Modal */}
            {showCreatePlan && (
              <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
                  <h3 className="text-lg font-bold mb-4">Crear Plan</h3>
                  <div className="mb-2">
                    <label className="block mb-1">Nombre</label>
                    <input type="text" className="border rounded px-2 py-1 w-full" value={planForm.name} onChange={e => setPlanForm({ ...planForm, name: e.target.value })} />
                  </div>
                  <div className="mb-2">
                    <label className="block mb-1">Descripción</label>
                    <input type="text" className="border rounded px-2 py-1 w-full" value={planForm.description} onChange={e => setPlanForm({ ...planForm, description: e.target.value })} />
                  </div>
                  <div className="mb-2">
                    <label className="block mb-1">Precio</label>
                    <input type="number" className="border rounded px-2 py-1 w-full" value={planForm.price} onChange={e => setPlanForm({ ...planForm, price: Number(e.target.value) })} />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1">Créditos</label>
                    <input type="number" className="border rounded px-2 py-1 w-full" value={planForm.credits} onChange={e => setPlanForm({ ...planForm, credits: Number(e.target.value) })} />
                  </div>
                  {planFeedback && <div className="mb-2 text-green-600">{planFeedback}</div>}
                  <div className="flex justify-end space-x-2">
                    <button className="bg-gray-300 px-4 py-2 rounded" onClick={() => setShowCreatePlan(false)}>Cancelar</button>
                    <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleCreatePlan}>Crear</button>
                  </div>
                </div>
              </div>
            )}
            {/* Edit Plan Modal */}
            {editPlanId && (
              <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
                  <h3 className="text-lg font-bold mb-4">Editar Plan</h3>
                  <div className="mb-2">
                    <label className="block mb-1">Nombre</label>
                    <input type="text" className="border rounded px-2 py-1 w-full" value={planForm.name} onChange={e => setPlanForm({ ...planForm, name: e.target.value })} />
                  </div>
                  <div className="mb-2">
                    <label className="block mb-1">Descripción</label>
                    <input type="text" className="border rounded px-2 py-1 w-full" value={planForm.description} onChange={e => setPlanForm({ ...planForm, description: e.target.value })} />
                  </div>
                  <div className="mb-2">
                    <label className="block mb-1">Precio</label>
                    <input type="number" className="border rounded px-2 py-1 w-full" value={planForm.price} onChange={e => setPlanForm({ ...planForm, price: Number(e.target.value) })} />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1">Créditos</label>
                    <input type="number" className="border rounded px-2 py-1 w-full" value={planForm.credits} onChange={e => setPlanForm({ ...planForm, credits: Number(e.target.value) })} />
                  </div>
                  {planFeedback && <div className="mb-2 text-green-600">{planFeedback}</div>}
                  <div className="flex justify-end space-x-2">
                    <button className="bg-gray-300 px-4 py-2 rounded" onClick={() => setEditPlanId(null)}>Cancelar</button>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={saveEditPlan}>Guardar</button>
                  </div>
                </div>
              </div>
            )}
            <ul className="space-y-2">
              {plans.map((plan) => (
                <li key={plan.id} className="border rounded p-2 flex flex-col md:flex-row justify-between items-center">
                  <div className="flex-1">
                    <div><span className="font-bold">Nombre:</span> {plan.name}</div>
                    <div><span className="font-bold">Descripción:</span> {plan.description}</div>
                    <div><span className="font-bold">Precio:</span> ${plan.price}</div>
                    <div><span className="font-bold">Créditos:</span> {plan.credits}</div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition" onClick={() => handleEditPlan(plan)}>Editar</button>
                    <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition" onClick={() => handleDeletePlan(plan.id)}>Eliminar</button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}