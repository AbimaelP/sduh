import { useState, useEffect } from "react";
import Section from "./Section";
import "../assets/css/pagination.css";
import Button from './Button';

export default function Pagination({
  totalItems,
  itemsPerPage,
  onPageChange,
  component,
  currentPage,
  onPageChangeManual,
}) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  useEffect(() => {
    if (onPageChange) {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      onPageChange({ startIndex, endIndex, currentPage });
    }
  }, [currentPage, itemsPerPage, onPageChange]);

  const handleAnterior = () => {
    onPageChangeManual(Math.max(currentPage - 1, 1));
  };

  const handleProximo = () => {
    onPageChangeManual(Math.min(currentPage + 1, totalPages));
  };

  return (
    <Section className="mt-4 relative">
      <Button
        className="btn btn-gray"
        classNameLink="btn-voltar-mapa"
        icon='fas fa-map'
        link="/"
      >
        Voltar para o Mapa
      </Button>

      <Section className="pagination">
        <button
          className={`btn btn-gray btn-pagination ${currentPage === 1 && 'btn-disabled'}`}
          onClick={handleAnterior}
          disabled={currentPage === 1}
        >
          Anterior
        </button>

        <span className="font-bold">
          {currentPage} de {totalPages}
        </span>

        <button
          className={`btn btn-gray btn-pagination  ${currentPage === totalPages && 'btn-disabled'}`}
          onClick={handleProximo}
          disabled={currentPage === totalPages}
        >
          Próximo
        </button>
      </Section>
      {component}
    </Section>
  );
}
