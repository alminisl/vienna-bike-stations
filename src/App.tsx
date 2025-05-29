import { useState, useEffect } from "react";
import { Drum as Pump } from "lucide-react";
import Map from "./components/Map";
import { BikeStation } from "./types";

function App() {
  const [stations, setStations] = useState<BikeStation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "tools" | "pumps">("all");
  const baseUrl = import.meta.env.BASE_URL;

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await fetch(`${baseUrl}RADSERVICEOGD.csv`);
        const text = await response.text();
        const rows = text.split("\n").slice(1); // Skip header row

        const parsedStations = rows
          .filter((row) => row.trim() !== "")
          .map((row) => {
            const columns = row.split(",");
            const point = columns[2].match(/POINT \(([-\d.]+ [-\d.]+)\)/);
            const [longitude, latitude] = point
              ? point[1].split(" ").map(Number)
              : [0, 0];

            return {
              id: columns[0],
              uniqueId: columns[3],
              type: columns[4],
              address: columns[5],
              postalCode: columns[6],
              website: columns[7],
              longitude,
              latitude,
              icon: columns[10],
              status: columns[11],
              operator: columns[12],
              availability: columns[13],
              availabilityText: columns[14]?.replace(/"/g, ""),
            };
          });

        setStations(parsedStations);
      } catch (error) {
        console.error("Error loading stations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStations();
  }, [baseUrl]);

  const filteredStations = stations.filter((station) => {
    if (filter === "all") return true;
    if (filter === "tools")
      return !station.type.toLowerCase().includes("pumpe");
    if (filter === "pumps") return station.type.toLowerCase().includes("pumpe");
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Lade Stationen...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-white shadow-sm p-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl font-bold text-gray-900 mb-4 sm:mb-0">
            Wiener Fahrrad-Servicestationen
          </h1>
          <div className="flex flex-wrap gap-2 mt-4 sm:mt-4">
            <button
              onClick={() => setFilter("tools")}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                filter === "tools"
                  ? "bg-red-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <img
                  src={`${baseUrl}support.png`}
                  alt="Tools"
                  className="w-4 h-4 invert"
                />
              </div>
              <span className="text-sm">Werkzeug</span>
            </button>
            <button
              onClick={() => setFilter("pumps")}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                filter === "pumps"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <img
                  src={`${baseUrl}bicycle-pump.png`}
                  alt="Air Pump"
                  className="w-4 h-4 invert"
                />
              </div>
              <span className="text-sm">Luftpumpe</span>
            </button>
            <button
              onClick={() => setFilter("all")}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg transition-colors ${
                filter === "all"
                  ? "bg-gray-800 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <span className="text-sm">Alle</span>
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1 relative">
        <Map stations={filteredStations} />
      </main>
    </div>
  );
}

export default App;
