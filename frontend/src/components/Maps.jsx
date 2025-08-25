import { useEffect, useRef, useState } from "react";
import DropDownItem from "./DropDownItem";
import { empreendimentos } from '../services/api/api';
import ButtonGroup from './ButtonGroup';
import '../assets/css/maps.css'
import { useAuth } from '../contexts/AuthContext';

export default function Maps() {
  const { user } = useAuth();
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [listaEmpreendimentos, setListaEmpreendimentos] = useState(null)
  const [loading, setLoading] = useState(false);
  const [activeButton, setActiveButton] = useState(null);
  const [markers, setMarkers] = useState([]);

  const createMarkers = async (empreendimentosData) => {
  if (!mapInstance.current || !window.google) return;

  // remove marcadores antigos
  markers.forEach((marker) => marker.setMap(null));
  const newMarkers = [];

  const geocoder = new window.google.maps.Geocoder();

  // cria todas as promises de geocoding
  const promises = empreendimentosData.map(async (item) => {
    const { cep, municipio } = item;
    const address = `${cep}, ${municipio}`;

    try {
      const result = await geocoder.geocode({ address });
      if (!result.results[0]) return null;

      const position = result.results[0].geometry.location;

      // OverlayView com ícone Font Awesome
      const overlay = new window.google.maps.OverlayView();
      overlay.onAdd = function () {
        const div = document.createElement("div");
        div.innerHTML = `<div class='custom-marker-icon'><i class='fas fa-home map-marker-icon'></i></div>`;
        this.div = div;
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
        if (this.div) this.div.parentNode.removeChild(this.div);
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
  }, []);


  const handleClick = async (status) => {
    setLoading(true);
    try {
      let data = await empreendimentos(status);
      data = data.slice(0, 10);
      setListaEmpreendimentos(data);
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
        { user && user.role === 'sduh' ? 
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
          : <></>
        }
      </div>
      <div id="map" ref={mapRef} className="w-full h-[calc(100vh-206px)]"></div>
    </>
  )
}
