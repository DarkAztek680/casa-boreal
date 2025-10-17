import React from 'react';

const Sidebar = ({ activeSection, setActiveSection }: { activeSection: string; setActiveSection: (section: string) => void }) => {
  const sections = ['profile', 'account', 'notifications', 'privacy', 'membership'];

  return (
    <div className="w-64 bg-gray-100 p-4">
      <ul>
        {sections.map(section => (
          <li
            key={section}
            className={`p-2 cursor-pointer rounded-lg transition-colors ${activeSection === section ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setActiveSection(section)}
          >
            {section.charAt(0).toUpperCase() + section.slice(1)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;