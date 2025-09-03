import Section from '../components/Section';
import { useAuth } from '../contexts/AuthContext';
import { useMenu } from '../contexts/MenuContext';

export default function LayoutClient({ className, children }) {
  const { user, changeUserAccessRole, mainRolesAllowedSwitchRoles } = useAuth();
  const { isOpen } = useMenu();

  // Perfis possíveis
  const profiles = [
    { value: 'municipal', label: 'Municipal' },
    // { value: 'cidadao', label: 'Cidadão' },
  ];

  const handleChangeRole = (e) => {
    const newRole = e.target.value;
    changeUserAccessRole(newRole);
  };

  return (
    <Section className={`layout ${!isOpen && "layout-menu-collapse"} ${className}`}>
      <Section className="header-second">
        <Section className="flex justify-end p-4 bg-white shadow-md items-center z-20 relative">
          <span className="text-sm font-medium text-gray-700">Perfil:</span>
          <select
            className={`rounded-md border-gray-200 bg-gray-100 text-gray-700 shadow-sm focus:ring-0 focus:outline-none sm:text-sm ml-2 min-w-150
              ${(user && mainRolesAllowedSwitchRoles.includes(user.main_role)) ? 'cursor-pointer' : 'cursor-not-allowed'}
            `}
            value={user?.role || ''}
            disabled={!(user && mainRolesAllowedSwitchRoles.includes(user.main_role))}
            onChange={handleChangeRole}
          >
            {profiles.map((profile) => (
              <option key={profile.value} value={profile.value}>
                {profile.label}
              </option>
            ))}
          </select>
        </Section>
      </Section>
      {children}
    </Section>
  );
}
