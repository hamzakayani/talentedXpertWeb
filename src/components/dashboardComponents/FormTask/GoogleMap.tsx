"use client";

import { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";

interface GoogleMapProps {
  address: string;
}

const GoogleMap: React.FC<GoogleMapProps> = ({ address }) => {
  const mapRef = useRef<HTMLDivElement>(null);


  // process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
  useEffect(() => {
    const loader = new Loader({
      apiKey:  `${process.env.REACT_APP_GOOGLE_MAP_API_KEY}`,
      version: "weekly",
    });

    loader.load().then(() => {
      if (!mapRef.current) return;

      // Initialize geocoder
      const geocoder = new google.maps.Geocoder();

      geocoder.geocode({ address }, (results, status) => {
        console.log('results', results)
        if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
          const location = results[0].geometry.location;

          // Initialize map
          const map = new google.maps.Map(mapRef.current as HTMLElement, {
            center: location,
            zoom: 8,
          });

          // Add marker
          new google.maps.Marker({
            map,
            position: location,
          });
        } else {
          console.error(
            `Geocode was not successful for the following reason: ${status}`
          );
        }
      });
    });
  }, [address]);

  return (
    <div
      ref={mapRef}
      style={{
        height: "400px",
        width: "100%",
      }}
    />
  );
};

export default GoogleMap;
