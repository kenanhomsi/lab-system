"use client";

import L from "leaflet";
import { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { ContactBranch } from "@/lib/contact-branches";

const OSM_TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const OSM_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

const PIN = 26;
const BORDER = 3;
const SHELL = PIN + BORDER * 2;
const branchMarkerIcon = L.divIcon({
  className: "osm-branch-marker",
  html: `<div style="width:${PIN}px;height:${PIN}px;border-radius:9999px;background:#00647e;border:${BORDER}px solid #fff;box-shadow:0 4px 14px rgba(0,0,0,.35)"></div>`,
  iconSize: [SHELL, SHELL],
  iconAnchor: [SHELL / 2, SHELL / 2],
  popupAnchor: [0, -SHELL / 2 - 4],
});

function FitBounds({ branches }: { branches: ContactBranch[] }) {
  const map = useMap();

  useEffect(() => {
    if (branches.length === 0) return;
    const points = branches.map((b) => L.latLng(b.lat, b.lng));
    if (points.length === 1) {
      map.setView(points[0], 15);
    } else {
      map.fitBounds(L.latLngBounds(points), { padding: [48, 48], maxZoom: 15 });
    }
    requestAnimationFrame(() => map.invalidateSize());
  }, [map, branches]);

  return null;
}

/** Leaflet measures the container before layout is final; dynamic import needs a second pass. */
function InvalidateMapSize() {
  const map = useMap();

  useEffect(() => {
    const run = () => {
      map.invalidateSize({ animate: false });
    };
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

export type OsmBranchesMapProps = {
  branches: ContactBranch[];
  className?: string;
  openInOsmLabel?: string;
};

export default function OsmBranchesMap({
  branches,
  className,
  openInOsmLabel = "OpenStreetMap",
}: OsmBranchesMapProps) {
  const first = branches[0];
  const center: [number, number] = first
    ? [first.lat, first.lng]
    : [33.5138, 36.2765];

  return (
    <MapContainer
      center={center}
      zoom={13}
      className={className ?? "h-full min-h-[280px] w-full rounded-2xl z-0"}
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom={false}
    >
      <TileLayer attribution={OSM_ATTRIBUTION} url={OSM_TILE_URL} />
      <InvalidateMapSize />
      <FitBounds branches={branches} />
      {branches.map((b) => (
        <Marker key={b.id} position={[b.lat, b.lng]} icon={branchMarkerIcon}>
          <Popup>
            <div className="min-w-[200px] text-right font-sans text-sm">
              <p className="font-bold text-on-surface">{b.name}</p>
              <p className="mt-1 text-on-surface-variant">{b.address}</p>
              <a
                href={`https://www.openstreetmap.org/?mlat=${b.lat}&mlon=${b.lng}#map=16/${b.lat}/${b.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-primary underline"
              >
                {openInOsmLabel}
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
