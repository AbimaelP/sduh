import { Outlet } from "react-router-dom";
import Header from "./Header";
import Menu from "./Menu";
import Section from './Section';

export default function DefaultLayout() {
  return (
    <Section className="min-h-screen">
      <Header />
      <Menu />
      <Outlet />
    </Section>
  );
}
