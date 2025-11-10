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
import { formatDate, formatHour, formatBRL, formatWhats } from "../utils/format";
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
    if (!empreendimentosData || !Array.isArray(empreendimentosData)) {
      console.warn(
        "⚠️ Nenhum dado válido recebido em createMarkers:",
        empreendimentosData
      );
      return [];
    }
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
        const contatosList = `<div class="mb-4">
                    <div class="font-bold">Entre em contato com a incorporadora:</div>
                    <div class="flex justify-center mt-2">
                    ${
                        item.contatosAtendimento &&
                        item.contatosAtendimento.length > 0
                          ? item.contatosAtendimento
                              .map(
                                (contato, index) => `
                                <button type="button" class="btn btn-green w-auto mr-2" onclick="window.open('${formatWhats(contato.celular)}')"><i class="fab fa-whatsapp"></i>Whatsapp ${index+1}</button>`
                              )
                              .join(" ")
                          : "N/A"
                      }  
                      
                    </div>
                  </div>`;

        const enderecosAtendimento = `
                  <div>
                    <div class="font-bold">Endereços de atendimento:</div>
                    <div class="mt-2">
                      ${
                        item.enderecosAtendimento &&
                        item.enderecosAtendimento.length > 0
                          ? item.enderecosAtendimento
                              .map(
                                (enderecoAtendimento, index) => `
                            <div class="item-endereco-map mb-2 title="${enderecoAtendimento.tipoLogradouro} ${enderecoAtendimento.logradouro} ${enderecoAtendimento.logradouro} N° ${enderecoAtendimento.numero}"">
                              <i class="fas fa-map-marker-alt mr-2 icon-card-report-item mr-2" /></i>
                              <span>${enderecoAtendimento.tipoLogradouro} ${enderecoAtendimento.logradouro} ${enderecoAtendimento.logradouro} N° ${enderecoAtendimento.numero} </span>
                            </div>`
                              )
                              .join(" ")
                          : "N/A"
                      }                      
                    </div>
                  </div>`;

        const infoWindow = new window.google.maps.InfoWindow(
          user.role === "sduh_mgr"
            ? {
                content: `
        <div class="card-container p-2 bg-white rounded-2xl shadow shadow-none">
          <div class="card-nav-tab flex font-bold justify-between">
              <div class="tab-nav w-50 text-center p-2 active">Atendimento</div>
          </div>
          <div class="tab-1 card-info-map active-left p-2">
            <div class="card-map-infos mb-2">
              <div class="card-map-item mr-2">
                <span class="container-icone-card-map">
                  <i class="fas fa-map-marker-alt mr-2 icon-card-report-item" /></i>
                </span>
                <div class="card-map-item-infos">
                  <div class="label">Gerencia Regional</div>
                  <div class="label">${item.gerenciaRegional ?? "N/A"}</div>
                </div>
              </div>
            </div>
            <div class="card-map-infos mb-2">
              <div class="card-map-item mr-2">
                <span class="container-icone-card-map">
                  <i class="fas fa-city mr-2 icon-card-report-item" /></i>
                </span>
                <div class="card-map-item-infos">
                  <div class="label">Município</div>
                  <div class="label">${item.municipio ?? "N/A"}</div>
                </div>
              </div>
            </div>
            <div class="card-map-infos mb-2">
              <div class="card-map-item mr-2">
                <span class="container-icone-card-map">
                  <i class="fas fa-building mr-2 icon-card-report-item" /></i>
                </span>
                <div class="card-map-item-infos">
                  <div class="label">Região de Governo</div>
                  <div class="label">${item.regiaoDeGoverno ?? "N/A"}</div>
                </div>
              </div>
            </div>
            <div class="card-map-infos mb-2">
              <div class="card-map-item mr-2">
                <span class="container-icone-card-map">
                  <i class="fas fa-home mr-2 icon-card-report-item" /></i>
                </span>
                <div class="card-map-item-infos">
                  <div class="label">Região Administrativa</div>
                  <div class="label">${item.regiaoAdministrativa ?? "N/A"}</div>
                </div>
              </div>
            </div>

            <div class="card-map-infos mt-4">
              <div class="card-map-infos-more">
                <div class="font-bold">Casa Paulista - Crédito Imobiliário</div>
                <div class="label">INVESTIMENTO ENTREGUE</div>
                <div class="value">${
                  formatBRL(item.investEntregue) ?? "N/A"
                }</div>
               <div class="flex justify-end mt-2">
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
        </div>
        `,
              }
            : {
                content: `
          <div class="card-container p-2 bg-white rounded-2xl shadow shadow-none">
          <div class="card-nav-tab flex font-bold justify-between">
              <div class="tab-nav w-50 text-center p-2 active" id="empreendimento">Empreendimento</div>
              <div class="tab-nav w-50 text-center p-2" id="incorporadora">Incorporadora</div>
          </div>
          <div class="tab-1 card-info-map active-left p-2">
            <div class="card-map-infos">
              <div class="card-map-item mr-2">
                <span class="container-icone-card-map">
                  <i class="fas fa-building mr-2 icon-card-report-item" /></i>
                </span>
                <div class="card-map-item-infos">
                  <div class="label">TIPO</div>
                  <div class="value">${item.tipologia ?? "N/A"}</div>
                </div>
              </div>
              <div class="card-map-item">
                <span class="container-icone-card-map">
                  <i class="fas fa-bed mr-2 icon-card-report-item" /></i>
                </span>
                <div class="card-map-item-infos">
                  <div class="label">DORMITÓRIOS</div>
                  <div class="value">${item.qtDormitorio ?? "N/A"}</div>
                </div>
              </div>
              <div class="card-map-item ml-2">
                <span class="container-icone-card-map">
                  <i class="fas fa-building mr-2 icon-card-report-item" /></i>
                </span>
                <div class="card-map-item-infos">
                  <div class="label">DISPONÍVEIS</div>
                  <div class="value">${item.unidadesSubsidiadas ?? "N/A"}</div>
                </div>
              </div>
            </div>

            <div class="card-map-infos mt-4">
              <div class="card-map-infos-more">
                <div class="font-bold">Casa Paulista - Crédito Imobiliário</div>
                <div class="label">VALOR DO BENEFÍCIO</div>
                <div class="value">${
                  formatBRL(item.subsidioEstadual) ?? "N/A"
                }</div>

               <div class="flex justify-end mt-2">
                <span class="card-info-item card-info-item-url">
                  <a href="https://www.habitacao.sp.gov.br/habitacao/institucional/nossos_servicos/programa-casa-paulista/cidadao" target="_blank" class="item-info-url">Clique para ir ao site do programa
                  <i class="fas fa-external-link-square-alt ml-1" /></i>
                  </a>
                </span>
               </div>
               <div class="flex justify-end mt-2">
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
            <div class="tab-2 card-info-map active-right p-2">
                  ${contatosList}
                  ${enderecosAtendimento}
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

              const headInfoWindow = document.querySelector(".gm-style-iw-ch");

              if (user.role != "sduh_mgr") {
                headInfoWindow.innerHTML = `<div class="font-bold">${item.nomeEmpreendimento}</div>`;

                const empreendimento = document.getElementById("empreendimento")
                const incorporadora = document.getElementById("incorporadora")
                empreendimento.addEventListener('click', (event) => {
                  empreendimento.classList.add('active')
                  incorporadora.classList.remove('active')
                  document.querySelector(".tab-2").style.display = 'none'
                  document.querySelector(".tab-1").style.display = 'block'
                })
                incorporadora.addEventListener('click', (event) => {
                  empreendimento.classList.remove('active')
                  incorporadora.classList.add('active')
                  document.querySelector(".tab-1").style.display = 'none'
                  document.querySelector(".tab-2").style.display = 'block'
                })
              } else {
                headInfoWindow.innerHTML = `<div class="font-bold">${item.atendimentoHabitacional}</div>`;
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
    if (!user || !rawData) return;

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

      debouncedCreateMarkers(data || []);
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
