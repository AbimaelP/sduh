import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { callbackGovBR } from '../services/api/api';
import Section from '../components/Section';
import Icon from '../components/Icon';
import { useAuth } from '../contexts/AuthContext';

export default function GovCallback() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

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
        console.log(user)
        login(user.preferred_username, user.preferred_username, 'gov')
      } catch (err) {
        console.error(err);
        navigate("/login");
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
