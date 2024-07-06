import { ReactNode } from 'react';
import { IoMdClose } from 'react-icons/io';
import { IconButton } from '@chakra-ui/react';
import { Action } from './Menu';


type props = {

  componentState: number;
  dispatchfct: React.Dispatch<Action>,
  children: ReactNode;
  selector: string,
  Icon: JSX.Element
};

//Ensure typing
export default function Container({ componentState, dispatchfct, selector, Icon, children }: props) {


  if (componentState === 2) {
    return (
      <div className="z-10 h-5/6 w-2/6 min-h-80 p-2 bg-white rounded-lg overflow-auto">
        <div className="flex justify-end gap-1">
          <h1 className="text-center text-2xl text-bold text-blue-500 p-2 mr-auto uppercase">{selector}</h1>
          <IconButton
            className=""
            aria-label="Close Dashboard"
            icon={<IoMdClose />}
            onClick={() => {
              if (componentState === 2) {
                dispatchfct({ type: 'reduce', variable: selector});
              }
            }}
          />
        </div>
        {children}
      </div>
    );
  } 
  else {
    return;
  }
}
