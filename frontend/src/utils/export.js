import { formatBRL, formatCEP, formatDate, formatHour } from "./format"
export default function exportPDF(dataToExport = [], lastUpdatedData) {
  const iframe = document.createElement("iframe");
  document.body.appendChild(iframe);
  const doc = iframe.contentWindow.document;

  const exportHTML = `

  <table class="w-full table-export">
      <thead>
        <tr>
          <th>
            <div class="header-table line-section">
              <div class="text-table-space title-table">
                Programa Casa Paulista - Carta de Crédito Imobiliário (CCI)
              </div>
              <div class="text-table-space">
                <ul class="item-list-details">
                  <li>Atualizado em: ${formatDate(lastUpdatedData)} às ${formatHour(lastUpdatedData)}.</li>
                  <li>
                    Fonte: Secretaria de Desenvolvimento Urbano e Habitação do
                    Governo do Estado de São Paulo.
                  </li>
                </ul>
              </div>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
      ${dataToExport.map(item => `
        <tr>
          <td>
            <div class="row-table line-section">
              <div class="text-table-space">
                ${item.nomeEmpreendimento ?? 'N/A'}
              </div>
              <div class="text-table-space">
                <ul class="item-list-details">
                  <li>Endereço: ${item.enderecoEmpreendimento ?? 'N/A'}</li>
                  <li> CEP: ${formatCEP(item.cep) ?? 'N/A'} </li>
                  <li> Dormitórios: ${item.qtDormitorio ?? 'N/A'}</li>
                  <li> Tipo de Imóvel: ${item.tipologia ?? 'N/A'} </li>
                  <li> Unidades com Subsídio: ${formatBRL(item.subsidioEstadual) ?? 'N/A'}</li>
                  <li> Valor do Subsídio Estadual: ${item.unidadesSubsidiadas ?? 'N/A'} </li>
                </ul>
              </div>
            </div>
          </td>
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
      .row-table {
        page-break-inside: avoid;
        break-inside: avoid;
      }

      thead {
        display: table-row-group;
      }

      tr {
        page-break-inside: avoid;
        break-inside: avoid;
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
