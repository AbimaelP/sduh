import { useEffect, useRef, useState } from "react";
import debounce from "lodash/debounce";
import DropDownItem from "./DropDownItem";
import { empreendimentos, ultimaAtualizacao } from "../services/api/api";
import ButtonGroup from "./ButtonGroup";
import Button from "./Button";
import "../assets/css/maps.css";
import "../assets/css/report.css";
import { useAuth } from "../contexts/AuthContext";
import { useFilters } from "../contexts/FiltersContext";
import Section from './Section';
import Icon from './Icon';
import { formatDate, formatHour, formatBRL } from '../utils/format'
import open from '../utils/open';
import { normalize } from '../utils/format';
import Loading from './Loading';

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
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [allEmpreendimentos, setAllEmpreendimentos] = useState([]);
  const [listaEmpreendimentos, setListaEmpreendimentos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeButton, setActiveButton] = useState(null);
  const [markers, setMarkers] = useState([]);
  const markerDivs = useRef([]);
  const { filters, setOptionsFromData } = useFilters();
  const openInfoWindowRef = useRef(null);
  const [lastUpdated, setLastUpdated] = useState(null)

 useEffect(() => {
  const loadGoogleMapsScript = () => {
    return new Promise((resolve, reject) => {
      if (window.google && window.google.maps) {
        resolve();
        return;
      }

      // já existe um script carregando?
      if (document.querySelector(`script[src*="maps.googleapis.com/maps/api/js"]`)) {
        const existingScript = document.querySelector(`script[src*="maps.googleapis.com/maps/api/js"]`);
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
  };

  loadGoogleMapsScript()
    .then(() => setMapsLoaded(true))
    .catch(() => console.error("Erro ao carregar Google Maps"));
}, []);

const debouncedCreateMarkers = useRef(
  debounce(async (data) => {
    try {
      await createMarkers(data);
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }, 500) // 300ms após o último caractere digitado
).current;

useEffect(() => {
  setLoading(true)
  let data = [...allEmpreendimentos];

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

  setListaEmpreendimentos(data);
  debouncedCreateMarkers(data);

  if ((filters.search || filters.tipoImovel || filters.dormitorios) && data.length > 0) {
    if (mapInstance.current) {
      let address = `SÃO PAULO, SP, Brazil`;
      let position = null;
      if (data.length > 0) {
        if (filters.search) {
          if (data.length > 1) {
            address = `${data[0].municipio}, SP, Brazil`;
          } else {
            address = `${data[0].cep ?? ""} ${data[0].enderecoEmpreendimento ?? ""}, ${data[0].municipio}, SP, Brazil`;
            if (data[0].latitude && data[0].longitude) {
              position = new window.google.maps.LatLng(data[0].latitude, data[0].longitude);
            }
          }
        }
      }

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
}, [filters, allEmpreendimentos]);

  const createMarkers = async (empreendimentosData) => {
  if (!mapInstance.current || !window.google) return [];

  // limpa marcadores antigos
  markers.forEach((marker) => marker.setMap(null));
  markerDivs.current.forEach((div) => {
    if (div && div.parentNode) div.parentNode.removeChild(div);
  });
  markerDivs.current = [];

  const promises = empreendimentosData.map(async (item) => {
    const { cep, municipio, tipologia, qtDormitorio, enderecoEmpreendimento, unidadesSubsidiadas, subsidioEstadual, nomeEmpreendimento } = item;
    const address = `${item.cep || ''} ${item.enderecoEmpreendimento || ''}, ${item.municipio}, SP, Brazil`;

    try {
      if (!item.latitude || !item.longitude) return null;

      const position = new window.google.maps.LatLng(item.latitude, item.longitude);

      const infoWindow = new window.google.maps.InfoWindow({
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
                  <span class="item-info-detail" title="${item.enderecoEmpreendimento}">
                    ${item.enderecoEmpreendimento ?? 'N/A'}
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
                  <span class="item-info-detail">${item.municipio ?? 'N/A'}</span>
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
                  <span class="item-info-detail">${item.qtDormitorio ?? 'N/A'}</span>
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
                  <span class="item-info-detail">${item.tipologia ?? 'N/A'}</span>
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
                  <span class="item-info-detail">${formatBRL(item.subsidioEstadual) ?? 'N/A'}</span>
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
                  <span class="item-info-detail">${item.unidadesSubsidiadas ?? 'N/A'}</span>
                </div>
              </div>
            </div>

            <div class="card-item ">
              <div class="flex">
                <span class="container-icone-card-report">
                  <i class="fas fa-info-circle mr-2 f-size-small icon-card-report-item" /></i>
                  </span>
                <div class="card-info-item">
                  <span class="item-info-title-map">Endereço para Atendimento:</span>
                  <span class="item-info-detail" title="${item.enderecosAtendimento}">
                    ${item.enderecosAtendimento ?? 'N/A'}
                  </span>
                </div>
              </div>
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

            <div class="w-full flex justify-center">
              <button class="btn btn-green font-bold-important ${!item.contatosAtendimento && 'no-event-click btn-disabled'}" onclick="window.open('https://wa.me?phone=${item.contatosAtendimento}')">
                Fale pelo Whatsapp
              </button>
            </div>
          </div>
        </div>
        `,
      });

      const overlay = new window.google.maps.OverlayView();

      overlay.onAdd = function () {
        const div = document.createElement("div");
        div.innerHTML = `
          <div class='custom-marker-icon' style='background-color: ${iconsMap[tipologia]?.color || "gray"};'>
            <i class='${iconsMap[tipologia]?.icon || "fas fa-map-marker-alt"} map-marker-icon'></i>
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

        window.google.maps.event.addListenerOnce(infoWindow, "domready", () => {
          const btn = document.getElementById("streetview-btn");
          if (btn) {
            btn.addEventListener("click", () => {
              const streetView = mapInstance.current.getStreetView();
              streetView.setPosition(position);
              streetView.setPov({ heading: 100, pitch: 0 });
              streetView.setVisible(true);
            });
          }
        });
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
  if (!mapsLoaded) return;

  async function initializeApp() {
    if (!window.google) return console.error("Google Maps script não carregado!");

    const { Map } = await window.google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await window.google.maps.importLibrary("marker");

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
      });
    };

    navigator.geolocation.getCurrentPosition(
      (pos) => initMap({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => {
        console.warn("Não foi possível obter localização, usando fallback:", err);
        initMap({ lat: -22.5, lng: -48.5 });
      }
    );
  }

  initializeApp();
}, [mapsLoaded]);

useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try {
      let data = await empreendimentos('');
      setOptionsFromData(data);
      let lastUpdatedData = await ultimaAtualizacao();

      setAllEmpreendimentos(data);
      setLastUpdated(lastUpdatedData);
      
      await createMarkers(data);
    } catch (err) {
      console.error("Erro ao carregar empreendimentos:", err.message);
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    fetchData();
  }
}, [user, mapsLoaded]);

  const handleClick = async (status) => {
    setLoading(true);
    try {
      let data = await empreendimentos(status);
      setAllEmpreendimentos(data);
      await createMarkers(data);
    } catch (err) {
      console.error("Erro ao buscar empreendimentos:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      { loading ? <Loading /> : <></> }
      <Section>
        {user && user.role === "sduh_mgr" ? (
          <Section className="p-2 flex bg-white justify-between items-center">
            <Section className="flex items-center">
              <ButtonGroup
                defaultActive="Alertas"
                className='space-now-nowrap'
                onButtonClick={(status) => { handleClick(status) }}
                >
                <Button status="EM PLANTA" className="btn btn-white">Planejamento</Button>
                <Button status="LANÇAMENTO" className="btn btn-white ml-2">Licitação</Button>
                <Button status="EM CONSTRUÇÃO" className="btn btn-white ml-2">Em Andamento</Button>
                <Button status="CONSTRUÍDO" className="btn btn-white ml-2">Entregues</Button>
                <Button status="Alertas" className="btn btn-red ml-2">Alertas</Button>
              </ButtonGroup>
            </Section>
            <DropDownItem
              title="Camadas"
              classNameHeader="btn-dropdown-maps"
              icon="fas fa-layer-group mr-2"
            />
          </Section>
        ) : (
          <></>
        )}
      <Section className="font-normal f-size-small-nano container-last-updated-map">{lastUpdated ? <>Atualizado em {formatDate(lastUpdated)} às {formatHour(lastUpdated)}</>: <>Carregando...</>}</Section>
      </Section>
      <div id="map" ref={mapRef} className={`map-container map-${user && user.role}`}></div>
    </>
  );
}
