import { useState, useEffect } from "react";
import Section from './Section';

export default function Pagination({ totalItems, itemsPerPage, onPageChange }) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Chama o callback sempre que a página mudar
  useEffect(() => {
    if (onPageChange) {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      onPageChange({ startIndex, endIndex, currentPage });
    }
  }, [currentPage, itemsPerPage, onPageChange]);

  const handleAnterior = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleProximo = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  if (totalPages <= 1) return null;

  return (
    <Section className="flex items-center justify-center gap-4 mt-4">
      <button
        className="btn btn-gray"
        onClick={handleAnterior}
        disabled={currentPage === 1}
      >
        Anterior
      </button>

      <span className="font-bold">
        {currentPage} de {totalPages}
      </span>

      <button
        className="btn btn-gray"
        onClick={handleProximo}
        disabled={currentPage === totalPages}
      >
        Próximo
      </button>
    </Section>
  );
}
