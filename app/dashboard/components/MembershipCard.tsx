export default function MembershipCard({ membership }: { membership: any }) {
  if (!membership) return null;

  return (
    <div className="bg-gradient-to-r from-casaBeige/70 to-casaCream border border-casaCoffee/10 rounded-2xl p-8 text-casaCoffee shadow-md">
      <h2 className="text-xl font-heading mb-2">Tu membresía</h2>
      <p className="text-casaCoffee/80 mb-1">
        Tipo: <span className="font-semibold">{membership.type}</span>
      </p>
      <p className="text-casaCoffee/80">
        Créditos disponibles: <span className="font-semibold">{membership.creditsLeft}</span>
      </p>
    </div>
  );
}
