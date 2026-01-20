import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

interface SalinityPoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
  salinity: number;
  status: "safe" | "warning" | "danger";
  updatedAt: string;
}

// Sample salinity data points in Mekong Delta
const sampleData: SalinityPoint[] = [
  { id: "1", name: "Cửa Tiểu", lat: 10.2167, lng: 106.7333, salinity: 8.5, status: "danger", updatedAt: "2024-01-20T08:00:00Z" },
  { id: "2", name: "Cửa Đại", lat: 10.2500, lng: 106.6833, salinity: 6.2, status: "warning", updatedAt: "2024-01-20T08:00:00Z" },
  { id: "3", name: "Bến Tre", lat: 10.2417, lng: 106.3750, salinity: 4.1, status: "warning", updatedAt: "2024-01-20T08:00:00Z" },
  { id: "4", name: "Trà Vinh", lat: 9.9347, lng: 106.3422, salinity: 2.8, status: "safe", updatedAt: "2024-01-20T08:00:00Z" },
  { id: "5", name: "Sóc Trăng", lat: 9.6033, lng: 105.9800, salinity: 5.5, status: "warning", updatedAt: "2024-01-20T08:00:00Z" },
  { id: "6", name: "Bạc Liêu", lat: 9.2833, lng: 105.7167, salinity: 7.8, status: "danger", updatedAt: "2024-01-20T08:00:00Z" },
  { id: "7", name: "Cà Mau", lat: 9.1769, lng: 105.1500, salinity: 9.2, status: "danger", updatedAt: "2024-01-20T08:00:00Z" },
  { id: "8", name: "Kiên Giang", lat: 10.0125, lng: 105.0809, salinity: 3.5, status: "safe", updatedAt: "2024-01-20T08:00:00Z" },
  { id: "9", name: "Hậu Giang", lat: 9.7578, lng: 105.6414, salinity: 1.8, status: "safe", updatedAt: "2024-01-20T08:00:00Z" },
  { id: "10", name: "Vĩnh Long", lat: 10.2539, lng: 105.9722, salinity: 2.2, status: "safe", updatedAt: "2024-01-20T08:00:00Z" },
];

interface SalinityMapProps {
  className?: string;
  onPointClick?: (point: SalinityPoint) => void;
}

export function SalinityMap({ className, onPointClick }: SalinityMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapToken, setMapToken] = useState<string | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<SalinityPoint | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useLanguage();

  // Fetch Mapbox token from edge function
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const { data, error } = await supabase.functions.invoke("get-mapbox-token");
        if (error) throw error;
        if (data?.token) {
          setMapToken(data.token);
        }
      } catch (error) {
        console.error("Error fetching Mapbox token:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchToken();
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || !mapToken || map.current) return;

    mapboxgl.accessToken = mapToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/outdoors-v12",
      center: [105.8, 10.0], // Center on Mekong Delta
      zoom: 7,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Add markers for each salinity point
    sampleData.forEach((point) => {
      const markerColor = 
        point.status === "danger" ? "#ef4444" :
        point.status === "warning" ? "#f59e0b" :
        "#22c55e";

      const el = document.createElement("div");
      el.className = "salinity-marker";
      el.style.cssText = `
        width: 24px;
        height: 24px;
        background-color: ${markerColor};
        border: 3px solid white;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      `;

      const marker = new mapboxgl.Marker(el)
        .setLngLat([point.lng, point.lat])
        .addTo(map.current!);

      el.addEventListener("click", () => {
        setSelectedPoint(point);
        onPointClick?.(point);
      });
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [mapToken, onPointClick]);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "danger": return t("diagnosis.result.danger");
      case "warning": return t("diagnosis.result.warning");
      default: return t("diagnosis.result.safe");
    }
  };

  const getStatusVariant = (status: string): "destructive" | "secondary" | "default" => {
    switch (status) {
      case "danger": return "destructive";
      case "warning": return "secondary";
      default: return "default";
    }
  };

  if (isLoading) {
    return (
      <Card className={`border-2 ${className}`}>
        <CardContent className="h-[400px] flex items-center justify-center">
          <p className="text-muted-foreground">{t("map.loading")}</p>
        </CardContent>
      </Card>
    );
  }

  if (!mapToken) {
    return (
      <Card className={`border-2 ${className}`}>
        <CardContent className="h-[400px] flex items-center justify-center">
          <p className="text-muted-foreground">{t("map.unavailable")}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border-2 overflow-hidden ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          {t("map.title")}
          <Badge variant="outline">{t("map.realtime")}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 relative">
        <div ref={mapContainer} className="h-[400px] w-full" />
        
        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm p-3 rounded-lg border-2 shadow-lg">
          <p className="text-xs font-medium mb-2">{t("map.legend")}</p>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-xs">&lt; 4 g/L - {t("diagnosis.result.safe")}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="text-xs">4-7 g/L - {t("diagnosis.result.warning")}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-xs">&gt; 7 g/L - {t("diagnosis.result.danger")}</span>
            </div>
          </div>
        </div>

        {/* Selected Point Info */}
        {selectedPoint && (
          <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm p-3 rounded-lg border-2 shadow-lg max-w-[200px]">
            <button 
              onClick={() => setSelectedPoint(null)}
              className="absolute top-1 right-2 text-muted-foreground hover:text-foreground"
            >
              ×
            </button>
            <p className="font-medium text-sm">{selectedPoint.name}</p>
            <p className="text-2xl font-bold mt-1">{selectedPoint.salinity} g/L</p>
            <Badge variant={getStatusVariant(selectedPoint.status)} className="mt-2">
              {getStatusLabel(selectedPoint.status)}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
