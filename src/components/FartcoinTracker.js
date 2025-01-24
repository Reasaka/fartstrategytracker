import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

const FartcoinTracker = () => {
  const [priceData, setPriceData] = useState([]);
  const [buyPoints, setBuyPoints] = useState([]);
  const [error, setError] = useState(null);

  const fetchBinanceFuturesData = async () => {
    try {
      const response = await fetch(
        'https://fapi.binance.com/fapi/v1/klines?symbol=FARTCOINUSDT&interval=1m&limit=100'
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      
      // Format the data for the chart
      const formattedData = data.map((candle) => ({
        time: new Date(candle[0]).toLocaleTimeString(),
        price: parseFloat(candle[4]) // Using close price
      }));

      setPriceData(formattedData);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching data:', err);
    }
  };

  useEffect(() => {
    fetchBinanceFuturesData();
    // Update every minute
    const interval = setInterval(fetchBinanceFuturesData, 60000);
    return () => clearInterval(interval);
  }, []);

  const addBuyPoint = (point) => {
    setBuyPoints([...buyPoints, point]);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4">FARTCOIN/USDT Price Chart</h2>
      <LineChart width={800} height={400} data={priceData}>
        <XAxis dataKey="time" />
        <YAxis domain={['auto', 'auto']} />
        <Tooltip />
        <Line type="monotone" dataKey="price" stroke="#8884d8" dot={false} />
        {buyPoints.map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r={5}
            fill="green"
          />
        ))}
      </LineChart>

      <button
        onClick={() => addBuyPoint({
          x: priceData.length - 1,
          y: priceData[priceData.length - 1]?.price
        })}
        className="mt-4 bg-green-500 text-white p-2 rounded"
      >
        Add Buy Point
      </button>
    </div>
  );
};

export default FartcoinTracker;