import Logo from "../components/Logo";
import Button from "../components/Button";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { loginGOV } from "../services/api/api";
import Section from '../components/Section';
import Loading from '../components/Loading';

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [authType, setAuthType] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (authType) => {
    setLoading(true)
    try {
      await login(email, pass, authType);
    } catch (error) {
      setLoading(false)
      console.error("Erro no login:", error);
    }
  };

  const handleLoginGOV = async () => {
    setLoading(true)
    try {
      const url = await loginGOV();
      window.location.href = url;
    } catch (error) {
      setLoading(false)
      console.error(error);
    }
  };

  const handleLoginServidor = () => {
    setLoading(true)
    window.location.href = import.meta.env.VITE_URL_MINHAAREA;
  };

  return (
    <>
      { loading ? <Loading /> : <></> }
      <Section className="flex items-center justify-center min-h-screen">
        <Section className="w-full max-w-sm p-8 rounded-xl bg-white shadow-lg">
          <Section className="flex justify-center">
            <Logo className="h-12" logoName="logo" />
          </Section>

          <form className="mt-10">
            {/* <input
              type="text"
              placeholder="Usuário"
              className="form-input f-size-small"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Senha"
              className="form-input mt-4 f-size-small"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            /> */}

            {/* <Section className="flex items-center justify-between mt-4">
              <Section className="input-group">
                <input
                  type="checkbox"
                  id="lembrar_senha"
                  className="mr-2 f-size-small"
                />
                <label className="f-size-small" htmlFor="lembrar_senha">
                  Lembrar-me
                </label>
              </Section>
              <Section>
                <a href="#" className="f-size-small">
                  Esqueceu a senha?
                </a>
              </Section>
            </Section> */}

            <Section className="mt-4">
              {/* <Button
                type="button"
                onClick={() => handleLogin("prototipo")}
                className="btn-md btn-gray f-size-small"
              >
                ACESSAR
              </Button> */}
              <Button
                type="button"
                onClick={() => handleLogin("cidadao")}
                className="btn-md mt-3 btn-red f-size-small"
              >
                ACESSE O PAINEL DO CIDADÃO
              </Button>
              <Button
                type="button"
                onClick={() => handleLoginServidor()}
                className="btn-md mt-3 btn-blue f-size-small"
              >
                ENTRAR COMO SERVIDOR PÚBLICO
              </Button>
              <Button
                type="button"
                icon='fas fa-user'
                onClick={() => handleLoginGOV()}
                className="btn-md mt-3 btn-blue f-size-small"
              >
                ENTRAR COM GOV.BR
              </Button>
            </Section>
          </form>

          <Section className="flex justify-center mt-10 pt-4">
            <Logo className="h-6" logoName="gov" />
          </Section>
        </Section>
      </Section>
    </>

  );
}
