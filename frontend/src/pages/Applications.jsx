import LayoutClient from '../layouts/LayoutClient';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/Button';

export default function Applications() {
  const { user } = useAuth();
  return (
    <LayoutClient className='layout-appshet relative'>
      <iframe src={`${user.appLink}?platform=desktop`} className='h-full w-full iframe-appshet'></iframe>
    </LayoutClient>
  )
}
