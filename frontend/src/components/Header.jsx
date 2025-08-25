import { Link } from 'react-router-dom';
import Logo from './Logo';

export default function Header() {
  return (
    <div className="header p-2">
      <div className="pl-4 pr-4 flex items-center">
        <Link to="/">
          <Logo className="h-10" logoName="logoInverted" />
        </Link>
        <a href="" className="a-link text-white fweight-600 ml-5">
          Plataforma de Dados Integrados
        </a>
      </div>
      <div className='pl-4 pr-4'>
        <a href="https://www.habitacao.sp.gov.br/habitacao" target="_blank">
          <Logo className="h-20" logoName="spUrbano" />
        </a>
      </div>
    </div>
  );
}
