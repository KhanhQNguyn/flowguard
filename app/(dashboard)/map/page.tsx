import { MapView } from "@/components/map-view"
import { MapSidebar } from "@/components/map-sidebar"

export default function MapPage() {
  return (
    <div className="h-[calc(100vh-5rem)] -m-4 lg:-m-6 flex">
      {/* Sidebar - Left */}
      <MapSidebar />

      {/* Map - Main Area */}
      <div className="flex-1 relative">
        <MapView />
      </div>
    </div>
  )
}
