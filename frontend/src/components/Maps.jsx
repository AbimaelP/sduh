import { useEffect, useRef, useState } from "react";
import debounce from "lodash/debounce";
import DropDownItem from "./DropDownItem";
import {
  empreendimentos,
  ultimaAtualizacao,
  atendimentos,
} from "../services/api/api";
import ButtonGroup from "./ButtonGroup";
import Button from "./Button";
import "../assets/css/maps.css";
import "../assets/css/report.css";
import { useAuth } from "../contexts/AuthContext";
import { useFilters } from "../contexts/FiltersContext";
import { useData } from "../contexts/DataContext";
import Section from "./Section";
import Icon from "./Icon";
import { formatDate, formatHour, formatBRL } from "../utils/format";
import open from "../utils/open";
import { normalize } from "../utils/format";
import Loading from "./Loading";

const iconsMap = {
  APTO: { icon: "fas fa-building", color: "#8A2BE2" },
  CASA: { icon: "fas fa-home", color: "#28a745" },
  FAMÍLIA: { icon: "fas fa-users", color: "#FFA500" },
  LOTE: { icon: "fas fa-map", color: "rgba(226, 113, 43, 1)" },
  "CASA SOBREPOSTA": { icon: "fas fa-home", color: "#1e682fff" },
};

