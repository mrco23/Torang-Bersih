import React, { useRef, useEffect } from "react";
import { RiMapPinLine } from "react-icons/ri";

export const InteractiveMapPicker = ({ latitude, longitude, onChange }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerInstance = useRef(null);

  const defaultLat = 1.4748;
  const defaultLng = 124.842;

  useEffect(() => {
    let isMounted = true;

    const initMap = () => {
      if (!mapRef.current || mapInstance.current) return;
      const L = window.L;

      const initLat = latitude || defaultLat;
      const initLng = longitude || defaultLng;
      const zoomLvl = latitude ? 16 : 12;

      mapInstance.current = L.map(mapRef.current, {
        zoomControl: true,
        attributionControl: false,
      }).setView([initLat, initLng], zoomLvl);

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        {
          maxZoom: 19,
        },
      ).addTo(mapInstance.current);

      const customIcon = L.divIcon({
        className: "bg-transparent border-none",
        html: `<div style="transform: translate(-50%, -100%); width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; filter: drop-shadow(0px 6px 4px rgba(0,0,0,0.3));">
                 <svg width="36" height="36" viewBox="0 0 24 24" fill="#ef4444" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                   <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                   <circle cx="12" cy="10" r="3" fill="white"/>
                 </svg>
               </div>`,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      });

      markerInstance.current = L.marker([initLat, initLng], {
        draggable: true,
        icon: customIcon,
      }).addTo(mapInstance.current);

      markerInstance.current.on("dragend", (e) => {
        const pos = e.target.getLatLng();
        if (isMounted) onChange(pos.lat, pos.lng);
      });

      mapInstance.current.on("click", (e) => {
        markerInstance.current.setLatLng(e.latlng);
        if (isMounted) onChange(e.latlng.lat, e.latlng.lng);
      });
    };

    if (!window.L) {
      const css = document.createElement("link");
      css.rel = "stylesheet";
      css.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(css);

      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      initMap();
    }

    return () => {
      isMounted = false;
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      mapInstance.current &&
      markerInstance.current &&
      latitude &&
      longitude
    ) {
      const currentCenter = mapInstance.current.getCenter();
      if (
        Math.abs(currentCenter.lat - latitude) > 0.0001 ||
        Math.abs(currentCenter.lng - longitude) > 0.0001
      ) {
        mapInstance.current.setView([latitude, longitude], 16);
        markerInstance.current.setLatLng([latitude, longitude]);
      }
    }
  }, [latitude, longitude]);

  return (
    <div className="relative z-0 w-full overflow-hidden rounded-xl border border-gray-200 shadow-inner">
      <div
        ref={mapRef}
        className="z-0 h-[200px] w-full"
        style={{ zIndex: 1 }}
      />
      {!latitude && !longitude && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-white/40 backdrop-blur-[1px]">
          <div className="rounded-full bg-gray-900/70 px-3 py-1.5 text-[11px] font-bold text-white shadow-md">
            Geser peta atau klik untuk menandai lokasi
          </div>
        </div>
      )}
    </div>
  );
};
