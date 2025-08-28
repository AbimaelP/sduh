import { Link } from "react-router-dom";
import Logo from "../components/Logo";
import "../assets/css/header.css";
import LayoutClient from '../layouts/LayoutClient';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';

export default function Applications() {
  const { user } = useAuth()
  const [appLink, setAppLink] = useState(null)

  useEffect(() => {
    setAppLink(user.app_link)
  }, [user])
  return (
    <LayoutClient className='layout-appshet'>
      <iframe src={`${appLink}?platform=desktop`} className='h-full w-full iframe-appshet'></iframe>
    </LayoutClient>
  )
}