export default function Maps() {
  const { user } = useAuth();
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const executedRef = useRef(false);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const { rawData, chargeData } = useData();
  const [loading, setLoading] = useState(false);
  const [activeButton, setActiveButton] = useState(null);
  const [markers, setMarkers] = useState([]);
  const markerDivs = useRef([]);
  const { filters, setOptionsFromData } = useFilters();
  const openInfoWindowRef = useRef(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [statusObra, setStatusObra] = useState(null);

  const debouncedCreateMarkers = useRef(
    debounce(async (data) => {
      try {
        await createMarkers(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }, 500) // 300ms após o último caractere digitado
  ).current;

  const createMarkers = async (empreendimentosData) => {
    if (!mapInstance.current || !window.google) return [];
    // limpa marcadores antigos
    markers.forEach((marker) => marker.setMap(null));
    markerDivs.current.forEach((div) => {
      if (div && div.parentNode) div.parentNode.removeChild(div);
    });
    markerDivs.current = [];

    const promises = empreendimentosData.map(async (item) => {
      const {
        cep,
        municipio,
        tipologia,
        qtDormitorio,
        enderecoEmpreendimento,
        unidadesSubsidiadas,
        subsidioEstadual,
        nomeEmpreendimento,
      } = item;
      const address = `${item.cep || ""} ${
        item.enderecoEmpreendimento || ""
      }, ${item.municipio}, SP, Brazil`;

      try {
        if (!item.latitude || !item.longitude) return null;

        const position = new window.google.maps.LatLng(
          item.latitude,
          item.longitude
        );

        // (item.enderecosAtendimento = [
        //   {
        //     tipoLogradouro: "Rua",
        //     logradouro: "Floriano Peixoto",
        //     numero: "350",
        //     bairro: "Centro",
        //     cidade: "Campinas",
        //     estado: "SP",
        //     cep: "13015-200",
        //     complemento: "Sala 3 - Térreo",
        //   },
        //   {
        //     tipoLogradouro: "Avenida",
        //     logradouro: "Brasil",
        //     numero: "820",
        //     bairro: "Nova Campinas",
        //     cidade: "Campinas",
        //     estado: "SP",
        //     cep: "13070-180",
        //     complemento: "Prédio da CDHU",
        //   },
        // ]),
        //   (item.contatosAtendimento = [
        //     {
        //       nome: "Maria Oliveira",
        //       email: "maria.oliveira@habitacao.sp.gov.br",
        //       telefone: "(19) 3234-1122",
        //       celular: "(19) 98877-1122",
        //     },
        //     {
        //       nome: "João Santos",
        //       email: "joao.santos@habitacao.sp.gov.br",
        //       telefone: "(19) 3278-9988",
        //       celular: "(19) 99123-4455",
        //     },
        //   ]);
        const contatosList = ``;

        const enderecosAtendimento = `
            <div class="mt-2">
            <div class="flex">
                <span class="container-icone-card-report">
                  <i class="fas fa-info-circle mr-2 f-size-small icon-card-report-item" /></i>
                  </span>
                <div class="card-info-item">
                  <span class="item-info-title-map">Endereços para Atendimento:</span>
                  ${
                    item.enderecosAtendimento &&
                    item.enderecosAtendimento.length > 0
                      ? item.enderecosAtendimento
                          .map(
                            (enderecoAtendimento, index) => `
                        <span class="item-info-detail" title="${enderecoAtendimento.tipoLogradouro} ${enderecoAtendimento.logradouro} ${enderecoAtendimento.logradouro} N° ${enderecoAtendimento.numero}">
                          ${enderecoAtendimento.tipoLogradouro} ${enderecoAtendimento.logradouro} ${enderecoAtendimento.logradouro} N° ${enderecoAtendimento.numero} 
                        </span>`
                          )
                          .join(", ")
                      : "N/A"
                  }
                </div>
            </div>
            </div>`;

        const infoWindow = new window.google.maps.InfoWindow(
          user.role === "sduh_mgr"
            ? {
                content: `
          <div class="card-container p-4 bg-white rounded-2xl shadow shadow-none">
          <div class="card-header flex items-center">
            <div class="font-bold">${item.atendimentoHabitacional}</div>
          </div>
          
          <div class="card-info">
            <div class="card-item ">
              <div class="flex">
                <span class="container-icone-card-report">
                  <i class="fas fa-map-marker-alt mr-2 f-size-small icon-card-report-item" /></i>
                  </span>
                <div class="card-info-item">
                  <span class="item-info-title-map">Gerencia Regional:</span>
                  <span class="item-info-detail" title="${
                    item.gerenciaRegional
                  }">
                    ${item.gerenciaRegional ?? "N/A"}
                  </span>
                </div>
              </div>
            </div>

            <div class="card-item">
              <div class="flex">
                <span class="container-icone-card-report">
                  <i class="fas fa-city mr-2 f-size-small icon-card-report-item" /></i>
                  </span>
                <div class="card-info-item">
                  <span class="item-info-title-map">Município:</span>
                  <span class="item-info-detail">${
                    item.municipio ?? "N/A"
                  }</span>
                </div>
              </div>
            </div>

            <div class="card-item">
              <div class="flex">
                <span class="container-icone-card-report">
                  <i class="fas fa-building mr-2 f-size-small icon-card-report-item" /></i>
                  </span>
                <div class="card-info-item">
                  <span class="item-info-title-map">Região de Governo:</span>
                  <span class="item-info-detail">${
                    item.regiaoDeGoverno ?? "N/A"
                  }</span>
                </div>
              </div>
            </div>

            <div class="card-item">
              <div class="flex">
                <span class="container-icone-card-report">
                  <i class="fas fa-home mr-2 f-size-small icon-card-report-item" /></i>
                  </span>
                <div class="card-info-item">
                  <span class="item-info-title-map">Região Administrativa:</span>
                  <span class="item-info-detail">${
                    item.regiaoAdministrativa ?? "N/A"
                  }</span>
                </div>
              </div>
            </div>
            
            <div class="card-item">
              <div class="flex">
                <span class="container-icone-card-report">
                  <i class="fas fa-hand-holding-usd mr-2 f-size-small icon-card-report-item" /></i>
                  </span>
                <div class="card-info-item">
                  <span class="item-info-title-map">Investimento Entregue:</span>
                  <span class="item-info-detail">${
                    formatBRL(item.investEntregue) ?? "N/A"
                  }</span>
                </div>
              </div>
            </div>

            <div class="card-item">
              <div class="flex">
                <div class="card-info-item card-info-item-url bg-street-view">
                  <button
                    class="item-info-url item-street-view"
                    id="streetview-btn"
                  >
                    Ver no Street View 
                    <i class="fas fa-street-view ml-1"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        `,
              }
            : {
                content: `
          <div class="card-container p-4 bg-white rounded-2xl shadow shadow-none">
          <div class="card-header flex items-center">
            <div class="font-bold">${item.nomeEmpreendimento}</div>
          </div>
          
          <div class="card-info">
            <div class="card-item ">
              <div class="flex">
                <span class="container-icone-card-report">
                  <i class="fas fa-map-marker-alt mr-2 f-size-small icon-card-report-item" /></i>
                  </span>
                <div class="card-info-item">
                  <span class="item-info-title-map">Endereço do Empreendimento:</span>
                  <span class="item-info-detail" title="${
                    item.enderecoEmpreendimento
                  }">
                    ${item.enderecoEmpreendimento ?? "N/A"}
                  </span>
                </div>
              </div>
            </div>

            <div class="card-item">
              <div class="flex">
                <span class="container-icone-card-report">
                  <i class="fas fa-city mr-2 f-size-small icon-card-report-item" /></i>
                  </span>
                <div class="card-info-item">
                  <span class="item-info-title-map">Município:</span>
                  <span class="item-info-detail">${
                    item.municipio ?? "N/A"
                  }</span>
                </div>
              </div>
            </div>

            <div class="card-item">
              <div class="flex">
                <span class="container-icone-card-report">
                  <i class="fas fa-bed mr-2 f-size-small icon-card-report-item" /></i>
                  </span>
                <div class="card-info-item">
                  <span class="item-info-title-map">Número de Dormitórios:</span>
                  <span class="item-info-detail">${
                    item.qtDormitorio ?? "N/A"
                  }</span>
                </div>
              </div>
            </div>

            <div class="card-item">
              <div class="flex">
                <span class="container-icone-card-report">
                  <i class="fas fa-home mr-2 f-size-small icon-card-report-item" /></i>
                  </span>
                <div class="card-info-item">
                  <span class="item-info-title-map">Tipologia:</span>
                  <span class="item-info-detail">${
                    item.tipologia ?? "N/A"
                  }</span>
                </div>
              </div>
            </div>
            
            <div class="card-item">
              <div class="flex">
                <span class="container-icone-card-report">
                  <i class="fas fa-hand-holding-usd mr-2 f-size-small icon-card-report-item" /></i>
                  </span>
                <div class="card-info-item">
                  <span class="item-info-title-map">Valor do Benefício:</span>
                  <span class="item-info-detail">${
                    formatBRL(item.subsidioEstadual) ?? "N/A"
                  }</span>
                </div>
              </div>
            </div>


            <div class="card-item">
              <div class="flex">
                <span class="container-icone-card-report">
                  <i class="fas fa-building mr-2 f-size-small icon-card-report-item" /></i>
                  </span>
                <div class="card-info-item">
                  <span class="item-info-title-map">Unidades Disponíveis:</span>
                  <span class="item-info-detail">${
                    item.unidadesSubsidiadas ?? "N/A"
                  }</span>
                </div>
              </div>
            </div>

            <div class="card-item ">
                  ${enderecosAtendimento}
            </div>

            <div class="card-item">
              <div class="flex">
                <div class="card-info-item card-info-item-url">
                  <a href="https://www.habitacao.sp.gov.br/habitacao/institucional/nossos_servicos/programa-casa-paulista/cidadao" target="_blank" class="item-info-url">Casa Paulista - Crédito Imobiliário 
                  <i class="fas fa-external-link-square-alt ml-1" /></i>
                  </a>
                </div>
              </div>
            </div>

            <div class="card-item">
              <div class="flex">
                <div class="card-info-item card-info-item-url bg-street-view">
                  <button
                    class="item-info-url item-street-view"
                    id="streetview-btn"
                  >
                    Ver no Street View 
                    <i class="fas fa-street-view ml-1"></i>
                  </button>
                </div>
              </div>
            </div>

            <div class="w-full">
              ${contatosList}
            </div>
          </div>
        </div>
        `,
              }
        );

        const overlay = new window.google.maps.OverlayView();

        overlay.onAdd = function () {
          const div = document.createElement("div");
          div.innerHTML = `
          <div class='custom-marker-icon' style='background-color: ${
            iconsMap[tipologia]?.color || "gray"
          };'>
            <i class='${
              iconsMap[tipologia]?.icon || "fas fa-map-marker-alt"
            } map-marker-icon'></i>
          </div>
        `;
          this.div = div;
          markerDivs.current.push(div);

          div.addEventListener("click", () => {
            // fecha qualquer outro InfoWindow aberto
            if (openInfoWindowRef.current) {
              openInfoWindowRef.current.close();
            }
            infoWindow.setPosition(position);
            infoWindow.open({ map: mapInstance.current, anchor: null });
            openInfoWindowRef.current = infoWindow; // atualiza a referência
          });

          const panes = this.getPanes();
          panes.overlayMouseTarget.appendChild(div);

          window.google.maps.event.addListenerOnce(
            infoWindow,
            "domready",
            () => {
              const btn = document.getElementById("streetview-btn");
              if (btn) {
                btn.addEventListener("click", () => {
                  const streetView = mapInstance.current.getStreetView();
                  streetView.setPosition(position);
                  streetView.setPov({ heading: 100, pitch: 0 });
                  streetView.setVisible(true);
                });
              }
            }
          );
        };

        overlay.draw = function () {
          const projection = this.getProjection();
          const point = projection.fromLatLngToDivPixel(position);
          if (this.div) {
            this.div.style.position = "absolute";
            this.div.style.left = `${point.x}px`;
            this.div.style.top = `${point.y}px`;
          }
        };

        overlay.onRemove = function () {
          if (this.div && this.div.parentNode) {
            this.div.parentNode.removeChild(this.div);
          }
          this.div = null;
        };

        overlay.setMap(mapInstance.current);
        return overlay;
      } catch (err) {
        console.warn("Erro ao geocodificar:", address);
        return null;
      }
    });

    const results = await Promise.all(promises);
    setMarkers(results.filter(Boolean));
    return results.filter(Boolean);
  };

  useEffect(() => {
    if (!user) return; // só roda se houver usuário
    if (executedRef.current) return; // evita múltiplas execuções
    if (!rawData || Object.keys(rawData).length === 0) return; // espera carregar o rawData

    executedRef.current = true;

    async function initializeApp() {
      setLoading(true);
      try {
        // Garante que o script do Google Maps seja carregado
        await new Promise((resolve, reject) => {
          if (window.google && window.google.maps) {
            resolve();
            return;
          }

          // Verifica se já existe script em carregamento
          const existingScript = document.querySelector(
            `script[src*="maps.googleapis.com/maps/api/js"]`
          );

          if (existingScript) {
            existingScript.addEventListener("load", resolve);
            existingScript.addEventListener("error", reject);
            return;
          }

          const script = document.createElement("script");
          script.src = `https://maps.googleapis.com/maps/api/js?key=${
            import.meta.env.VITE_GOOGLE_MAPS_API_KEY
          }&libraries=marker,geometry,visualization`;
          script.defer = true;
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });

        setMapsLoaded(true);

        if (!window.google || !window.google.maps) {
          console.error("Google Maps script não carregado!");
          return;
        }

        // Importa as bibliotecas
        const { Map } = await window.google.maps.importLibrary("maps");
        const { AdvancedMarkerElement } =
          await window.google.maps.importLibrary("marker");

        // Inicializa o mapa com localização do usuário (ou fallback)
        const initMap = (position) => {
          mapInstance.current = new Map(mapRef.current, {
            center: position,
            zoom: 10,
            mapId: "a4e035e5a4e5272a",
            mapTypeControl: false,
            streetViewControl: true,
            zoomControl: true,
            fullscreenControl: false,
          });

          new AdvancedMarkerElement({
            map: mapInstance.current,
            position,
            title: "Você está aqui!",
            zIndex: 9999,
          });
        };

        // Pega localização atual
        navigator.geolocation.getCurrentPosition(
          (pos) =>
            initMap({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
          (err) => {
            console.warn(
              "Não foi possível obter localização, usando fallback:",
              err
            );
            initMap({ lat: -22.5, lng: -48.5 });
          }
        );

        const lastUpdatedData = await ultimaAtualizacao();

        setOptionsFromData(rawData.atendimentos);
        setLastUpdated(lastUpdatedData);
        await createMarkers(rawData.atendimentos);
      } catch (err) {
        console.error("Erro ao inicializar o mapa:", err);
      } finally {
        setLoading(false);
      }
    }

    initializeApp();
  }, [user, rawData]);

  useEffect(() => {
    if (!rawData) return;
    let data = [];

    if (user) {
      data = Array.isArray(rawData.atendimentos)
        ? [...rawData.atendimentos]
        : [];
    }

    if (user && user.role !== "sduh_mgr") {
      if (filters.search) {
        const term = normalize(filters.search);

        data = data.filter((item) => {
          const endereco = normalize(item.enderecoEmpreendimento || "");
          const municipio = normalize(item.municipio || "");

          return municipio.includes(term) || endereco.includes(term);
        });
      }
      if (filters.tipoImovel) {
        data = data.filter((item) => item.tipologia === filters.tipoImovel);
      }

      if (filters.dormitorios) {
        data = data.filter((item) =>
          Number(filters.dormitorios) === 3
            ? Number(item.qtDormitorio) >= 3
            : Number(item.qtDormitorio) === Number(filters.dormitorios)
        );
      }
    } else {
      if (filters.gerenciaRegional) {
        const term = normalize(filters.gerenciaRegional);

        data = data.filter((item) => {
          const gerenciaRegional = normalize(item.gerenciaRegional || "");

          return gerenciaRegional.includes(term);
        });
      }

      if (filters.regiaoAdministrativa) {
        const term = normalize(filters.regiaoAdministrativa);

        data = data.filter((item) => {
          const regiaoAdministrativa = normalize(
            item.regiaoAdministrativa || ""
          );

          return regiaoAdministrativa.includes(term);
        });
      }

      if (filters.regiaoDeGoverno) {
        const term = normalize(filters.regiaoDeGoverno);

        data = data.filter((item) => {
          const regiaoDeGoverno = normalize(item.regiaoDeGoverno || "");

          return regiaoDeGoverno.includes(term);
        });
      }
    }

    if (mapInstance.current) {
      let address = `SÃO PAULO, SP, Brazil`;
      let position = null;
      if (data.length > 0) {
        if (user && user.role !== "sduh_mgr") {
          if (filters.search) {
            if (data.length > 1) {
              address = `${data[0].municipio}, SP, Brazil`;
            } else {
              address = `${data[0].cep ?? ""} ${
                data[0].enderecoEmpreendimento ?? ""
              }, ${data[0].municipio}, SP, Brazil`;
              if (data[0].latitude && data[0].longitude) {
                position = new window.google.maps.LatLng(
                  data[0].latitude,
                  data[0].longitude
                );
              }
            }
          }
        } else {
          if (data.length > 1) {
            address = `${data[0].municipio}, SP, Brazil`;
          } else {
            address = `${data[0].municipio}, SP, Brazil`;
            if (data[0].latitude && data[0].longitude) {
              position = new window.google.maps.LatLng(
                data[0].latitude,
                data[0].longitude
              );
            }
          }
        }
      }

      debouncedCreateMarkers(data);
      if (
        filters.search ||
        filters.tipoImovel ||
        filters.dormitorios ||
        filters.gerenciaRegional ||
        filters.regiaoAdministrativa ||
        filters.regiaoDeGoverno
      ) {
        if (position) {
          mapInstance.current.setCenter(position);
          mapInstance.current.setZoom(11);
        } else {
          const geocoder = new window.google.maps.Geocoder();
          geocoder
            .geocode({ address })
            .then((res) => {
              if (res.results[0]) {
                mapInstance.current.setCenter(res.results[0].geometry.location);
                mapInstance.current.setZoom(11);
              }
            })
            .catch((err) => {
              console.error("Erro ao geocodificar município:", err);
            });
        }
      }
    } else {
      // nenhum filtro -> usa localização do usuário
      if (mapInstance.current && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const { latitude, longitude } = pos.coords;
            mapInstance.current.setCenter({ lat: latitude, lng: longitude });
            mapInstance.current.setZoom(10);
          },
          (err) => {
            console.warn("Erro ao obter localização do usuário:", err);
            // fallback: centro de SP
            mapInstance.current.setCenter({ lat: -23.55052, lng: -46.633308 });
            mapInstance.current.setZoom(10);
          }
        );
      }
    }
  }, [filters, rawData, statusObra, mapInstance]);

  const handleClick = async (status) => {
    setLoading(true);
    try {
      if (user.role === "sduh_mgr") {
        const data = await atendimentos(status);
        chargeData(data);
      }
      setStatusObra(status);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? <Loading /> : <></>}
      <Section>
        {user && user.role === "sduh_mgr" ? (
          <Section className="p-2 flex bg-white justify-between items-center">
            <Section className="flex items-center">
              <ButtonGroup
                defaultActive="Alertas"
                className="space-now-nowrap reports-buttons-responsive"
                onButtonClick={(status) => {
                  handleClick(status);
                }}
              >
                <Button status="planejamento" className="btn btn-white">
                  Planejamento
                </Button>
                <Button status="licitacao" className="btn btn-white ml-2">
                  Licitação
                </Button>
                <Button status="em_andamento" className="btn btn-white ml-2">
                  Em Andamento
                </Button>
                <Button status="entregues" className="btn btn-white ml-2">
                  Entregues
                </Button>
                <Button status="alertas" className="btn btn-red ml-2">
                  Alertas
                </Button>
              </ButtonGroup>
            </Section>
          </Section>
        ) : (
          <></>
        )}
        <Section className="font-normal f-size-small-nano container-last-updated-map">
          {lastUpdated ? (
            <>
              Atualizado em {formatDate(lastUpdated)} às{" "}
              {formatHour(lastUpdated)}
            </>
          ) : (
            <>Carregando...</>
          )}
        </Section>
      </Section>
      <div
        id="map"
        ref={mapRef}
        className={`map-container map-${user && user.role}`}
      ></div>
    </>
  );
}
