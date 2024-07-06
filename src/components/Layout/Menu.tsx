import { useReducer } from 'react';

import { FaTachometerAlt } from 'react-icons/fa';
import { BsGraphUpArrow } from 'react-icons/bs';
import { FaFilePdf } from 'react-icons/fa';

import MonthlyChart from '../Graph/MonthlyChart';
import GaussianChart from '../Graph/GaussianChart';
import Dashboard from '../DashboardForContainer';
import ContainerCardTester from './ContainerCardTester';
import GeneratePdf from '../Graph/GeneratePdf';
import LoadAddress from '../SolarComponents/LoadAddress';
import SliderNew from '../SolarComponents/PanelOverlay';
import Legend from '../SolarComponents/Legend';

const initialState = {
  dashboard: 0,
  graph: 0,
  pdfgen: 0,
  home: 0,
  counter: 0,
};

export type State = {
  dashboard: number;
  graph: number;
  pdfgen: number;
  home: number;
  counter: number;
};

export type Action =
  | { type: 'close'; variable: string }
  | { type: 'reduce'; variable: string }
  | { type: 'open'; variable: string };

function reducer(state: State, action: Action) {
  if (state.counter > 2) {
    return { ...initialState, counter: 1, [action.variable]: 2 };
  }
  switch (action.type) {
    case 'close': {
      // const currentValue = state[action.variable];
      return { ...state, [action.variable]: 0, counter: state.counter-- };
    }
    case 'reduce': {
      return { ...state, [action.variable]: 1, counter: state.counter-- };
    }
    case 'open': {
      return { ...state, [action.variable]: 2, counter: state.counter++ };
    }
    default: {
      return state;
    }
  }
}

export default function Reducer() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div className="w-full h-full absolute bottom-0 left-0 flex">
      <div className="h-full flex flex-col min-w-24 justify-center items-center z-10 gap-6 px-4 p-1">
        <button
          className="hover:text-white bg-white flex justify-center items-center transition-all duration-500 hover:bg-black/[.3] h-14 w-14 rounded"
          aria-label="Dashboard"
          onClick={() => {
            if (state.dashboard !== 2) dispatch({ type: 'open', variable: 'dashboard' });
          }}>
          <FaTachometerAlt size={25} />
        </button>
        <button
          className="hover:text-white bg-white flex justify-center items-center transition-all duration-500 hover:bg-black/[.3] h-14 w-14 rounded"
          aria-label="Graph"
          onClick={() => {
            if (state.graph !== 2) dispatch({ type: 'open', variable: 'graph' });
          }}>
          <BsGraphUpArrow size={25} />
        </button>
        <button
          className="hover:text-white bg-white flex justify-center items-center transition-all duration-500 hover:bg-black/[.3] h-14 w-14 rounded"
          aria-label="pdfgen"
          onClick={() => {
            if (state.pdfgen !== 2) dispatch({ type: 'open', variable: 'pdfgen' });
          }}>
          <FaFilePdf size={25} />
        </button>
      </div>

      <div className="w-full flex items-end gap-4 p-4">
        <ContainerCardTester
          componentState={state.dashboard}
          dispatchfct={dispatch}
          Icon={<FaTachometerAlt size={25} />}
          selector={'dashboard'}>
          <LoadAddress />
          <Dashboard />
          <SliderNew />
          <Legend />
        </ContainerCardTester>

        <ContainerCardTester
          componentState={state.graph}
          dispatchfct={dispatch}
          Icon={<BsGraphUpArrow size={25} />}
          selector={'graph'}>
          <MonthlyChart></MonthlyChart>
          <GaussianChart></GaussianChart>
          <GaussianChart></GaussianChart>
        </ContainerCardTester>

        <ContainerCardTester
          componentState={state.pdfgen}
          dispatchfct={dispatch}
          Icon={<FaFilePdf size={25} />}
          selector={'pdfgen'}>
          <GeneratePdf />
        </ContainerCardTester>
      </div>
    </div>
  );
}
