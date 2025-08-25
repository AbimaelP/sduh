import { useAuth } from '../contexts/AuthContext';

export default function LayoutClient({ children }) {
  const { user } = useAuth();

  // Array com os perfis
  const profiles = [
    { value: 'sduh', label: 'SDUH (Gestão Estadual)' },
    { value: 'sduh-adm', label: 'SDUH (Administração)' },
    { value: 'regional', label: 'Regional (Campinas)' },
    { value: 'municipal', label: 'Municipal' },
    { value: 'cidadao', label: 'Cidadão' },
  ];

  return (
    <div className="layout">
      <div className="header-maps">
        <div className="flex justify-end p-4 bg-white shadow-md items-center z-20 relative">
          <span className="text-sm font-medium text-gray-700">Perfil:</span>
          <select
            className="rounded-md border-gray-200 bg-gray-100 text-gray-700 shadow-sm focus:ring-0 focus:outline-none sm:text-sm cursor-not-allowed ml-2"
            value={user?.role || ''}
            disabled
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
