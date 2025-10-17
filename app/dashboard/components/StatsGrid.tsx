import { CreditCard, Calendar, Activity } from 'lucide-react';

export default function StatsGrid({ membership }: { membership: any }) {
  const daysUntilExpiry = membership
    ? Math.max(0, Math.ceil((new Date(membership.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-casaCoffee/10">
        <div className="flex items-center justify-between mb-3">
          <div className="w-12 h-12 bg-casaOlive/10 rounded-xl flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-casaOlive" />
          </div>
          <span className="text-casaCoffee/50">Créditos</span>
        </div>
        <h3 className="text-3xl font-bold text-casaCoffee">{membership?.creditsLeft ?? 0}</h3>
        <p className="text-casaCoffee/70">{membership?.isActive ? `Activa` : 'Inactiva'}</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-casaCoffee/10">
        <div className="flex items-center justify-between mb-3">
          <div className="w-12 h-12 bg-casaBeige/30 rounded-xl flex items-center justify-center">
            <Calendar className="w-6 h-6 text-casaCoffee" />
          </div>
          <span className="text-casaCoffee/50">Días restantes</span>
        </div>
        <h3 className="text-3xl font-bold text-casaCoffee">{daysUntilExpiry}</h3>
        <p className="text-casaCoffee/70">de tu membresía</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-casaCoffee/10">
        <div className="flex items-center justify-between mb-3">
          <div className="w-12 h-12 bg-casaOlive/10 rounded-xl flex items-center justify-center">
            <Activity className="w-6 h-6 text-casaOlive" />
          </div>
          <span className="text-casaCoffee/50">Estado</span>
        </div>
        <h3 className="text-3xl font-bold text-casaCoffee">
          {membership?.isActive ? 'Activa' : 'Inactiva'}
        </h3>
        <p className="text-casaCoffee/70">
          {membership?.isActive ? `Expira en ${daysUntilExpiry} días` : 'Renueva tu membresía'}
        </p>
      </div>
    </div>
  );
}
