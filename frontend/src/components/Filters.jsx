import { useFilters } from "../contexts/FiltersContext";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";

import Section from "./Section";
import Button from "./Button";
import AutocompleteField from "./AutocompleteField";

export default function Filters() {
  const { user } = useAuth();
  const { rawData } = useData();
  const { filters, setFilters, options } = useFilters();
  let atendimentos = [];
  let unique = [];
  if (user.role === "sduh_mgr") {
    atendimentos = rawData?.atendimentos || [];
    unique = (field) => [
      ...new Set(atendimentos.map((a) => a[field]).filter(Boolean)),
    ];
  }

  const handleCleanFilters = () => {
    setFilters({
      search: "",
      municipio: "",
      tipoImovel: "",
      dormitorios: "",
      gerenciaRegional: "",
      regiaoAdministrativa: "",
      regiaoDeGoverno: "",
      subprograma: "",
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
          <AutocompleteField
            label="Gerência Regional"
            value={filters.gerenciaRegional}
            placeholder="Busque por Gerência Regional"
            data={unique("gerenciaRegional")}
            onSelect={(val) =>
              setFilters((prev) => ({ ...prev, gerenciaRegional: val }))
            }
          />

          <AutocompleteField
            label="Região Administrativa"
            value={filters.regiaoAdministrativa}
            placeholder="Busque por Região Administrativa"
            data={unique("regiaoAdministrativa")}
            onSelect={(val) =>
              setFilters((prev) => ({ ...prev, regiaoAdministrativa: val }))
            }
          />

          <AutocompleteField
            label="Região de Governo"
            value={filters.regiaoDeGoverno}
            placeholder="Busque por Região de Governo"
            data={unique("regiaoDeGoverno")}
            onSelect={(val) =>
              setFilters((prev) => ({ ...prev, regiaoDeGoverno: val }))
            }
          />

          <AutocompleteField
            label="Subprograma"
            value={filters.subprograma}
            placeholder="Busque por Subprograma"
            data={unique("subprograma")}
            onSelect={(val) =>
              setFilters((prev) => ({ ...prev, subprograma: val }))
            }
          />
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
