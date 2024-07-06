import { GeoTiff } from './solar';
import { renderPalette } from './visualize';
import { type LayerId } from '../types/LayersType';
import { binaryPalette, ironPalette, rainbowPalette } from './colors';

export interface Palette {
  colors: string[];
  min: string;
  max: string;
}
export interface Bounds {
  north: number;
  south: number;
  east: number;
  west: number;
}
export interface Layer {
  id: LayerId;
  render: (showRoofOnly: boolean, month: number, day: number) => HTMLCanvasElement[];
  bounds: Bounds;
  palette?: Palette;
}

// will be later move to utils files

export async function getLayerCanvas(geoTiffArray: GeoTiff[]): Promise<Record<LayerId, Layer>> {
  //get mask for
  async function renderMask(): Promise<Layer> {
    
    const mask = geoTiffArray[2]!;
    const colors = binaryPalette;
    return {
      id: 'mask',
      bounds: mask.bounds,
      palette: {
        colors: colors,
        min: 'No roof',
        max: 'Roof',
      },
      render: (showRoofOnly: boolean) => [
        renderPalette({
          data: mask,
          mask: showRoofOnly ? mask : undefined,
          colors: colors,
        }),
      ],
    };
  }
  async function dsm(): Promise<Layer> {
    const [mask, data] = [geoTiffArray[2], geoTiffArray[1]];
    const sortedValues = Array.from(data.rasters[0]).sort((x, y) => x - y);
    const minValue = sortedValues[0];
    const maxValue = sortedValues.slice(-1)[0];
    const colors = rainbowPalette;
    return {
      id: 'dsm',
      bounds: mask.bounds,
      palette: {
        colors: colors,
        min: `${minValue.toFixed(1)} m`,
        max: `${maxValue.toFixed(1)} m`,
      },
      render: (showRoofOnly) => [
        renderPalette({
          data: data,
          mask: showRoofOnly ? mask : undefined,
          colors: colors,
          min: sortedValues[0],
          max: sortedValues.slice(-1)[0],
        }),
      ],
    };
  }
  async function annualFlux(): Promise<Layer> {
    const [mask, data] = [geoTiffArray[2], geoTiffArray[3]];
    const colors = ironPalette;
    return {
      id: 'annualFlux',
      bounds: mask.bounds,
      palette: {
        colors: colors,
        min: 'Shady',
        max: 'Sunny',
      },
      render: (showRoofOnly) => [
        renderPalette({
          data: data,
          mask: showRoofOnly ? mask : undefined,
          colors: colors,
          min: 400,
          max: 1800,
        }),
      ],
    };
  }
  async function monthlyFlux(): Promise<Layer> {
    const [mask, data] = [geoTiffArray[2]!, geoTiffArray[4]];
    const colors = ironPalette;
    return {
      id: 'monthlyFlux',
      bounds: mask.bounds,
      palette: {
        colors: colors,
        min: 'Shady',
        max: 'Sunny',
      },
      render: (showRoofOnly) =>
        [...Array(12).keys()].map((month) =>
          renderPalette({
            data: data,
            mask: showRoofOnly ? mask : undefined,
            colors: colors,
            min: 0,
            max: 200,
            index: month,
          }),
        ),
    };
  }

  const get: Record<LayerId, Layer> = {
    mask: await renderMask(),
    dsm: await dsm(),
    annualFlux: await annualFlux(),
    monthlyFlux: await monthlyFlux(),
  };

  return get;
}
