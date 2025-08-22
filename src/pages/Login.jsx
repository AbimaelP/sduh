import Logo from '../components/Logo';
import Button from '../components/Button';

export default function Login() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-sm p-8 rounded-xl bg-white shadow-lg">
        <div class="flex justify-center">
            <Logo className='h-12' logoName='logo'/>
        </div>
        <form action="" className='mt-10'>
          <input type="text" placeholder='Usuário' class='form-input f-size-small'/>
          <input type="text" placeholder='Senha' class='form-input mt-4  f-size-small'/>
          <div className='flex items-center justify-between mt-4'>
            <div className='input-group'>
              <input type="checkbox" id="lembrar_senha" className='mr-2 f-size-small'/> <label className='f-size-small' htmlFor="lembrar_senha">Lembrar-me</label>
            </div>
            <div><a href="" className='f-size-small'>Esqueceu a senha?</a></div>
          </div>
          <div className='mt-4'>
            <Button className='btn-md btn-gray f-size-small'>ACESSAR (Protótipo)</Button>
            <Button className='btn-md mt-3 btn-black f-size-small'>ENTRAR COM GOV.BR</Button>
            <Button className='btn-md mt-3 btn-red f-size-small'>ACESSE O PAINEL DO CIDADÃO</Button>
          </div>
        </form>
        <div class="flex justify-center mt-10 pt-4">
          <Logo className='h-6' logoName='gov'/>
        </div>
      </div>
    </div>
  );
}
