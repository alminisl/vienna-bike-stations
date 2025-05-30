import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { BikeStation } from "../types";
import { Wrench, Drum as Pump, Navigation2 } from "lucide-react";

interface MapProps {
  stations: BikeStation[];
}

const Map = ({ stations }: MapProps) => {
  const baseUrl = import.meta.env.BASE_URL;

  const createIcon = (type: string) => {
    const isAirPump = type.toLowerCase().includes("pumpe");

    return new Icon({
      iconUrl: `${baseUrl}${
        isAirPump ? "bicycle-pump.png" : "bicycle-pin(1).png"
      }`,
      iconSize: isAirPump ? [30, 30] : [40, 40],
      iconAnchor: isAirPump ? [15, 15] : [20, 40],
      popupAnchor: isAirPump ? [0, -15] : [0, -40],
      className: `marker-icon ${isAirPump ? "air-pump" : "tool-station"}`,
    });
  };

  const openNavigation = (latitude: number, longitude: number) => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    const appleMapsUrl = `maps://maps.apple.com/?daddr=${latitude},${longitude}`;

    if (isIOS) {
      const userChoice = window.confirm(
        'Möchten Sie Google Maps verwenden? Klicken Sie auf "Abbrechen" für Apple Maps.'
      );
      if (userChoice) {
        window.location.href = googleMapsUrl;
      } else {
        window.location.href = appleMapsUrl;
      }
    } else {
      window.open(googleMapsUrl, "_blank");
    }
  };

  return (
    <div className="w-full h-full">
      <MapContainer
        center={[48.2082, 16.3719]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {stations.map((station) => (
          <Marker
            key={station.id}
            position={[station.latitude, station.longitude]}
            icon={createIcon(station.type)}
          >
            <Popup className="sm:min-w-[280px]">
              <div className="max-w-xs">
                <h3 className="font-bold text-lg mb-2">{station.type}</h3>
                <p className="text-gray-600 mb-1">{station.address}</p>
                <p className="text-gray-600 mb-2">{station.postalCode} Wien</p>
                {station.operator && (
                  <p className="text-sm text-gray-500 mb-1">
                    Betreiber: {station.operator}
                  </p>
                )}
                {station.availabilityText && (
                  <p className="text-sm text-gray-500 mb-1">
                    {station.availabilityText}
                  </p>
                )}
                <div className="flex flex-col gap-2 mt-4">
                  <button
                    onClick={() =>
                      openNavigation(station.latitude, station.longitude)
                    }
                    className="flex items-center justify-center gap-2 w-full bg-green-500 text-white px-4 py-2 rounded-lg text-base font-medium hover:bg-green-600 transition-colors"
                  >
                    <Navigation2 className="w-4 h-4" />
                    Hier hinfahren
                  </button>
                  {station.website && (
                    <a
                      href={station.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-center text-blue-500 hover:text-blue-700 text-sm underline"
                    >
                      Website besuchen
                    </a>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;
