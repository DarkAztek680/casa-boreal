import React from 'react';

const Tabs = ({ activeSection, setActiveSection }: { activeSection: string; setActiveSection: (section: string) => void }) => {
  const sections = ['profile', 'account', 'notifications', 'privacy', 'membership'];

  return (
    <div className="flex bg-gray-100 p-2">
      {sections.map(section => (
        <button
          key={section}
          className={`flex-1 p-2 ${activeSection === section ? 'bg-casaOlive text-white' : 'text-gray-700'}`}
          onClick={() => setActiveSection(section)}
        >
          {section.charAt(0).toUpperCase() + section.slice(1)}
        </button>
      ))}
    </div>
  );
};

export default Tabs;