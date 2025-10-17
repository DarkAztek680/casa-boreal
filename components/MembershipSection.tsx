import React, { useEffect } from 'react';
import { toast } from 'react-toastify';

const MembershipSection = () => {
  const membership = {
    plan: 'Premium',
    creditsLeft: 10,
    expirationDate: '2025-12-31',
    status: 'Activa',
  };

  const paymentHistory = [
    { date: '2025-01-01', plan: 'Premium', amount: '$50', method: 'Tarjeta', status: 'Completado' },
    { date: '2024-12-01', plan: 'Básico', amount: '$30', method: 'PayPal', status: 'Completado' },
  ];

  useEffect(() => {
    const fetchMembershipDetails = async () => {
      try {
        const response = await fetch('/api/user/membership');
        if (!response.ok) throw new Error('Error al cargar detalles de membresía');
        const data = await response.json();
        console.log(data); // Aquí puedes manejar los detalles de membresía
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error('Error desconocido');
        }
      }
    };
    fetchMembershipDetails();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Membresía</h2>
      <div className="mb-6">
        <div className="p-4 bg-gray-100 rounded-lg">
          <p className="text-sm font-medium">Plan: {membership.plan}</p>
          <p className="text-sm">Créditos restantes: {membership.creditsLeft}</p>
          <p className="text-sm">Fecha de vencimiento: {membership.expirationDate}</p>
          <p className="text-sm">Estado: {membership.status}</p>
        </div>
        <div className="flex gap-4 mt-4">
          <button className="bg-casaOlive text-white px-4 py-2 rounded-lg">
            Renovar Membresía
          </button>
          <button className="bg-casaOlive text-white px-4 py-2 rounded-lg">
            Cambiar Plan
          </button>
        </div>
      </div>
      <h3 className="text-lg font-semibold mb-4">Historial de Pagos</h3>
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="border-b p-2 text-left">Fecha</th>
            <th className="border-b p-2 text-left">Plan</th>
            <th className="border-b p-2 text-left">Monto</th>
            <th className="border-b p-2 text-left">Método</th>
            <th className="border-b p-2 text-left">Estado</th>
            <th className="border-b p-2 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {paymentHistory.map((payment, index) => (
            <tr key={index}>
              <td className="border-b p-2">{payment.date}</td>
              <td className="border-b p-2">{payment.plan}</td>
              <td className="border-b p-2">{payment.amount}</td>
              <td className="border-b p-2">{payment.method}</td>
              <td className="border-b p-2">{payment.status}</td>
              <td className="border-b p-2">
                <button className="text-blue-500 hover:underline">Descargar factura</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MembershipSection;