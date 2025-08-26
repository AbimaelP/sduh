export default function exportPDF(tableId) {
  const table = document.getElementById(tableId);
  if (!table) return;

  const newWin = window.open("", "_blank");

  const arquivo = document.getElementById("arquivo");
  window.location.reload()

  arquivo.innerHTML += table.outerHTML;

  arquivo.innerHTML +=
    "<script defer>document.getElementById('root').remove(); window.print(); window.close()</script>";
  newWin.document.write(arquivo.outerHTML);
}
