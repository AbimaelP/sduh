import { useEffect, useRef, useState } from "react";
import DropDownItem from "./DropDownItem";
import { empreendimentos } from "../services/api/api";
import ButtonGroup from "./ButtonGroup";
import "../assets/css/maps.css";
import { useAuth } from "../contexts/AuthContext";
import { useFilters } from "../contexts/FiltersContext";

const iconsMap = {
  APTO: { icon: "fas fa-building", color: "#8A2BE2" },
  CASA: { icon: "fas fa-home", color: "#28a745" },
  FAMÍLIA: { icon: "fas fa-users", color: "#FFA500" },
  LOTE: { icon: "fas fa-map", color: "rgba(226, 113, 43, 1)" },
  "CASA SOBREPOSTA": { icon: "fas fa-home", color: "#1e682fff" },
};

function formatBRL(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(value);
}


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
  const { filters } = useFilters();
  
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

  useEffect(() => {
    let data = [...allEmpreendimentos];

    // filtro de busca (endereço ou município)
    if (filters.search) {
      const term = filters.search.toLowerCase();
      data = data.filter(
        (item) =>
          item.enderecoEmpreendimento?.toLowerCase().includes(term) ||
          item.municipio?.toLowerCase().includes(term)
      );
    }

    // filtro de tipo de atendimento
    if (filters.tipoAtendimento) {
      data = data.filter(
        (item) => item.tipoAtendimento === filters.tipoAtendimento
      );
    }

    // filtro de tipo de imóvel
    if (filters.tipoImovel) {
      data = data.filter((item) => item.tipologia === filters.tipoImovel);
    }

    // filtro de dormitórios
    if (filters.dormitorios) {
      data = data.filter(
        (item) => String(item.qtDormitorio) === String(filters.dormitorios)
      );
    }

    setListaEmpreendimentos(data);
    createMarkers(data);
  }, [filters, allEmpreendimentos]);

  const createMarkers = async (empreendimentosData) => {
    if (!mapInstance.current || !window.google) return;

    // 🔥 limpa marcadores antigos
    markers.forEach((marker) => marker.setMap(null));
    markerDivs.current.forEach((div) => {
      if (div && div.parentNode) {
        div.parentNode.removeChild(div);
      }
    });
    markerDivs.current = [];

    const geocoder = new window.google.maps.Geocoder();

    const promises = empreendimentosData.map(async (item) => {
      const { cep, municipio, enderecoEmpreendimento, tipologia } = item;
      const address = `${cep}, ${enderecoEmpreendimento}`;
      try {
        const result = await geocoder.geocode({ address });
        if (!result.results[0]) return null;

        const position = result.results[0].geometry.location;

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
          <div class='info-window-content-map'>
            <h3>${item.nomeEmpreendimento}</h3>
            <p class='txt-infowindow'><strong>Município:</strong> ${municipio ?? 'N/A'}</p>
            <p class='txt-infowindow'><strong>Dormitórios:</strong> ${item.qtDormitorio ?? 'N/A'}</p>
            <p class='txt-infowindow'><strong>Endereço:</strong> ${enderecoEmpreendimento ?? 'N/A'}</p>
            <p class='txt-infowindow'><strong>Unidades:</strong> ${item.unidadesSubsidiadas ?? 'N/A'}</p>
            <p class='txt-infowindow'><strong>Valor do Benefício:</strong> ${formatBRL(item.subsidioEstadual) ?? 'N/A'}</p>
            <p class='txt-infowindow'><strong>Tipologia:</strong> ${tipologia ?? 'N/A'}</p>
            <p class='txt-infowindow'><strong>URL:</strong> www.url.com.br</p>
          </div>
        `,
        });

        const overlay = new window.google.maps.OverlayView();

        overlay.onAdd = function () {
          const div = document.createElement("div");
          div.innerHTML = `
          <div class='custom-marker-icon' 
            style='background-color: ${iconsMap[tipologia]?.color || "gray"};'>
            <i class='${
              iconsMap[tipologia]?.icon || "fas fa-map-marker-alt"
            } map-marker-icon'></i>
          </div>
        `;
          this.div = div;
          markerDivs.current.push(div); // 🔥 guarda referência ao div

          div.addEventListener("click", () => {
            infoWindow.setPosition(position);
            infoWindow.open({ map: mapInstance.current, anchor: null });
          });

          const panes = this.getPanes();
          panes.overlayMouseTarget.appendChild(div);
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
  };

  useEffect(() => {
    if (!mapsLoaded) return;
    
    async function initializeApp() {
      if (!window.google) {
        console.error("Google Maps script não carregado!");
        return;
      }

      const { Map } = await window.google.maps.importLibrary("maps");
      const { HeatmapLayer } = await window.google.maps.importLibrary(
        "visualization"
      );

      // cria o mapa
      mapInstance.current = new Map(mapRef.current, {
        center: { lat: -22.5, lng: -48.5 },
        zoom: 7,
        mapId: "a4e035e5a4e5272a", // ID do Google Cloud
        mapTypeControl: false,
        streetViewControl: false,
        zoomControl: true,
        fullscreenControl: false,
      });
    }

    initializeApp();
  }, [mapsLoaded]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let data = await empreendimentos(); // 'let' para poder reatribuir
        data = data.slice(0, 40); // limita a 10 itens
        setAllEmpreendimentos(data);
        createMarkers(data);
      } catch (err) {
        console.error("Erro ao carregar empreendimentos:", err.message);
      }
    };

    if (user && user.role === "cidadao") {
      fetchData();
    }
  }, [user, mapsLoaded]);

  const handleClick = async (status) => {
    setLoading(true);
    try {
      let data = await empreendimentos(status);
      data = data.slice(0, 40);
      setAllEmpreendimentos(data);
      createMarkers(data);
    } catch (err) {
      console.error("Erro ao buscar empreendimentos:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        {user && user.role === "sduh" ? (
          <div className="p-2 flex bg-white justify-between items-center">
            <div className="flex items-center">
              <ButtonGroup
                onButtonClick={handleClick}
                activeButton={activeButton}
                setActiveButton={setActiveButton}
              />
            </div>
            <DropDownItem
              title="Camadas"
              classNameHeader="btn-dropdown-maps"
              icon="fas fa-layer-group mr-2"
            />
          </div>
        ) : (
          <></>
        )}
      </div>
      <div id="map" ref={mapRef} className={`map-container map-${user && user.role}`}></div>
    </>
  );
}
