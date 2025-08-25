import { Outlet } from "react-router-dom";
import Header from "./Header";
import Menu from "./Menu";

export default function DefaultLayout() {
  return (
    <div className="min-h-screen">
      <Header />
      <Menu />
      <Outlet />
    </div>
  );
}
