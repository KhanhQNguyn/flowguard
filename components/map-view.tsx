"use client"

import { useApp } from "@/lib/app-context"

export function MapView() {
  const { sensors, mapLayers } = useApp()
  const activeSensors = sensors.filter((s) => mapLayers.sensors)

  return (
    <div className="relative w-full h-full bg-gray-100">
      {/* Google Maps Embed */}
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d62709.94449789505!2d106.69776565!3d10.7769305!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2svn!4v1705000000000!5m2!1sen!2svn"
        className="absolute inset-0 w-full h-full border-0"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />

      {/* Overlay Markers */}
      {mapLayers.sensors && (
        <div className="absolute inset-0 pointer-events-none">
          {activeSensors.map((sensor, i) => (
            <div
              key={sensor.id}
              className="absolute pointer-events-auto cursor-pointer"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + i * 10}%`,
              }}
            >
              <div
                className={`w-4 h-4 rounded-full border-2 border-white shadow-lg ${
                  sensor.status === "critical"
                    ? "bg-red-500 animate-pulse"
                    : sensor.status === "warning"
                      ? "bg-yellow-500"
                      : sensor.status === "offline"
                        ? "bg-gray-400"
                        : "bg-green-500"
                }`}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
