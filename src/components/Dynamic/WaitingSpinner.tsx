import { Spinner } from "@chakra-ui/react";

interface WaitingSpinnerProps {
  isLoading: boolean;
}

const WaitingSpinner: React.FC<WaitingSpinnerProps> = ({ isLoading }) => {
 
    return (
      <Spinner color='blue.500' speed='0.9s' className={`mx-2 ${isLoading ? "visible" : "invisible"}` }/>
    );
};

export default WaitingSpinner;
