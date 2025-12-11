import LayoutClient from "../layouts/LayoutClient";
import { useAuth } from "../contexts/AuthContext";
export default function ReportsLooker() {
  const { user } = useAuth();

  return (
    <LayoutClient>
      <iframe
        src={user.looker}
        frameborder="0"
        className="report-gestao-iframe"
        sandbox="allow-scripts allow-same-origin allow-forms"
      ></iframe>
    </LayoutClient>
  );
}
