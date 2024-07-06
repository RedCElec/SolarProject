import './App.css';

import { Loader } from '@googlemaps/js-api-loader'; //Maybe to be rewrite
import DefineContext from './components/ContextProvider';
import MapTesterNew from './components/SolarComponents/MapManager';

import { ChakraProvider } from '@chakra-ui/react';
import Menu from './components/Layout/Menu';

function App() {
  // TO BE REWRITE DEPRECATED STUFF
  const loader = new Loader({
    apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    version: 'weekly',
    libraries: ['places', 'geometry'],
  });
  loader.load();

  // Test for PDF Generation TO BE ABSOLUTELY REMOVE
  return (
    <div className="flex flex-col h-screen w-screen justify-center items-center relative">
      <ChakraProvider>
        <DefineContext>
          <h1 className='absolute text-center top-0 font-bold text-white bg-green-800 text-2xl z-10 px-4 py-2 mt-2 rounded-lg'>Solar PROJECT</h1>
          <Menu />
          <MapTesterNew />
        </DefineContext>
      </ChakraProvider>
    </div>
  );
}

export default App;
