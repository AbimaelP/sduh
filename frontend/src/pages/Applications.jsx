import LayoutClient from '../layouts/LayoutClient';
import { useAuth } from '../contexts/AuthContext';

export default function Applications() {
  const { user } = useAuth();
  return (
    <LayoutClient className='layout-appshet'>
      <iframe src={`${appLink}?platform=desktop`} className='h-full w-full iframe-appshet'></iframe>
    </LayoutClient>
  )
}
