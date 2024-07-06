import { Stat, StatLabel, StatNumber, StatHelpText, StatArrow, StatGroup } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

export default function Statistic() {

  const [stockIndex, setStockIndex] = useState(0);

  function getIndex() {
    const apiKey = import.meta.env.VITE_AVANTAGE_API;
    // const symbol = '^FCHI'; // CAC 40 index symbol

    const apiUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=IBM&apikey=${apiKey}`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        // Handle the response data
        console.log(data.tim);
        setStockIndex(50);
      })
      .catch((error) => {
        // Handle any errors
        console.error('Error fetching data:', error);
      });
  }

  useEffect(() => {
    getIndex();
  });

  return (
    <StatGroup>
      <Stat>
        <StatLabel>CAC40</StatLabel>
        <StatNumber>{stockIndex}</StatNumber>
        <StatHelpText>
          <StatArrow type="increase" />
          23.36%
        </StatHelpText>
      </Stat>

      <Stat>
        <StatLabel>Clicked</StatLabel>
        <StatNumber>45</StatNumber>
        <StatHelpText>
          <StatArrow type="decrease" />
          9.05%
        </StatHelpText>
      </Stat>
    </StatGroup>
  );
}
