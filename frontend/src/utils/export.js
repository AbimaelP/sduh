export default function exportPDF(dataToExport = []) {
  const iframe = document.createElement("iframe");
  document.body.appendChild(iframe);
  const doc = iframe.contentWindow.document;

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
        <style>
      * {
        box-sizing: border-box;
        border-width: 0;
        border-style: solid;
        border-color: #e5e7eb;
        margin: 0;
        padding: 0;
      }

      *,
      li,
      a {
        font-family: inter, sans-serif;
      }

      .header-table, .row-table {
        text-align: start;
        padding-bottom: 15px;
      }

      .text-table-space {
        margin-bottom: 15px;
      }

      .line-section {
        border-bottom: 1px solid;
      }

      .table-export {
        padding: 50px;
      }

      .item-list-details {
        padding-left: 35px;
      }

      .title-table {
        font-size: 20px;
      }

      .row-table {
        padding-top: 15px;
      }

      .row-table * {
        font-weight: 500;
      }
    </style>
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
