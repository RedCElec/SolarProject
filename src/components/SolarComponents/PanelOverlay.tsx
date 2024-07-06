import { useContext, useRef, useState } from 'react';
import { Ctx, CtxType } from '../ContextProvider';
import { Box, Slider, SliderFilledTrack, SliderMark, SliderThumb, SliderTrack, Switch } from '@chakra-ui/react';
import { BuildingInsights } from '../../types/BuildingInsights';

export default function DefaultSlider() {
  const ctx = useContext(Ctx);
  const [enable, setEnable] = useState(false);
  const [innerValue, setInnerValue] = useState(0);

  const labelStyles = {
    mt: '2',
    ml: '-2.5',
    fontSize: 'sm',
  };

  let max: number = ctx.buildingInsightsCtx ? ctx.buildingInsightsCtx?.solarPotential.solarPanelConfigs.length! - 1 : 0;
  let min: number = 0;
  let diff: number = max - min;

  let solarPanelPolygonReferences: Map<BuildingInsights['solarPotential']['solarPanels'][0], google.maps.Polygon> =
    new Map();
  const solarPanelPolygons = useRef<google.maps.Polygon[]>([]);

  function setPotentialSegment(ctx: CtxType, indexPanel: number) {
    const configIndex = Math.round(indexPanel);
    solarPanelPolygons.current.forEach((polygon) => polygon.setMap(null));
    solarPanelPolygons.current = [];

    const solarPanelConfig = ctx.buildingInsightsCtx!.solarPotential.solarPanelConfigs[configIndex];
    let panelCount = 0;

    solarPanelConfig.roofSegmentSummaries.forEach((roofSegment) => {
      ctx.buildingInsightsCtx?.solarPotential.solarPanels
        .filter((solarPanel) => solarPanel.segmentIndex === roofSegment.segmentIndex)
        .slice(0, Math.min(solarPanelConfig.panelsCount - panelCount, roofSegment.panelsCount))
        .forEach((solarPanel) => {
          //may be change later
          let height: number = ctx.buildingInsightsCtx!.solarPotential.panelHeightMeters / 2;
          let width: number = ctx.buildingInsightsCtx!.solarPotential.panelWidthMeters / 2;

          if (solarPanel.orientation === 'LANDSCAPE') {
            const previousHeight = height;
            height = width;
            width = previousHeight;
          }
          const angle = roofSegment.azimuthDegrees;

          if (!solarPanelPolygonReferences.has(solarPanel)) {
            const center = {
              lat: solarPanel.center.latitude,
              lng: solarPanel.center.longitude,
            };
            const top = google.maps.geometry.spherical.computeOffset(center, height, angle + 0);
            const right = google.maps.geometry.spherical.computeOffset(center, width, angle + 90);
            const left = google.maps.geometry.spherical.computeOffset(center, width, angle + 270);

            const topRight = google.maps.geometry.spherical.computeOffset(top, width, angle + 90);
            const bottomRight = google.maps.geometry.spherical.computeOffset(right, height, angle + 180);
            const bottomLeft = google.maps.geometry.spherical.computeOffset(left, height, angle + 180);
            const topLeft = google.maps.geometry.spherical.computeOffset(left, height, angle + 0);

            solarPanelPolygonReferences.set(
              solarPanel,
              new google.maps.Polygon({
                map: ctx.mapCtx,

                //May be address in a config File !!!!!
                fillColor: '#2B2478',
                fillOpacity: 0.8,

                strokeWeight: 1,
                strokeColor: '#AAAFCA',
                strokeOpacity: 1,

                geodesic: false,

                paths: [topRight, bottomRight, bottomLeft, topLeft],
              }),
            );
          }

          const polygon = solarPanelPolygonReferences.get(solarPanel)!;
          polygon.setMap(ctx.mapCtx!);

          // solarPanelPolygons.current.push(polygon);
          solarPanelPolygons.current = [...solarPanelPolygons.current, polygon];
        });

      panelCount += roofSegment.panelsCount;
    });
  }

  function manageEnablePanel(isChecked: boolean) {
    setEnable(isChecked);
    if (solarPanelPolygons.current.length) {
      solarPanelPolygons.current.forEach((polygon) => polygon.setMap(null));
    }
    solarPanelPolygons.current = [];
  }

  const handleChange = (param: number) => {
    setInnerValue(param);
    if (enable) {
      setPotentialSegment(ctx, param);
    }
  };

  if (ctx.buildingInsightsCtx) {
    return (
      <Box p={4} pt={6} display="flex" gap="5">
        <Slider
          aria-label="slider-ex-6"
          min={min}
          max={max}
          onChange={(param) => {
            handleChange(param);
          }}>
          <SliderMark value={diff * 0.25} {...labelStyles}>
            25%
          </SliderMark>
          <SliderMark value={diff * 0.5} {...labelStyles}>
            50%
          </SliderMark>
          <SliderMark value={diff * 0.75} {...labelStyles}>
            75%
          </SliderMark>
          <SliderMark value={innerValue} textAlign="center" bg="blue.500" color="white" mt="-10" ml="-5" w="12">
            {Math.floor((innerValue * 100) / max)}%
          </SliderMark>
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>

        <Switch id="email-alerts" onChange={(param) => manageEnablePanel(param.target.checked)} />
      </Box>
    );
  } else {
    return;
  }
}
