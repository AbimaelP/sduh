import { Link } from "react-router-dom";
import Logo from "../components/Logo";
import "../assets/css/header.css";
import LayoutClient from '../layouts/LayoutClient';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';

export default function Applications() {
  return (
    <LayoutClient className='layout-appshet'>
      <iframe src={`https://www.appsheet.com/start/44299b5a-b51e-417d-96aa-393fba931ab1?platform=desktop`} className='h-full w-full iframe-appshet'></iframe>
    </LayoutClient>
  )
}
