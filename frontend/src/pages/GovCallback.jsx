import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { callbackGovBR } from '../services/api/api';
import Section from '../components/Section';
import Icon from '../components/Icon';
import { useAuth } from '../contexts/AuthContext';

export default function GovCallback() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, login } = useAuth();

  useEffect(() => {
    const processGovCallback = async () => {
      if (user) {
        navigate("/");
      }
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
        await login('50402797876', '50402797876', 'gov')

        if (!user) {
          navigate("/login");
        }
      } catch (err) {
        navigate("/login");
      }
    };

    processGovCallback();
  }, [location, navigate, user]);

  return (
     <Section className='flex w-screen h-screen items-center justify-center'>
      <Icon className='' icon='fas fa-spinner fa-spin text-4xl text-blue-500'/>
    </Section>
  )
}
