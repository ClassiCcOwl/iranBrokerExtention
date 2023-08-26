const imputCoin = document.querySelector("input#coin")

const tableIrtSell = document.querySelector("table#irtSell");
const tableIrtBuy = document.querySelector("table#irtSell");
const tableUsdtSell = document.querySelector("table#irtSell");
const tableUsdtBuy = document.querySelector("table#irtSell");

async function fetchData(){
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
  const res = await req.json();

  return res
}

document.addEventListener("DOMContentLoaded", async () => {
  

  for (let broker in res["exchangesPrices"]) {
    for (let coin in res["exchangesPrices"][broker]["prices"]) {
      const tr = document.createElement("tr");
      const td_broker_name = document.createElement("td");
      const td_broker_image = document.createElement("td");
      const td_coin_name = document.createElement("td");
      const td_coin_image = document.createElement("td");
      const td_sell = document.createElement("td");
      const td_buy = document.createElement("td");
      const div_broker_name = document.createElement("div");
      const div_coin_name = document.createElement("div");
      const sell_btn = document.createElement("button");
      const buy_btn = document.createElement("button");
      const td_sell_buy = document.createElement("td");

      buy_btn.style.background = "red";
      buy_btn.innerText = "BUY";

      sell_btn.style.background = "green";
      sell_btn.innerText = "SELL";

      div_broker_name.innerText = broker;
      div_coin_name.innerText = coin;

      const broker_image = document.createElement("img");
      broker_image.setAttribute("src", `/brokers/${broker}.jpg`);
      broker_image.style = "width: 30px;";

      const coin_image = document.createElement("img");
      coin_image.setAttribute("src", `/coins/${coin}.jpg`);
      coin_image.style = "width: 30px;";

      const sell =
        res["exchangesPrices"][broker]["prices"][coin]["irt"]["sell"];
      const buy = res["exchangesPrices"][broker]["prices"][coin]["irt"]["buy"];

      td_broker_name.appendChild(div_broker_name);
      td_coin_name.appendChild(div_coin_name);
      td_broker_image.appendChild(broker_image);
      td_coin_image.appendChild(coin_image);
      td_buy.append(buy);
      td_sell.append(sell);

      td_sell_buy.appendChild(buy_btn);
      td_sell_buy.appendChild(sell_btn);

      tr.appendChild(td_broker_image);
      tr.appendChild(td_broker_name);
      tr.appendChild(td_coin_image);
      tr.appendChild(td_coin_name);
      tr.appendChild(td_sell);
      tr.appendChild(td_buy);
      tr.appendChild(td_sell_buy);
      mainTable.appendChild(tr);
    }
  }
});

function sortByPriceAsc(a, b) {
  return a.sellPrice - b.sellPrice;
}

function sortByPriceDec(a, b) {
  return b.buyPrice - a.buyPrice;
}





const jsonResponse = z;

// Function to get all prices of a specific coin across brokers
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

// Example usage: Get prices of "btc" coin across brokers and sort them
const coinPrices = getPricesOfCoin("btc");
// Separate prices by type: Sell IRT, Sell USDT, Buy IRT, Buy USDT
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
