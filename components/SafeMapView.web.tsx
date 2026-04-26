import React from 'react';
import { View } from 'react-native';

export default function SafeMapView({ style, initialRegion }: any) {
  const lat = initialRegion?.latitude || 37.78825;
  const lon = initialRegion?.longitude || -122.4324;
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lon-0.01}%2C${lat-0.01}%2C${lon+0.01}%2C${lat+0.01}&layer=mapnik&marker=${lat}%2C${lon}`;

  return (
    <View style={[style, { overflow: 'hidden' }]}>
      <iframe
        title="Safe Map"
        src={mapUrl}
        style={{ width: '100%', height: '100%', border: 'none' }}
      />
    </View>
  );
}
