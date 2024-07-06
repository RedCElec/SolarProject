import { useContext, useEffect, useRef } from 'react';
import { Ctx } from '../ContextProvider';
import { findClosestBuildingInsights } from '../../library/solar';
import { extractAddress, relocateMap } from '../../library/mapManager';

export default function SearchComponent() {
  const ctx = useContext(Ctx);
  const searchInput = useRef(null);

  const findMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        //reverseGeocode(position.coords)
        console.log(position);
        return position.coords;
      });
    }
  };
  const onChangeAddress = async (autocomplete: google.maps.places.Autocomplete) => {
    const place = autocomplete.getPlace();

    if (!place || !place.geometry?.location) {
      window.alert("No details available for input: '" + place.name + "'");
      return;
    } else {
      console.log(place);
      const newObj = extractAddress(place, ctx);
      const query = {
        location: {
          latitude: newObj.lat,
          longitude: newObj.lng,
        },
      };
      //-> set context for Geo
      ctx.setGeo(() => extractAddress(place, ctx));
      //-> set context for BuildingInsight
      const getBuildingInsight = await findClosestBuildingInsights(query);
      ctx.setBuildingInsightsCtx(() => getBuildingInsight);
    }
  };

  // init autocomplete
  const initAutocomplete = () => {
    if (!searchInput.current) return;

    const autocomplete = new google.maps.places.Autocomplete(searchInput.current);
    autocomplete.setFields(['address_component', 'geometry']);
    autocomplete.addListener('place_changed', () => {
      onChangeAddress(autocomplete);
    });
  };
  const checkMapScript = async () => {
    new Promise((resolve) => {
      if (window.google) {
        resolve(true);
      } else {
        console.log('no google script');
        throw new Error();
      }
    });
  };

  // load map script after mounted
  useEffect(() => {
    async function checkerFunction() {
      await google.maps.importLibrary('places');
      await checkMapScript().then(() => initAutocomplete());
    }
    checkerFunction();
  }, []);

  useEffect(() => {

    relocateMap(ctx);
  }, [ctx.buildingInsightsCtx]);


  return (
      <div>
        <div className="flex items-center mb-4">
          <input
            className="w-72 py-2 px-4 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
            ref={searchInput}
            type="text"
            placeholder="Search location...."
          />
          <button
            className="ml-4 py-2 px-4 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 focus:outline-none"
            onClick={findMyLocation}>
            Find Location
          </button>
        </div>
        <div>
          <p className={`font-bold text-center text-red-500 ${ctx.buildingInsightsCtx ? 'invisible' : 'visible'}`}>Warning! No Input</p>
        </div>
      </div>
  );
}
