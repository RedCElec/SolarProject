import { CtxType, address } from '../components/ContextProvider';

export function getZoom(ctx: CtxType): number {
  if (ctx.buildingInsightsCtx) {
    const ne = ctx.buildingInsightsCtx!.boundingBox.ne;
    const sw = ctx.buildingInsightsCtx!.boundingBox.sw;

    let diameter = google.maps.geometry.spherical.computeDistanceBetween(
      new google.maps.LatLng(ne.latitude, ne.longitude),
      new google.maps.LatLng(sw.latitude, sw.longitude),
    );
    //const radius = Math.ceil(diameter / 2);

    if (diameter > 22) diameter = 22;

    return diameter;
  }
  //default value will be 18
  return 18;
}

export async function relocateMap(ctx: CtxType) {
  if (!ctx.mapCtx || !ctx.buildingInsightsCtx) return;

  const zoomValue: number = getZoom(ctx);

  ctx.mapCtx.moveCamera({
    zoom: zoomValue,
    center: {
      lat: ctx.buildingInsightsCtx?.center.latitude,
      lng: ctx.buildingInsightsCtx?.center.longitude,
    },
  });
}

export const extractAddress = (place: google.maps.places.PlaceResult, ctx: CtxType): address => {
  const address = ctx.geo;

  if (!Array.isArray(place?.address_components)) {
    return address;
  }
  // WARNING STATE to be managed (particularly prototype.includes)
  place.address_components.forEach((component) => {
    const types = component.types;
    const value = component.long_name;

    if (types.includes('locality')) {
      address.city = value;
    }

    if (types.includes('administrative_area_level_2')) {
      address.state = value;
    }

    if (types.includes('postal_code')) {
      address.zip = value;
    }

    if (types.includes('country')) {
      address.country = value;
    }

    if (place?.geometry?.location) {
      address.lat = place?.geometry?.location?.lat();
      address.lng = place?.geometry?.location?.lng();
    }
  });

  return address;
};
