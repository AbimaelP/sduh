import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import '../assets/css/header.css'
import Header from '../components/Header';
import Menu from '../components/Menu';

export default function Home() {
  return (
    <div className='min-h-screen'>
      <Header />
      <Menu />
    </div>
  );
}
