import { pdfGenerator } from '../../library/pdfGenerator';
import { getGeoTiffArray } from '../../library/solar';
import { getLayerCanvas } from '../../library/layer';
import { useContext } from 'react';
import { Ctx } from '../ContextProvider';

const GeneratePDF = () => {
  const ctx = useContext(Ctx);

  const getPdf = () => {
    pdfGenerator();
  };

  async function testCanvasArray() {
    await getGeoTiffArray(
      {
        latitude: ctx.geo.lat,
        longitude: ctx.geo.lng,
      },
      10,
    ).then(async (arrayResponse) => {
      console.log(arrayResponse, 'this is supposed to retrieve geoTiff array maybe 5 element');
      let response = await getLayerCanvas(arrayResponse);
      console.log(response, 'this is supposed to be a canvas array of 2 element');
    });
  }

  return (
    <div className='flex w-full justify-center py-2'>
      <button
        className="py-2 px-4 bg-red-500 text-white rounded-md shadow-md hover:bg-red-600 focus:outline-none"
        onClick={getPdf}>
        Generate PDF
      </button>
      <button
        className="ml-4 py-2 px-6 bg-red-500 text-white rounded-md shadow-md hover:bg-red-600 focus:outline-none"
        onClick={testCanvasArray}>
        Test for Canvas Array
      </button>
    </div>
  );
};

export default GeneratePDF;
