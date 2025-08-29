export default function exportPDF(dataToExport = []) {
  const iframe = document.createElement("iframe");
  document.body.appendChild(iframe);
  const doc = iframe.contentWindow.document;

  // inclui os estilos da página
  const styles = Array.from(document.querySelectorAll("link[rel='stylesheet'], style"))
    .map(node => node.outerHTML)
    .join("\n");

  const exportHTML = `
    <table class="w-full">
      <thead>
        <tr>
          <th>
            <div>
              
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        ${dataToExport.map(item => `
          <tr>
            <td>${item.nomeEmpreendimento}</td>
            <td>${item.enderecoEmpreendimento}</td>
            <td>${item.qtDormitorio}</td>
            <td>${item.tipologia}</td>
            <td>${item.subsidioEstadual}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  doc.open();
  doc.write(`
    <html>
      <head>
        <title>Export PDF</title>
        ${styles}
      </head>
      <body>
        ${exportHTML}
        <script>
          window.onload = function() {
            window.print();
            window.close();
            parent.document.body.removeChild(parent.document.querySelector('iframe'));
          }
        </script>
      </body>
    </html>
  `);
  doc.close();
}
