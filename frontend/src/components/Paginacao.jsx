import { useState } from "react";

export default function Paginacao({ paginaAtual, totalPaginas, onChange }) {
  const handleAnterior = () => {
    if (paginaAtual > 1) onChange(paginaAtual - 1);
  };

  const handleProximo = () => {
    if (paginaAtual < totalPaginas) onChange(paginaAtual + 1);
  };

  return (
    <Section className="flex items-center justify-center gap-4 mt-4">
      <button
        className="btn btn-gray"
        onClick={handleAnterior}
        disabled={paginaAtual === 1}
      >
        Anterior
      </button>

      <span className="font-bold">
        {paginaAtual} de {totalPaginas}
      </span>

      <button
        className="btn btn-gray"
        onClick={handleProximo}
        disabled={paginaAtual === totalPaginas}
      >
        Próximo
      </button>
    </Section>
  );
}
