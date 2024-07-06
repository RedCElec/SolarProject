import type { BuildingInsights } from '../types/BuildingInsights';
import { ImageryQuality } from '../types/ImageryQuality';
import { LatLng } from '../types/LatLng';
import { DataLayerView } from '../types/DataLayerView';
import { DataLayerKeys, DataLayers } from '../types/LayersType';

//GeoTiff import
import * as geotiff from 'geotiff';
import * as geokeysToProj4 from 'geotiff-geokeys-to-proj4';
import proj4 from 'proj4';

export type FindClosestBuildingInsightsParameters = {
  location: LatLng;
  requiredQuality?: ImageryQuality;
};
export type GetDataLayersParameters = {
  location: LatLng;
  radiusMeters: number;
  view: DataLayerView;
  requiredQuality?: ImageryQuality;
  pixelSizeMeters?: number;
};
export interface Bounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface GeoTiff {
  width: number;
  height: number;
  rasters: Array<number>[];
  bounds: Bounds;
}
//May be change --> or not ??
export async function findClosestBuildingInsights(
  query: FindClosestBuildingInsightsParameters,
): Promise<BuildingInsights> {
  const apiKeyOrProxyUrl = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const url = new URL('/v1/buildingInsights:findClosest', 'https://solar.googleapis.com/');

  if (typeof apiKeyOrProxyUrl === 'string') url.searchParams.set('key', apiKeyOrProxyUrl);
  else url.host = apiKeyOrProxyUrl.host;

  url.searchParams.set('location.latitude', query.location.latitude.toString());
  url.searchParams.set('location.longitude', query.location.longitude.toString());

  if (query.requiredQuality) url.searchParams.set('requiredQuality', query.requiredQuality);

  const response = await fetch(url);

  if (!response.ok)
    throw new Error('Google Maps Solar API returned a not-OK response: ' + response.status + ' ' + response.statusText);

  return await response.json();
}
export async function getDataLayerUrls(location: LatLng, radiusMeters: number): Promise<DataLayers> {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const args = {
    'location.latitude': location.latitude.toFixed(5),
    'location.longitude': location.longitude.toFixed(5),
    radius_meters: radiusMeters.toString(),
  };
  console.log('GET dataLayers\n', args);
  const params = new URLSearchParams({ ...args, key: apiKey });
  return fetch(`https://solar.googleapis.com/v1/dataLayers:get?${params}`).then(async (response) => {
    const content = await response.json();
    if (response.status != 200) {
      console.error('getDataLayerUrls\n', content);
      throw content;
    }
    console.log('dataLayersResponse', content);
    return content;
  });
}
export async function downloadGeoTIFF(url: string): Promise<GeoTiff> {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  console.log(`Downloading data layer: ${url}`);

  // Include your Google Cloud API key in the Data Layers URL.
  const solarUrl = url.includes('solar.googleapis.com') ? url + `&key=${apiKey}` : url;
  const response = await fetch(solarUrl);
  if (response.status != 200) {
    const error = await response.json();
    console.error(`downloadGeoTIFF failed: ${url}\n`, error);
    throw error;
  }

  // Get the GeoTIFF rasters, which are the pixel values for each band.
  const arrayBuffer = await response.arrayBuffer();
  const tiff = await geotiff.fromArrayBuffer(arrayBuffer);
  const image = await tiff.getImage();
  const rasters = await image.readRasters();

  // Reproject the bounding box into lat/lon coordinates.
  const geoKeys = image.getGeoKeys();
  const projObj = geokeysToProj4.toProj4(geoKeys);
  const projection = proj4(projObj.proj4, 'WGS84');
  const box = image.getBoundingBox();
  const sw = projection.forward({
    x: box[0] * projObj.coordinatesConversionParameters.x,
    y: box[1] * projObj.coordinatesConversionParameters.y,
  });
  const ne = projection.forward({
    x: box[2] * projObj.coordinatesConversionParameters.x,
    y: box[3] * projObj.coordinatesConversionParameters.y,
  });

  return {
    // Width and height of the data layer image in pixels.
    // Used to know the row and column since Javascript
    // stores the values as flat arrays.
    width: rasters.width,
    height: rasters.height,
    // Each raster reprents the pixel values of each band.
    // We convert them from `geotiff.TypedArray`s into plain
    // Javascript arrays to make them easier to process.
    rasters: [...Array(rasters.length).keys()].map((i) => Array.from(rasters[i] as geotiff.TypedArray)),
    // The bounding box as a lat/lon rectangle.
    bounds: {
      north: ne.y,
      south: sw.y,
      east: ne.x,
      west: sw.x,
    },
  };
}

export async function getGeoTiffArray(location: LatLng, radiusMeters: number) {
  const arrayOfGeoTiff: GeoTiff[] = [];

  const urlArray = await getDataLayerUrls(location, radiusMeters);

  const dataLayerValues = Object.values(DataLayerKeys);

  for (let i = 0; i < dataLayerValues.length; i++) {
    var url = urlArray[dataLayerValues[i]];
    if (!Array.isArray(url) && url !== undefined) {
      const geoTiffRes = await downloadGeoTIFF(url);
      arrayOfGeoTiff.push(geoTiffRes);
    } else {
      console.log('the following Url could not be retrieved: ', url);
    }
  }

  return arrayOfGeoTiff;
}
