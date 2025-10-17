import { useState, useEffect } from 'react';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Tabs from '@/components/Tabs';
import ProfileSection from '@/components/ProfileSection';
import AccountSection from '@/components/AccountSection';
import NotificationsSection from '@/components/NotificationsSection';
import PrivacySection from '@/components/PrivacySection';
import MembershipSection from '@/components/MembershipSection';
import Header from '@/components/Header';
import PlaceholderSection from '@/components/PlaceholderSection';

const SettingsPage = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const router = useRouter();

  useEffect(() => {
    const checkMembership = async () => {
      try {
        const response = await fetch('/api/user/membership');
        const data = await response.json();

        console.log('Membership check response:', data); // Depuración

        // Verificar si la API devuelve explícitamente un destino de redirección
        if (data.redirect) {
          router.push(data.redirect);
        }
      } catch (error) {
        console.error('Error checking membership:', error);
      }
    };

    checkMembership();
  }, [router]);

  return (
    <div className="settings-page">
      <Header />
      <Sidebar />
      <main>
        <Tabs activeSection={activeSection} setActiveSection={setActiveSection} />
        {activeSection === 'profile' && <ProfileSection />}
        {activeSection === 'account' && <AccountSection />}
        {activeSection === 'notifications' && <NotificationsSection />}
        {activeSection === 'privacy' && <PrivacySection />}
        {activeSection === 'membership' && <MembershipSection />}
        {activeSection === 'placeholder' && <PlaceholderSection />}
      </main>
    </div>
  );
};

export default SettingsPage;