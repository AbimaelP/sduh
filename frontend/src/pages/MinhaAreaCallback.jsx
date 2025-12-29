import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { callbackMinhaArea } from "../services/api/api";
import Section from "../components/Section";
import Icon from "../components/Icon";
import { useAuth } from "../contexts/AuthContext";

export default function MinhaAreaCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const processCallback = async () => {

      try {
        const url = await callbackMinhaArea();
        window.location.href = url
      } catch (err) {
        navigate("/login");
      }
    };

    processCallback();
  }, []);

  return (
    <Section className="flex w-screen h-screen items-center justify-center">
      <Icon className="" icon="fas fa-spinner fa-spin text-4xl text-blue-500" />
    </Section>
  );
}
