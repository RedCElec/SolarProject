import { useContext } from 'react';
import { Ctx } from '../ContextProvider';

export default function Legend() {
  const ctx = useContext(Ctx);

if(!ctx.currentPalette) return <></>

  return (
    <div className='p-2'>
        <h2 className='text-xl text-bold'>Legend</h2>
        <h3></h3>
      <div className="my-4 h-4 w-full outline rounded-sm" style={{background: `linear-gradient(to right, ${ctx.currentPalette!.colors.map((hex) => '#' + hex)})`}} />
      
      <div className="flex justify-between pt-1 label-small">
        <span>{ctx.currentPalette.min}</span>
          <span>{ctx.currentPalette.max}</span>
      </div>
    </div>
  );
}
