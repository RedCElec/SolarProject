import React, { useState, createContext, ReactNode } from 'react';
import { BuildingInsights } from '../types/BuildingInsights';
import { GeoTiff } from '../library/solar';
import { Palette } from '../library/layer';

export interface address {
  city: string;
  zip: string;
  state: string;
  country: string;
  //Maybe use the google.maps<type> ???
  lat: number;
  lng: number;
}

export interface CtxType {
  geo: address ;
  setGeo: React.Dispatch<React.SetStateAction<address>>;
  mapCtx: google.maps.Map | undefined;
  setMapCtx: React.Dispatch<React.SetStateAction<google.maps.Map | undefined>>;
  buildingInsightsCtx: BuildingInsights | undefined;
  setBuildingInsightsCtx: React.Dispatch<React.SetStateAction<BuildingInsights | undefined>>;
  layer: GeoTiff[] | undefined;
  setLayer: React.Dispatch<React.SetStateAction<GeoTiff[] | undefined >>;
  currentPalette: Palette | undefined;
  setPalette: React.Dispatch<React.SetStateAction<Palette | undefined>>;
}

const initialState: address = {
  city: '',
  zip: '',
  state: '',
  country: '',
  lat: 45.752731,
  lng: 4.8299539,
};

export const Ctx = createContext<CtxType>({
  geo: initialState,
  setGeo: () => {},
  mapCtx: undefined,
  setMapCtx: () => {},
  buildingInsightsCtx: undefined,
  setBuildingInsightsCtx: () => {},
  layer: undefined,
  setLayer: ()=>[],
  currentPalette: undefined,
  setPalette: ()=>{},
});

const defineContext = ({ children }: {children: ReactNode}) => {
  //a Reducer may be required for performances
  const [geo, setGeo] = useState<address>(initialState);
  const [mapCtx, setMapCtx] = useState<google.maps.Map>();
  const [buildingInsightsCtx, setBuildingInsightsCtx] = useState<BuildingInsights>();
  const [layer, setLayer] = useState<GeoTiff[]>();
  const [currentPalette, setPalette] = useState<Palette>();


  return (
    <Ctx.Provider value={{ geo, setGeo, mapCtx, setMapCtx, buildingInsightsCtx, setBuildingInsightsCtx, layer, setLayer, currentPalette, setPalette }}>
      {children}
    </Ctx.Provider>
  );
};

export default defineContext;
