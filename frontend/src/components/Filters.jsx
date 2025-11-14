import { useFilters } from "../contexts/FiltersContext";
import { useAuth } from "../contexts/AuthContext";

import Section from "./Section";
import Button from "./Button";

export default function Filters() {
  const { user } = useAuth();
  const { filters, setFilters, options } = useFilters();

  const handleCleanFilters = () => {
    setFilters({
      search: "",
      municipio: "",
      tipoImovel: "",
      dormitorios: "",
      gerenciaRegional: "",
      regiaoAdministrativa: "",
      regiaoDeGoverno: "",
      subprograma: ""
    });
  };
  const formatDormLabel = (d) =>
    d === 3 ? "3+ dormitórios" : `${d} dormitório${d > 1 ? "s" : ""}`;

  return (
    <Section>
      {user && user.role === "sduh_mgr" ? (
        <>
          <Section>
            <label htmlFor="municipio" className="form-label">
              Município
            </label>
            <input
              type="text"
              placeholder={`Busque por Município`}
              title="Município"
              value={filters.municipio}
              id="municipio"
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  municipio: e.target.value,
                }))
              }
              className="form-input-min"
            />
          </Section>
          <Section>
            <label htmlFor="gerenciaRegional" className="form-label">
              Gerencia Regional
            </label>
            <input
              type="text"
              placeholder={`Busque por Gerencia Regional`}
              title="Gerencia Regional"
              value={filters.gerenciaRegional}
              id="gerenciaRegional"
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  gerenciaRegional: e.target.value,
                }))
              }
              className="form-input-min"
            />
          </Section>
          <Section>
            <label htmlFor="regiaoAdministrativa" className="form-label">
              Região Administrativa
            </label>
            <input
              type="text"
              placeholder={`Busque por Região Administrativa`}
              title="Região Administrativa"
              value={filters.regiaoAdministrativa}
              id="regiaoAdministrativa"
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  regiaoAdministrativa: e.target.value,
                }))
              }
              className="form-input-min"
            />
          </Section>
          <Section>
            <label htmlFor="regiaoDeGoverno" className="form-label">
              Região de Governo
            </label>
            <input
              type="text"
              placeholder={`Busque por Região de Governo`}
              title="Região de Governo"
              value={filters.regiaoDeGoverno}
              id="regiaoDeGoverno"
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  regiaoDeGoverno: e.target.value,
                }))
              }
              className="form-input-min"
            />
          </Section>
          <Section>
            <label htmlFor="subprograma" className="form-label">
              Subprograma
            </label>
            <input
              type="text"
              placeholder={`Busque por Subprograma`}
              title="Subprograma"
              value={filters.subprograma}
              id="subprograma"
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  subprograma: e.target.value,
                }))
              }
              className="form-input-min"
            />
          </Section>
        </>
      ) : (
        <>
          <Section>
            <label htmlFor="search" className="form-label">
              Busca
            </label>
            <input
              type="text"
              placeholder={`Endereço ou Município`}
              title="Endereço ou Município"
              value={filters.search}
              id="search"
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
              className="form-input-min"
            />
          </Section>
          <Section className="mt-4">
            <label className="form-label">Tipo de Imóvel</label>
            <select
              value={filters.tipoImovel}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, tipoImovel: e.target.value }))
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="">Todos</option>
              {options.tiposImovel?.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </Section>

          <Section className="mt-4">
            <label className="form-label">Quantidade de Dormitórios</label>
            <select
              value={filters.dormitorios}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, dormitorios: e.target.value }))
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="">Todos</option>
              {options.dormitorios?.map((d) => (
                <option key={d} value={d}>
                  {formatDormLabel(Number(d))}
                </option>
              ))}
            </select>
          </Section>
        </>
      )}
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
