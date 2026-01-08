import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { callbackGovBR } from '../services/api/api';
import Section from '../components/Section';
import Icon from '../components/Icon';
import { useAuth } from '../contexts/AuthContext';

export default function AcessoCidadao() {
  const navigate = useNavigate();
  const { user, login } = useAuth();

  useEffect(() => {
    const processAcessoCidadao = async () => {
      // navigate("/login")

      if (user) {
        navigate("/");
      }

      try {
        await login('Cidadão', 'cidadao', 'cidadao')
        navigate("/");
      } catch (err) {
        navigate("/login");
      }
    };

    processAcessoCidadao();
  }, [navigate]);

  return (
     <Section className='flex w-screen h-screen items-center justify-center'>
      <Icon className='' icon='fas fa-spinner fa-spin text-4xl text-blue-500'/>
    </Section>
  )
}
