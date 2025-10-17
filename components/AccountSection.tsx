import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

const AccountSection = () => {
  const { register, handleSubmit, watch } = useForm();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await fetch('/api/user/sessions');
        if (!response.ok) throw new Error('Error al cargar sesiones activas');
        const data = await response.json();
        console.log(data); // Aquí puedes manejar las sesiones activas
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error('Error desconocido');
        }
      }
    };
    fetchSessions();
  }, []);

  const onSubmit = async (data: Record<string, any>) => {
    setSaving(true);
    try {
      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Error al actualizar la contraseña');
      toast.success('Contraseña actualizada exitosamente');
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Error desconocido');
      }
    } finally {
      setSaving(false);
    }
  };

  const validatePassword = (password: string) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const isLongEnough = password.length >= 8;
    return hasUpperCase && hasNumber && isLongEnough;
  };

  const newPassword = watch('newPassword');

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Cuenta</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Contraseña actual</label>
          <input
            type="password"
            {...register('currentPassword', { required: true })}
            className="w-full border rounded-lg p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Nueva contraseña</label>
          <input
            type="password"
            {...register('newPassword', {
              required: true,
              validate: validatePassword,
            })}
            className="w-full border rounded-lg p-2"
          />
          <p className="text-sm text-gray-500 mt-1">
            La contraseña debe tener al menos 8 caracteres, una mayúscula y un número.
          </p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Confirmar nueva contraseña</label>
          <input
            type="password"
            {...register('confirmPassword', {
              required: true,
              validate: (value: string) => value === newPassword || 'Las contraseñas no coinciden',
            })}
            className="w-full border rounded-lg p-2"
          />
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-casaOlive text-white px-4 py-2 rounded-lg"
            disabled={saving}
          >
            {saving ? 'Guardando...' : 'Actualizar Contraseña'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AccountSection;