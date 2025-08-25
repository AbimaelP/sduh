import Logo from '../components/Logo';
import Button from '../components/Button';
import { login } from '../services/api/api';
import { useEffect, useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await login(email, pass);
      console.log("Login ok:", response);
    } catch (error) {
      console.error("Erro no login:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-sm p-8 rounded-xl bg-white shadow-lg">
        <div className="flex justify-center">
          <Logo className="h-12" logoName="logo" />
        </div>

        <form onSubmit={handleLogin} className="mt-10">
          <input
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
          />

          <div className="flex items-center justify-between mt-4">
            <div className="input-group">
              <input type="checkbox" id="lembrar_senha" className="mr-2 f-size-small" /> 
              <label className="f-size-small" htmlFor="lembrar_senha">Lembrar-me</label>
            </div>
            <div>
              <a href="#" className="f-size-small">Esqueceu a senha?</a>
            </div>
          </div>

          <div className="mt-4">
            <Button type="submit" className="btn-md btn-gray f-size-small">ACESSAR (Protótipo)</Button>
            <Button type="button" className="btn-md mt-3 btn-black f-size-small">ENTRAR COM GOV.BR</Button>
            <Button type="button" className="btn-md mt-3 btn-red f-size-small">ACESSE O PAINEL DO CIDADÃO</Button>
          </div>
        </form>

        <div className="flex justify-center mt-10 pt-4">
          <Logo className="h-6" logoName="gov" />
        </div>
      </div>
    </div>
  );
}
