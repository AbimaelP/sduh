import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { callbackCyberark } from '../services/api/api';
import Section from '../components/Section';
import Icon from '../components/Icon';
import { useAuth } from '../contexts/AuthContext';

export default function CyberArkCallback() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, login } = useAuth();

  useEffect(() => {
    const processCallback = async () => {
      if (user) {
        navigate("/");
      }
      const params = new URLSearchParams(location.search);
      const code = params.get("code");

      if (!code) {
        navigate("/login");
        return;
      }

      try {
        const user = await callbackCyberark({ code });
        await login(user.user.preferred_username, user.user.preferred_username, 'gov')

        if (!user) {
          navigate("/login");
        }
      } catch (err) {
        navigate("/login");
      }
    };

    processCallback();
  }, [location, navigate, user]);

  return (
     <Section className='flex w-screen h-screen items-center justify-center'>
      <Icon className='' icon='fas fa-spinner fa-spin text-4xl text-blue-500'/>
    </Section>
  )
}
