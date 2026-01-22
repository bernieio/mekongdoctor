import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { SalinityPoint, salinityData } from "@/data/salinityData";

interface SalinityMapProps {
  className?: string;
  onPointClick?: (point: SalinityPoint) => void;
  selectedPoint?: SalinityPoint | null;
}

export function SalinityMap({ className, onPointClick, selectedPoint }: SalinityMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({});
  const [mapToken, setMapToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useLanguage();

  // Fetch Mapbox token
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
      cooperativeGestures: true // Better for scrollable pages
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Add markers
    salinityData.forEach((point) => {
      const el = document.createElement("div");
      el.className = "salinity-marker";
      updateMarkerStyle(el, point.status, false);

      const marker = new mapboxgl.Marker(el)
        .setLngLat([point.lng, point.lat])
        .addTo(map.current!);

      // Save marker ref
      markersRef.current[point.id] = marker;

      // Click event
      el.addEventListener("click", () => {
        onPointClick?.(point);
      });
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [mapToken, onPointClick]);

  // Handle expected selection changes (Focus & Highlight)
  useEffect(() => {
    if (!map.current) return;

    // Reset all markers styles
    salinityData.forEach(point => {
      const marker = markersRef.current[point.id];
      if (marker) {
        const el = marker.getElement();
        updateMarkerStyle(el, point.status, point.id === selectedPoint?.id);
      }
    });

    if (selectedPoint) {
      // Fly to location
      map.current.flyTo({
        center: [selectedPoint.lng, selectedPoint.lat],
        zoom: 9,
        essential: true,
        speed: 1.5
      });
    } else {
      // Optional: Reset view if selection cleared? 
      // User didn't explicitly ask for this, but it might be nice. 
      // Keeping it simple for now (no auto reset-view) as user might just want to browse slider.
    }

  }, [selectedPoint]);

  const updateMarkerStyle = (el: HTMLElement, status: string, isSelected: boolean) => {
    const color =
      status === "danger" ? "#ef4444" :
        status === "warning" ? "#f59e0b" :
          "#22c55e"; // green-500

    const size = isSelected ? "32px" : "24px";
    const zIndex = isSelected ? "10" : "1";
    const border = isSelected ? "4px solid white" : "3px solid white";

    el.style.cssText = `
        width: ${size};
        height: ${size};
        background-color: ${color};
        border: ${border};
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 4px 6px rgba(0,0,0,0.3);
        transition: all 0.3s ease;
        z-index: ${zIndex};
      `;
  }

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
      </CardContent>
    </Card>
  );
}
