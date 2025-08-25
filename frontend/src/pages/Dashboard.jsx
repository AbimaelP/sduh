import { Link } from "react-router-dom";
import Logo from "../components/Logo";
import "../assets/css/header.css";
import Header from "../components/Header";
import Menu from "../components/Menu";
import Maps from "../components/Maps";
import LayoutClient from '../layouts/LayoutClient';

export default function Dashboard() {
  return (
    <LayoutClient>
      <Maps />
    </LayoutClient>
  )
}
