import { useFilters } from "../contexts/FiltersContext";
import Section from './Section';
import Button from "./Button";

export default function Filters() {
  const { filters, setFilters, options } = useFilters();

  const handleCleanFilters = () => {
    setFilters({search: "", tipoImovel: "", dormitorios: ""})
  }
  const formatDormLabel = (d) =>
    d === 3 ? "3+ dormitórios" : `${d} dormitório${d > 1 ? "s" : ""}`;

  return (
    <Section>
      <Section>
        <label htmlFor="search" className='form-label'>Busca</label>
        <input
          type="text"
          placeholder="Endereço ou Município"
          value={filters.search}
          id="search"
          onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          className='form-input-min'
        />
      </Section>

      <Section className='mt-4'>
        <label className='form-label'>Tipo de Imóvel</label>
        <select
          value={filters.tipoImovel}
          onChange={(e) => setFilters(prev => ({ ...prev, tipoImovel: e.target.value }))}
          className='mt-1 block w-full rounded-md border-gray-300 shadow-sm'
        >
          <option value="">Todos</option>
          {options.tiposImovel?.map(tipo => (
            <option key={tipo} value={tipo}>{tipo}</option>
          ))}
        </select>
      </Section>

      <Section className='mt-4'>
        <label className='form-label'>Quantidade de Dormitórios</label>
        <select
          value={filters.dormitorios}
          onChange={(e) => setFilters(prev => ({ ...prev, dormitorios: e.target.value }))}
          className='mt-1 block w-full rounded-md border-gray-300 shadow-sm'
        >
          <option value="">Todos</option>
          {options.dormitorios?.map(d => (
            <option key={d} value={d}>{formatDormLabel(Number(d))}</option>
          ))}
        </select>
      </Section>

      <Section className="mt-4">
          <Button
            className="btn btn-light"
            iconPosition="left"
            icon="fas fa-sync-alt"
            onClick={handleCleanFilters}
          >
            Limpar Filtros
          </Button>
        </Section>
    </Section>
  );
}
