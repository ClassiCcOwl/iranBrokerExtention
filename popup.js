const inputCoin = document.querySelector("input#coin");
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
    (price) => price.currency === currency && price[`${type}Price`]
  );
  if (type === "sell") {
    filtered.sort(sortByPriceAsc);
  } else if (type === "buy") {
    filtered.sort(sortByPriceDec);
  }
  const table = document.querySelector(
    `table#${currency + type.charAt(0).toUpperCase() + type.slice(1)}`
  );
  table.innerHTML = `<tr><th>broker</th><th>broker</th><th>coin</th><th>coin</th><th>bestprice</th><th>action</th></tr>`;

  filtered.forEach((row) => {
    const broker = row.broker;
    const coin = row.coin;
    const tr = document.createElement("tr");
    const td_broker_name = document.createElement("td");
    const td_broker_image = document.createElement("td");
    const td_coin_name = document.createElement("td");
    const td_coin_image = document.createElement("td");
    const td_price = document.createElement("td");
    const div_broker_name = document.createElement("div");
    const div_coin_name = document.createElement("div");
    const sell_btn = document.createElement("button");
    const buy_btn = document.createElement("button");
    const td_sell_buy = document.createElement("td");
    const broker_image = document.createElement("img");
    broker_image.setAttribute("src", `/brokers/${broker}.jpg`);
    broker_image.style = "width: 30px;";

    const coin_image = document.createElement("img");
    coin_image.setAttribute("src", `/coins/${coin}.jpg`);
    coin_image.style = "width: 30px;";

    buy_btn.innerText = "BUY";
    sell_btn.innerText = "SELL";
    div_broker_name.innerText = broker;
    div_coin_name.innerText = coin;

    td_broker_name.appendChild(div_broker_name);
    td_coin_name.appendChild(div_coin_name);
    td_broker_image.appendChild(broker_image);
    td_coin_image.appendChild(coin_image);

    const buy = row[`${type}Price`];

    td_price.append(buy);

    td_sell_buy.appendChild(buy_btn);
    td_sell_buy.appendChild(sell_btn);

    tr.appendChild(td_broker_image);
    tr.appendChild(td_broker_name);
    tr.appendChild(td_coin_image);
    tr.appendChild(td_coin_name);
    tr.appendChild(td_price);
    tr.appendChild(td_sell_buy);
    table.appendChild(tr);
  });

  // return filtered;
}

inputCoin.addEventListener("change", () => {
  const coin = inputCoin.value;
  const coinPrices = getPricesOfCoin(coin);

  let sellIRTPrices = tableCreator(coinPrices, "irt", "sell");
  let sellUSDTPrices = tableCreator(coinPrices, "usdt", "sell");
  let buyIRTPrices = tableCreator(coinPrices, "irt", "buy");
  let buyUSDTPrices = tableCreator(coinPrices, "usdt", "buy");

  console.log(sellIRTPrices);
  console.log(sellUSDTPrices);
  console.log(buyIRTPrices);
  console.log(buyUSDTPrices);
});
