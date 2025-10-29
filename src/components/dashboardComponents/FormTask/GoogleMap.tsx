"use client";

import { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";

interface GoogleMapProps {
  latitude?: number;
  longitude?: number;
  address?: string;
  onLocationSelect?: (
    lat: number,
    lng: number,
    address?: string,
    country?: string,
    state?: string,
    city?: string,
    zip?: string
  ) => void;
}

const GoogleMap: React.FC<GoogleMapProps> = ({
  latitude,
  longitude,
  address,
  onLocationSelect,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map>();
  const markerInstance = useRef<google.maps.Marker>();
  const geocoder = useRef<google.maps.Geocoder>();

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY as string,
      version: "weekly",
      libraries: ["places"],
    });

    loader
      .load()
      .then(async (google) => {
        if (!mapRef.current) return;

        const { Map } = (await google.maps.importLibrary(
          "maps"
        )) as google.maps.MapsLibrary;

        // Initialize geocoder once
        if (!geocoder.current) {
          geocoder.current = new google.maps.Geocoder();
        }

        // Default center to Toronto, Canada if no latitude/longitude is provided
        const startLat = latitude || 43.651070; // Toronto Latitude
        const startLng = longitude || -79.347015; // Toronto Longitude

        // Initialize map once
        if (!mapInstance.current) {
          mapInstance.current = new Map(mapRef.current, {
            center: { lat: startLat, lng: startLng },
            zoom: 8,
          });
        }

        // Initialize marker once
        if (!markerInstance.current) {
          markerInstance.current = new google.maps.Marker({
            map: mapInstance.current,
            position: { lat: startLat, lng: startLng },
          });
        }

        // Helper: parse address parts
        const parseAddress = (result: google.maps.GeocoderResult) => {
          let country, state, city, zip;
          result.address_components.forEach((comp) => {
            if (comp.types.includes("country")) country = comp.long_name;
            if (comp.types.includes("administrative_area_level_1")) state = comp.long_name;
            if (comp.types.includes("locality") || comp.types.includes("administrative_area_level_2")) {
              city = comp.long_name;
            }
            if (comp.types.includes("postal_code")) {
              zip = comp.long_name ?? comp.short_name ?? "";
            }
          });
          return { country, state, city, zip };
        };

        // Helper: update marker & geocode location
        const updateLocation = (lat: number, lng: number) => {
          markerInstance.current?.setPosition({ lat, lng });
          mapInstance.current?.setCenter({ lat, lng });

          if (geocoder.current) {
            geocoder.current.geocode(
              { location: { lat, lng } },
              (results, status) => {
                if (status === "OK" && results?.[0]) {
                  // console.log("Geocoded address:", results[0]);
                  const { country, state, city, zip } = parseAddress(results[0]);
                  onLocationSelect?.(
                    lat,
                    lng,
                    results[0].formatted_address,
                    country,
                    state,
                    city,
                    zip
                  );
                } else {
                  onLocationSelect?.(lat, lng);
                }
              }
            );
          }
        };

        // If address is provided → geocode once
        if (address) {
          geocoder.current.geocode({ address }, (results, status) => {
            if (status === "OK" && results?.[0]) {
              const loc = results[0].geometry.location;
              updateLocation(loc.lat(), loc.lng());
            }
          });
        }

        // Click listener (only one time)
        google.maps.event.clearListeners(mapInstance.current, "click");
        mapInstance.current.addListener("click", (event: google.maps.MapMouseEvent) => {
          if (event.latLng) {
            updateLocation(event.latLng.lat(), event.latLng.lng());
          }
        });

        // Try geolocation if no lat/lng/address provided
        if (!latitude && !longitude && !address && navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((pos) => {
            updateLocation(pos.coords.latitude, pos.coords.longitude);
          });
        }
      })
      .catch((error) => {
        console.error("Error loading Google Maps:", error);
      });
  }, [latitude, longitude, address, onLocationSelect]);

  // Extract postal code once
  const extractZip = (result: google.maps.GeocoderResult): string | undefined => {
    const postalComponent = result.address_components.find((comp) =>
      comp.types.includes("postal_code")
    );
    return postalComponent?.long_name;
  };

  return (
    <div
      ref={mapRef}
      style={{
        height: "400px",
        width: "100%",
        borderRadius: "10px",
        overflow: "hidden",
      }}
    />
  );
};

export default GoogleMap;
