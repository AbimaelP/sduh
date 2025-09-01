import { Link } from 'react-router-dom';
import Logo from './Logo';
import '../assets/css/header.css'
import Section from './Section';

export default function Header() {
  return (
    <Section className="header p-2">
      <Section className="pl-4 pr-4 flex items-center">
        <Link to="/">
          <Logo className="h-10" logoName="logoInverted" />
        </Link>
        <a href="https://doe.sp.gov.br/executivo/secretaria-de-desenvolvimento-urbano-e-habitacao/resolucao-sduh-n-30-de-17-de-junho-de-2025-20250617112112201154376" target='_blank' className="a-link text-white fweight-600 ml-5">
          Plataforma de Dados Integrados
        </a>
      </Section>
      <Section className='flex pl-4 pr-4 items-center'>
        <Section>
          <a href="https://www.habitacao.sp.gov.br/habitacao" target="_blank">
            <Logo className="h-10" logoName="spGovernoInverted" />
          </a>
        </Section>
      </Section>
    </Section>
  );
}
