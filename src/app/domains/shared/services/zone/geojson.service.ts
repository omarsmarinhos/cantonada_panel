import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GeojsonService {

  jsonToLatLngLiteral(geoJson: any): google.maps.LatLngLiteral[] {
    const parsedGeojson = JSON.parse(geoJson);  // Parseamos el GeoJSON
    
    // Verificamos que el GeoJSON esté en el formato adecuado
    if (parsedGeojson.geometry && parsedGeojson.geometry.type === 'Polygon' && parsedGeojson.geometry.coordinates) {
      // Accedemos al primer anillo del polígono
      const coordinates = parsedGeojson.geometry.coordinates[0];  // Accedemos al primer arreglo de coordenadas (el anillo exterior)

      // Convertimos las coordenadas al formato correcto para Google Maps
      return coordinates.map((coord: number[]) => ({
        lat: coord[1], // Latitud es el segundo valor en el par [long, lat]
        lng: coord[0]  // Longitud es el primer valor en el par [long, lat]
      }));
    } else {
      console.error('GeoJSON no válido o formato inesperado', geoJson);
      return [];  // Retornamos un arreglo vacío si el formato es incorrecto
    }
  }
}
