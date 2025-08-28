import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { callbackGovBR } from '../services/api/api';
import Section from '../components/Section';
import Icon from '../components/Icon';

export default function GovCallback() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const processGovCallback = async () => {
      const params = new URLSearchParams(location.search);
      const code = params.get("code");
      const session_state = params.get("session_state");
      const iss = params.get("iss");

      if (!code) {
        navigate("/login");
        return;
      }

      try {
        const user = await callbackGovBR({ code, session_state, iss });
        // aqui você poderia salvar no AuthContext
        // navigate("/dashboard"); // redireciona após login
      } catch (err) {
  if (err.response) {
    // O servidor respondeu com status diferente de 2xx
    console.error("Status:", err.response.status);
    console.error("Headers:", err.response.headers);
    console.error("Data:", err.response.data); // 👈 aqui vem o erro detalhado do Gov.br
  } else if (err.request) {
    // Nenhuma resposta recebida
    console.error("No response received:", err.request);
  } else {
    // Erro na configuração do request
    console.error("Error setting up request:", err.message);
  }

  return res.status(500).json({ error: err.response?.data || err.message });
}
    };

    processGovCallback();
  }, [location, navigate]);

  return (
     <Section className='flex w-screen h-screen items-center justify-center'>
      <Icon className='' icon='fas fa-spinner fa-spin text-4xl text-blue-500'/>
    </Section>
  )
}
