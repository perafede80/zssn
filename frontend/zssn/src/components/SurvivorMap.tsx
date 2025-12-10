// import React from "react";
// import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
// import "leaflet/dist/leaflet.css";

// const zealandBounds: [[number, number], [number, number]] = [
//     [55.3, 11.5],  // Southwest corner
//     [55.9, 12.9]   // Northeast corner
// ];

// const survivors = [
//     { id: 1, name: "Alice", lat: 55.6761, lng: 12.5683 }, // Copenhagen
//     { id: 2, name: "Bob", lat: 55.4038, lng: 11.7899 }, // Near Zealand
// ];

// const MapView: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
//     const map = useMap();
//     map.setView(center, zoom);
//     return null;
// };

// const SurvivorMap: React.FC = () => {
//     return (
//         <MapContainer
//             style={{ height: "400px", width: "100%" }}
//             bounds={zealandBounds} // Restrict movement to Zealand
//         >
//             {/* Set initial center using a separate component */}
//             <MapView center={[55.6761, 12.5683]} zoom={8} />

//             <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

//             {survivors.map((s) => (
//                 <Marker key={s.id} position={[s.lat, s.lng]}>
//                     <Popup>{s.name}</Popup>
//                 </Marker>
//             ))}
//         </MapContainer>
//     );
// };

// export default SurvivorMap;
export {};
