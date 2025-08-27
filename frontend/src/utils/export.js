export default function exportPDF(tableId) {
  const table = document.getElementById(tableId);
  if (!table) return;

  // cria iframe temporário
  const iframe = document.createElement("iframe");
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow.document;

  // pega todos os <link rel="stylesheet"> e <style> do documento principal
  const styles = Array.from(document.querySelectorAll("link[rel='stylesheet'], style"))
    .map(node => node.outerHTML)
    .join("\n");

  doc.open();
  doc.write(`
    <html>
      <head>
        <title>Export PDF</title>
        ${styles}
      </head>
      <body>
        ${table.outerHTML}
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
