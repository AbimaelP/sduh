import { Link } from "react-router-dom";
import Logo from "../components/Logo";
import "../assets/css/header.css";
import LayoutClient from '../layouts/LayoutClient';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';

export default function Applications() {
  return (
    <LayoutClient className='layout-appshet'>
      <iframe src={`https://www.appsheet.com/start/52ad0add-0bbe-4112-8146-272f5494103a`} className='h-full w-full iframe-appshet'></iframe>
    </LayoutClient>
  )
}
