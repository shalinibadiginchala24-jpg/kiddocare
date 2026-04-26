import React from 'react';
import MapView, { Marker } from 'react-native-maps';

export default function SafeMapView({ style, initialRegion, markers }: any) {
  return (
    <MapView style={style} initialRegion={initialRegion}>
      {markers && markers.map((m: any, index: number) => (
        <Marker 
          key={index} 
          coordinate={m.coordinate} 
          title={m.title} 
          description={m.description}
        >
          {m.customView || null}
        </Marker>
      ))}
    </MapView>
  );
}
