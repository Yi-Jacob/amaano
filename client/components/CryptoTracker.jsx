import React, { useState } from "react";
import { useQuery } from "react-query";
import ChartData from "./ChartData";

const useGetCardData = (cryptoName, options) => {
  return useQuery(
    `${cryptoName}-card1`,
    async () => {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${cryptoName}`
      );
      return await response.json();
    },
    options
  );
};

export const formatPrice = (price) => {
  const formatConfig = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
  });

  return formatConfig.format(price);
};

const formatPlusMinus = (priceChange) => {
  const isPositive = Math.sign(priceChange) >= 0;

  return (
    <p className={`${isPositive ? "green-text small-text mt-2" : "red small-text  mt-2"}`}>
      24 hour change: {`${isPositive ? "+" : ""}${priceChange.toFixed(2)}%`}
    </p>
  );
};

const CryptoTracker = ({ cryptoName }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const { data, isLoading } = useGetCardData(cryptoName, {
    refetchInterval: 60000,
    staleTime: 60000
  });

  const onCardClick = () => {
    setIsExpanded(true);
  };

  if (isLoading) return null;

  const { image, name, market_data: marketData } = data;

  return (
    <div className='card1 expanded'>

      {!isExpanded && <button onClick={onCardClick} className="hitzone" />}
      <div className="card1-inner">
        {/* {isExpanded && (
          <button className="close" onClick={() => setIsExpanded(true)}>
            Close
          </button>
        )} */}
        <div className="top-data">
          <img src={image?.large} alt={`${name} logo`} />
          <h3 className="crypto-name">{name}</h3>
          <h4 className="crypto-price text-center">

            {formatPrice(marketData?.current_price?.usd)}
            {formatPlusMinus(marketData?.price_change_percentage_24h)}

          </h4>
        </div>
        <ChartData isExpanded={isExpanded} cryptoName={cryptoName} />
      </div>
    </div>
  );
};

export default CryptoTracker;
