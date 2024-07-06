import { useContext } from 'react';
import { Layer, LayerId } from '../../types/LayersType';
import { Ctx, CtxType } from '../ContextProvider';
import { getLayerCanvas } from '../../library/layer';
import { getGeoTiffArray } from '../../library/solar';
import { getZoom } from '../../library/mapManager';

export async function initMap(): Promise<google.maps.Map> {
  const { Map } = (await google.maps.importLibrary('maps')) as google.maps.MapsLibrary;
  const element = document.getElementById('map')!;
  const mapBuffer = new Map(element, {
    center: {
      //Change Location
      lat: 45.752731,
      lng: 4.8299539,
    },
    mapTypeId: 'satellite',
    tilt: 0,
    styles: [
      {
        featureType: 'all',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }],
      },
    ],
    zoom: 10,
  });
  return mapBuffer;
}

export async function getLayerContext(ctx: CtxType) {
  let layer: Record<LayerId, Layer>;
  if (!ctx.mapCtx) {
    console.log('no context');
    return;
  }

  if (!ctx.layer) {
    const geoTiffArray = await getGeoTiffArray(
      {
        latitude: ctx.geo.lat,
        longitude: ctx.geo.lng,
      },
      getZoom(ctx),
    )
      .then(async (arrayResponse) => {
        ctx.setLayer(arrayResponse);
        console.log(arrayResponse);
        return arrayResponse;
      })
      .catch((error) => console.log(error));

    layer = await getLayerCanvas(geoTiffArray!).then((res) => {
      return res;
    });
  } else {
    layer = await getLayerCanvas(ctx.layer).then((res) => {
      return res;
    });
  }
  return layer;
}
export async function displayLayer(ctx: CtxType, layerId: LayerId, showRoofParam: boolean) {
  let month = 3;
  let day = 24;

  let overlays: google.maps.GroundOverlay[] = [];
  const layer = await getLayerContext(ctx);

  if (!layer) return;

  const bounds = layer[layerId].bounds;
  ctx.setPalette(layer[layerId].palette);
  overlays.map((overlay) => overlay.setMap(null));
  overlays = layer[layerId]
    .render(showRoofParam, month, day)
    .map((canvas) => new google.maps.GroundOverlay(canvas.toDataURL(), bounds));

  if (!['monthlyFlux', 'hourlyShade'].includes(layer[layerId].id)) {
    overlays[0].setMap(ctx.mapCtx!);
  }
  //MONTHLY FLUX FAIRE GAFFE AU DEFILEMENT
  if (layer[layerId].id == 'monthlyFlux') {
    overlays.map((overlay, i) => overlay.setMap(i == month ? ctx.mapCtx! : null));
  }
  // FAUDRA FAIRE HOURLY EGALEMENT
  // else if (layer[layerId].id == 'hourlyShade') {
  //   overlays.map((overlay, i) => overlay.setMap(i == hour ? map : null));
  // }
  return true;
}

export default function NewMapManager() {
  const ctx = useContext(Ctx);
  if (!ctx.mapCtx) {
    initMap().then((mapBuffer) => {
      ctx.setMapCtx(mapBuffer);
    });
  }
  return <div className="p-4" id="map" style={{ width: '100%', height: '100%' }}></div>;
}
