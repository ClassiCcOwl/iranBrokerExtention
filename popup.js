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

function tableCreator(coinPrices, currency, type) {
  let filtered = coinPrices.filter(
    (price) => price.currency === currency && price[type]
  );
  if (type === "sellPrice") {
    filtered.sort(sortByPriceAsc);
  } else if (type === "buyPrice") {
    filtered.sort(sortByPriceDec);
  }

  return filtered;
}

inputCoin.addEventListener("change", () => {
  const coinPrices = getPricesOfCoin("btc");

  let sellIRTPrices = tableCreator(coinPrices, "irt", "sellPrice");
  let sellUSDTPrices = tableCreator(coinPrices, "usdt", "sellPrice");
  let buyIRTPrices = tableCreator(coinPrices, "irt", "buyPrice");
  let buyUSDTPrices = tableCreator(coinPrices, "usdt", "buyPrice");


});
