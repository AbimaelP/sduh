import { useAuth } from '../contexts/AuthContext';
import { useMenu } from '../contexts/MenuContext';

export default function LayoutClient({ className, children }) {
  const { user, changeUserAccessRole } = useAuth();
  const { isOpen } = useMenu();

  // Perfis possíveis
  const profiles = [
    { value: 'municipal', label: 'Municipal' },
    { value: 'cidadao', label: 'Cidadão' },
  ];

  const handleChangeRole = (e) => {
    const newRole = e.target.value;
    changeUserAccessRole(newRole);
  };

  return (
    <div className={`layout ${!isOpen && "layout-menu-collapse"} ${className}`}>
      <div className="header-second">
        <div className="flex justify-end p-4 bg-white shadow-md items-center z-20 relative">
          <span className="text-sm font-medium text-gray-700">Perfil:</span>
          <select
            className={`rounded-md border-gray-200 bg-gray-100 text-gray-700 shadow-sm focus:ring-0 focus:outline-none sm:text-sm ml-2 
              ${user?.main_role === 'admin' ? 'cursor-pointer' : 'cursor-not-allowed'}
            `}
            value={user?.role || ''}
            disabled={user?.main_role !== 'admin'}
            onChange={handleChangeRole}
          >
            {profiles.map((profile) => (
              <option key={profile.value} value={profile.value}>
                {profile.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      {children}
    </div>
  );
}
