import { Palette } from "../library/layer";
import { Bounds } from "../library/solar";
import { Date } from "./Date";
import { ImageryQuality } from "./ImageryQuality";

export type DataLayers = {
  imageryDate: Date;
  imageryProcessedDate: Date;
  dsmUrl?: string;
  rgbUrl?: string;
  maskUrl?: string;
  annualFluxUrl?: string;
  monthlyFluxUrl?: string;
  hourlyShadeUrls?: string[];
  imageryQuality: ImageryQuality;
};

export enum DataLayerKeys {
  DSMUrl = 'dsmUrl',
  RGBUrl = 'rgbUrl',
  MaskUrl = 'maskUrl',
  AnnualFluxUrl = 'annualFluxUrl',
  MonthlyFluxUrl = 'monthlyFluxUrl',
}

export type LayerId = "mask" | "dsm" | "annualFlux" | "monthlyFlux" //| "hourlyShade" ;

export interface Layer {
    id: LayerId;
    render: (showRoofOnly: boolean, month: number, day: number) => HTMLCanvasElement[];
    bounds: Bounds;
    palette?: Palette;
  }
