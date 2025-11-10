import LayoutClient from "../layouts/LayoutClient";
import Button from '../components/Button';
export default function ReportsGestao() {
  return (
    <LayoutClient className="relative">
      <Button
        className="btn btn-gray"
        classNameLink="btn-voltar-mapa btn-voltar-gestao"
        icon="fas fa-map"
        link="/"
      >
        Voltar
      </Button>
      <iframe
        src="https://lookerstudio.google.com/embed/reporting/5756095b-0b28-42b9-a27e-09de5e988aef/page/r4NVF"
        frameborder="0"
        className="report-gestao-iframe"
        sandbox="allow-scripts allow-same-origin allow-forms"
      ></iframe>
    </LayoutClient>
  );
}
