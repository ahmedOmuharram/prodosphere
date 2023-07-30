import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import Select from 'react-select';
import './App.css';
import { Box, Stack } from '@mui/material';
import { grey } from '@mui/material/colors';

function CurrencyConverter() {
  const [info, setInfo] = useState([]);
  const [displayInfo, setDisplayInfo] = useState([]);
  const [input, setInput] = useState(0);
  const [from, setFrom] = useState("usd");
  const [to, setTo] = useState("egp");
  const [options, setOptions] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const response = await Axios.get(
          `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${from}.json`
        );

        if (isMounted) {
          if (response.data && response.data[from]) {
            setDisplayInfo(response.data[from]);
            setInfo(response.data[from]);
          } else {
            setDisplayInfo([]);
            setInfo([]);
          }
        }
      } catch (error) {
        if (isMounted) {
          setDisplayInfo([]);
          setInfo([]);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [from]);

  useEffect(() => {
    if (info !== null) {
      const currencyOptions = Object.keys(info).map((currency) => ({
        value: currency,
        label: currency,
      }));
      setOptions(currencyOptions);
    }
  }, [info]);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies.json'
        );

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        if (isMounted) {
          const data = await response.json();
          setDisplayInfo(data)
        }
      } catch (error) {
        if (isMounted) {
          setDisplayInfo([]);
          setInfo([]);
        }      
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (displayInfo !== null) {
      const currencyOptions = Object.keys(displayInfo).map((currency) => ({
        value: currency,
        label: `${displayInfo[currency]} (${currency.toUpperCase()})`,
      }));
      setOptions(currencyOptions);
    }
  }, [displayInfo]);

  function flip() {
    var temp = from;
    setFrom(to);
    setTo(temp);
  }

  return (
    <>
      <p className="mt-5" style={{ fontSize: "30px", color: "white" }}>Currency Converter</p>
        <div>
          <div style={{ marginTop: "100px", display: "flex", marginLeft: "5%", width: "90%", marginRight: "5%" }}>
              <input 
                type="text"
                placeholder='Amount'
                style={{
                  textAlign: "left",
                  fontSize: "15px",
                  marginLeft: "0%",
                  width: "100%",
                  backgroundColor: "rgba(0,0,0,0)",
                  color: "white",
                  outline: "none",
                  border: "none",
                  borderBottom: "2px solid rgba(255, 255, 255, 1)",
                }}
                onChange={(e) => setInput(parseFloat(e.target.value))} /> 
          </div>
          <div className='mt-5' style={{ justifyContent: "center", display: "flex", marginLeft: "2%", width: "96%", marginRight: "2%" }}>
            <Box style={{ fontSize: "10px", display: "flex", width: "100%" }}>
              <Stack spacing={2} direction="row" alignItems="center" style={{ width: "100%" }}>
                <Select
                    menuPlacement="auto"
                    options={options}
                    onChange={(e) => { setFrom(e.value) }}        
                    value={{ value: from, label: `${from.toUpperCase()}` }}
                    placeholder="From"
                    styles={{
                      control: (provided) => ({ ...provided, width: "122px" }),
                    }}
                  />
                <CurrencyExchangeIcon
                  style={{ color: grey[50] }}
                  onClick={() => { flip() }}/>
                <Select
                  menuPlacement="auto"
                  options={options}
                  onChange={(e) => { setTo(e.value) }}        
                  value={{ value: to, label: `${to.toUpperCase()}` }}
                  placeholder="To"
                  styles={{
                    control: (provided) => ({ ...provided, width: "122px" }),
                  }}
                />
              </Stack>
            </Box>
          </div>
        </div>
        <div className='mt-5'>
          <p style={{color: "white", marginTop: "70px"}}>{input + " " + from.toUpperCase() + " = " + (input * info[to]).toFixed(2) + " " + to.toUpperCase()}</p>
        </div>
    </>
  );
}

export default CurrencyConverter;