"use client";

import L from "leaflet";
import { useEffect } from "react";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const OSM_TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const OSM_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
const SYRIA_CENTER: [number, number] = [35.0, 38.5];

const markerIcon = L.divIcon({
  className: "osm-location-picker-marker",
  html: '<div style="width:22px;height:22px;border-radius:9999px;background:#009cc2;border:3px solid #fff;box-shadow:0 6px 18px rgba(0,0,0,.35)"></div>',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

export type LocationPickerValue = {
  lat: number;
  lng: number;
};

export type OsmLocationPickerProps = {
  value: LocationPickerValue | null;
  onChange: (value: LocationPickerValue) => void;
  className?: string;
};

function MapClickHandler({ onChange }: { onChange: (value: LocationPickerValue) => void }) {
  useMapEvents({
    click(event) {
      onChange({
        lat: Number(event.latlng.lat.toFixed(6)),
        lng: Number(event.latlng.lng.toFixed(6)),
      });
    },
  });

  return null;
}

function SelectedMarker({
  value,
  onChange,
}: {
  value: LocationPickerValue | null;
  onChange: (value: LocationPickerValue) => void;
}) {
  if (!value) return null;

  return (
    <Marker
      draggable
      eventHandlers={{
        dragend(event) {
          const marker = event.target as L.Marker;
          const next = marker.getLatLng();
          onChange({
            lat: Number(next.lat.toFixed(6)),
            lng: Number(next.lng.toFixed(6)),
          });
        },
      }}
      icon={markerIcon}
      position={[value.lat, value.lng]}
    />
  );
}

function RecenterOnSelection({ value }: { value: LocationPickerValue | null }) {
  const map = useMap();

  useEffect(() => {
    if (!value) return;
    map.setView([value.lat, value.lng], Math.max(map.getZoom(), 12), {
      animate: true,
    });
  }, [map, value]);

  return null;
}

function InvalidateMapSize() {
  const map = useMap();

  useEffect(() => {
    const run = () => map.invalidateSize({ animate: false });
    run();
    const t1 = window.setTimeout(run, 50);
    const t2 = window.setTimeout(run, 300);
    window.addEventListener("resize", run);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener("resize", run);
    };
  }, [map]);

  return null;
}

export default function OsmLocationPicker({
  value,
  onChange,
  className,
}: OsmLocationPickerProps) {
  return (
    <MapContainer
      center={value ? [value.lat, value.lng] : SYRIA_CENTER}
      zoom={value ? 12 : 7}
      className={className ?? "h-full min-h-[280px] w-full rounded-xl z-0"}
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom
    >
      <TileLayer attribution={OSM_ATTRIBUTION} url={OSM_TILE_URL} />
      <InvalidateMapSize />
      <MapClickHandler onChange={onChange} />
      <RecenterOnSelection value={value} />
      <SelectedMarker value={value} onChange={onChange} />
    </MapContainer>
  );
}
