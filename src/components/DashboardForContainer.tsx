import { CircularProgress, Select } from '@chakra-ui/react';
import { LayerId } from '../types/LayersType';
import { Ctx } from './ContextProvider';
import { useContext, useState } from 'react';
import { displayLayer } from '../components/SolarComponents/MapManager';
import WaitingSpinner from './Dynamic/WaitingSpinner';

export default function Dashboard() {
  const ctx = useContext(Ctx);
  const [pending, setPending] = useState(false);

  const dataLayerOptions: Record<LayerId | 'none', string> = {
    none: 'No layer',
    mask: 'Roof mask',
    dsm: 'Digital Surface Model',
    annualFlux: 'Annual Flux',
    monthlyFlux: 'Monthly flux',
  };
  let kwh: number = ctx ? ctx.buildingInsightsCtx?.solarPotential.buildingStats.areaMeters2! : 0;
  // let maxSunshine: number = ctx ? ctx.buildingInsightsCtx?.solarPotential.maxSunshineHoursPerYear! : 0;

  function normalize(x: number): number {
    const max: number = 100,
      min: number = 0;
    const y = (x - min) / (x + max);
    return y;
  }

  async function selectLayer(event: React.ChangeEvent<HTMLSelectElement>) {
    let str: string = event.target.value;

    if (typeof dataLayerOptions[str as LayerId] !== 'undefined') {
      // return str as LayerId;
      setPending(true);
      await displayLayer(ctx, str as LayerId, true).then(() => setPending(false));
    }
  }

  if (ctx.buildingInsightsCtx) {
    return (
      <>
        <div className="flex w-full justify-center items-center">
          <div className="flex justify-between w-5/6 items-center">
            <div className="text-center flex flex-col justify-center items-center">
              <h2 className="text-bold text-bg ">kWh</h2>
              <CircularProgress value={normalize(kwh)} size="50px" color="orange.500" thickness="12px" />
              <span>{kwh} Kwh/year</span>
            </div>
            <div className="text-center">
              <CircularProgress value={50} size="50px" color="blue.500" thickness="12px" />
              <h2 className="p-1">Hours</h2>
            </div>
            <div className="text-center">
              <CircularProgress value={70} size="50px" color="red.500" thickness="12px" />
              <h2 className="p-1">Other</h2>
            </div>
            <div className="text-center">
              <CircularProgress value={10} size="50px" color="red.500" thickness="12px" />
              <h2 className="p-1">Puis Autre</h2>
            </div>
          </div>
        </div>

        <div className="py-8 flex justify-center items-center ">
          <Select placeholder={dataLayerOptions.none} onChange={(event) => selectLayer(event)}>
            {Object.entries(dataLayerOptions)
              .slice(1)
              .map(([key, index]) => {
                return (
                  <option key={key} value={key}>
                    {index}
                  </option>
                );
              })}
          </Select>
          <WaitingSpinner isLoading={pending}></WaitingSpinner>
        </div>
      </>
    );
  } else {
    return;
  }
}
