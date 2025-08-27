import { useFilters } from "../contexts/FiltersContext";

export default function Filters() {
  const { filters, setFilters } = useFilters();

  return (
    <div>
      <div>
        <label htmlFor="search" className='form-label'>Busca</label>
        <input
          type="text"
          placeholder="Endereço ou Município"
          value={filters.search}
          id="search"
          onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          className='form-input-min'
        />
      </div>

      <div className='mt-4'>
        <label className='form-label'>Tipo de Atendimento</label>
        <select
          value={filters.tipoAtendimento}
          onChange={(e) => setFilters(prev => ({ ...prev, tipoAtendimento: e.target.value }))}
          className='mt-1 block w-full rounded-md border-gray-300 shadow-sm'
        >
          <option value="">Todos</option>
          <option value="presencial">Presencial</option>
          <option value="online">Online</option>
        </select>
      </div>

      <div className='mt-4'>
        <label className='form-label'>Tipo de Imóvel</label>
        <select
          value={filters.tipoImovel}
          onChange={(e) => setFilters(prev => ({ ...prev, tipoImovel: e.target.value }))}
          className='mt-1 block w-full rounded-md border-gray-300 shadow-sm'
        >
          <option value="">Todos</option>
          <option value="APTO">APTO</option>
          <option value="CASA">CASA</option>
          <option value="FAMÍLIA">FAMÍLIA</option>
          <option value="LOTE">LOTE</option>
          <option value="CASA SOBREPOSTA">CASA SOBREPOSTA</option>
        </select>
      </div>

      <div className='mt-4'>
        <label className='form-label'>Quantidade de Dormitórios</label>
        <select
          value={filters.dormitorios}
          onChange={(e) => setFilters(prev => ({ ...prev, dormitorios: e.target.value }))}
          className='mt-1 block w-full rounded-md border-gray-300 shadow-sm'
        >
          <option value="">Todos</option>
          <option value="1">1 dormitório</option>
          <option value="2">2 dormitórios</option>
          <option value="3"> 3+ dormitórios</option>
        </select>
      </div>
    </div>
  );
}
