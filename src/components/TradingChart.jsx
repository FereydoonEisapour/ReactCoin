import React from "react";
import { useParams } from "react-router-dom";
import TradingViewWidget, { Themes, IntervalTypes } from "react-tradingview-widget";
import useDarkMode from '../hooks/useDarkMode'
const TradingChart = ({ height, width }) => {
  const { coin } = useParams();
  const [symbol, setSymbol] = React.useState("BTCUSDT");
  const tradingRef = React.useRef(null);
  const [chartTheme, setChartTheme] = React.useState()
  const [ theme] = useDarkMode()
  React.useEffect(() => {
    theme === "light" ? setChartTheme(Themes.LIGHT) : setChartTheme(Themes.DARK)
    //  console.log(tradingRef.current.props.symbol);
    setSymbol(`${coin.toUpperCase()}USDT`);
  }, [coin, theme]);
  
  return (
    <TradingViewWidget
      height={height}
      width={width}
      symbol={symbol}
      theme={chartTheme}
      locale="en"
      ref={tradingRef}
      IntervalTypes={IntervalTypes.D}
      autosize
    />
  );
};
export default TradingChart;