const inputCoin = document.querySelector("input#coin");

const tableIrtSell = document.querySelector("table#irtSell");
const tableIrtBuy = document.querySelector("table#irtSell");
const tableUsdtSell = document.querySelector("table#irtSell");
const tableUsdtBuy = document.querySelector("table#irtSell");
let res = "";

async function fetchData() {
  var requestOptions = {
    method: "GET",
    redirect: "follow",
    headers: {
      "Content-Type": "application/json",
    },
  };

  url =
    "https://iranbroker.net/wp-admin/admin-ajax.php?action=ibwPricesUpdaterCompare";

  const req = await fetch(url, requestOptions);
  jsonResponse = await req.json();
  return jsonResponse;
}

document.addEventListener("DOMContentLoaded", fetchData);


function sortByPriceAsc(a, b) {
  return a.sellPrice - b.sellPrice;
}

function sortByPriceDec(a, b) {
  return b.buyPrice - a.buyPrice;
}

// const jsonResponse = res;

function getPricesOfCoin(coin) {
  const prices = [];

  for (const exchange in jsonResponse.exchangesPrices) {
    if (jsonResponse.exchangesPrices.hasOwnProperty(exchange)) {
      const exchangeData = jsonResponse.exchangesPrices[exchange];
      const coinPrices = exchangeData.prices[coin];

      if (coinPrices) {
        for (const currency in coinPrices) {
          if (coinPrices.hasOwnProperty(currency)) {
            const priceData = coinPrices[currency];
            const buyPrice = priceData.buy; // Change to "sell" if needed
            const sellPrice = priceData.sell;

            prices.push({
              broker: exchange,
              coin: coin,
              currency: currency,
              buyPrice: buyPrice,
              sellPrice: sellPrice,
            });
          }
        }
      }
    }
  }

  return prices;
}

inputCoin.addEventListener("change", () => {
  const coinPrices = getPricesOfCoin("btc");

  let sellIRTPrices = coinPrices.filter(
    (price) => price.currency === "irt" && price.sellPrice
  );
  let sellUSDTPrices = coinPrices.filter(
    (price) => price.currency === "usdt" && price.sellPrice
  );
  let buyIRTPrices = coinPrices.filter(
    (price) => price.currency === "irt" && price.buyPrice
  );
  let buyUSDTPrices = coinPrices.filter(
    (price) => price.currency === "usdt" && price.buyPrice
  );

  sellIRTPrices.sort(sortByPriceAsc);
  sellUSDTPrices.sort(sortByPriceAsc);
  buyIRTPrices.sort(sortByPriceDec);
  buyUSDTPrices.sort(sortByPriceDec);
  console.log(jsonResponse);
  console.log(coinPrices);
  // Print sorted prices
  console.log("Sell IRT Prices:");
  sellIRTPrices.forEach((price) => {
    console.log(
      `Broker: ${price.broker}, Coin: ${price.coin}, Sell Price (IRT): ${price.sellPrice}`
    );
  });

  // Print sorted prices for Sell USDT
  console.log("Sell USDT Prices:");
  sellUSDTPrices.forEach((price) => {
    console.log(
      `Broker: ${price.broker}, Coin: ${price.coin}, Sell Price (USDT): ${price.sellPrice}`
    );
  });

  // Print sorted prices for Buy IRT
  console.log("Buy IRT Prices:");
  buyIRTPrices.forEach((price) => {
    console.log(
      `Broker: ${price.broker}, Coin: ${price.coin}, Buy Price (IRT): ${price.buyPrice}`
    );
  });

  // Print sorted prices for Buy USDT
  console.log("Buy USDT Prices:");
  buyUSDTPrices.forEach((price) => {
    console.log(
      `Broker: ${price.broker}, Coin: ${price.coin}, Buy Price (USDT): ${price.buyPrice}`
    );
  });
});
