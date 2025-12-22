import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { callbackMinhaArea } from "../services/api/api";
import Section from "../components/Section";
import Icon from "../components/Icon";
import { useAuth } from "../contexts/AuthContext";

export default function MinhaAreaCallback() {
  const navigate = useNavigate();
  const { user, login } = useAuth();

  useEffect(() => {
    console.log('chegou aqui')
    const processCallback = async () => {
      if (user) {
        navigate("/");
      }
 
      try {
        console.log('buscando url minha cyberark')
        const url = await callbackMinhaArea();
        console.log(url)
        window.location.href = url
      } catch (err) {
        navigate("/login");
      }
    };

    processCallback();
  }, [navigate, user]);

  return (
    <Section className="flex w-screen h-screen items-center justify-center">
      <Icon className="" icon="fas fa-spinner fa-spin text-4xl text-blue-500" />
    </Section>
  );
}
