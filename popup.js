const inputCoin = document.querySelector("input#coin");
const refresh = document.querySelector("button#refresh");
let exchangeDataAll;
async function loadJs() {
  return fetch("./exchanges.json")
    .then((res) => res.json())
    .then((data) => {
      exchangeDataAll = data;
    });
}
function fetchData() {
  var requestOptions = {
    method: "GET",
    redirect: "follow",
    headers: {
      "Content-Type": "application/json",
    },
  };
  url =
    "https://iranbroker.net/wp-admin/admin-ajax.php?action=ibwPricesUpdaterCompare";
  return fetch(url, requestOptions)
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((error) => {
      throw new Error(error);
    });
}
function sortByPriceAsc(a, b) {
  return a.buyPrice - b.buyPrice;
}
function sortByPriceDec(a, b) {
  return b.sellPrice - a.sellPrice;
}
function getPricesOfCoin(coin, jsonResponse) {
  const prices = [];
  for (const exchange in jsonResponse.exchangesPrices) {
    if (jsonResponse.exchangesPrices.hasOwnProperty(exchange)) {
      const exchangeData = jsonResponse.exchangesPrices[exchange];
      const coinPrices = exchangeData.prices[coin];
      if (coinPrices) {
        for (const currency in coinPrices) {
          if (coinPrices.hasOwnProperty(currency)) {
            const priceData = coinPrices[currency];
            const buyPrice = priceData.buy;
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
function tableCreator(coinPrices, currency, type, exchangeDataAll) {
  let filtered = coinPrices.filter(
    (price) => price.currency === currency && price[`${type}Price`]
  );
  if (type === "buy") {
    filtered.sort(sortByPriceAsc);
  } else if (type === "sell") {
    filtered.sort(sortByPriceDec);
  }
  const table = document.querySelector(
    `table#${currency + type.charAt(0).toUpperCase() + type.slice(1)}`
  );
  table.innerHTML = `<tr><th>broker</th><th>broker</th><th>coin</th><th>coin</th><th>bestprice to ${type} in ${currency}</th><th>action</th></tr>`;
  filtered.slice(0, 5).forEach((row) => {
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
    buy_btn.addEventListener("click", () => {
      open(exchangeDataAll[broker].exchangeLink);
    });
    sell_btn.addEventListener("click", () => {
      open(exchangeDataAll[broker].exchangeLink);
    });
    div_broker_name.innerText = broker;
    div_coin_name.innerText = coin;
    td_broker_name.appendChild(div_broker_name);
    td_coin_name.appendChild(div_coin_name);
    td_broker_image.appendChild(broker_image);
    td_coin_image.appendChild(coin_image);
    const buy = parseFloat(row[`${type}Price`]).toFixed(3);
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
}
function contentCreator() {
  if (inputCoin.value) {
    let jsonResponse = "";
    fetchData().then((data) => {
      jsonResponse = data;
      const coin = exchangeDataAll["translator"][inputCoin.value];
      if (coin) {
        const coinPrices = getPricesOfCoin(coin, jsonResponse);
        tableCreator(
          coinPrices,
          "irt",
          "sell",
          exchangeDataAll["exchangesSettings"]
        );
        tableCreator(
          coinPrices,
          "usdt",
          "sell",
          exchangeDataAll["exchangesSettings"]
        );
        tableCreator(
          coinPrices,
          "irt",
          "buy",
          exchangeDataAll["exchangesSettings"]
        );
        tableCreator(
          coinPrices,
          "usdt",
          "buy",
          exchangeDataAll["exchangesSettings"]
        );
      }
    });
  }
}
window.addEventListener("load", async function () {
  await loadJs();
  var coins = Object.keys(exchangeDataAll["translator"]);
  autocomplete(inputCoin, coins);
});
inputCoin.addEventListener("change", contentCreator);
refresh.addEventListener("click", contentCreator);

const checkbox = document.querySelector(".checkbox");

const switchLabel = document.querySelector(".toggle-thumb");
switchLabel.addEventListener("click", () => {
  document.querySelector(".usdt").classList.toggle("none");
  document.querySelector(".irt").classList.toggle("none");
});

function autocomplete(inp, arr) {
  var currentFocus;
  inp.addEventListener("input", function (e) {
    var a,
      b,
      i,
      val = this.value;
    closeAllLists();
    if (!val) {
      return false;
    }
    currentFocus = -1;
    a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    this.parentNode.appendChild(a);
    for (i = 0; i < arr.length; i++) {
      // if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
      if (arr[i].toUpperCase().indexOf(val.toUpperCase()) > -1) {
        b = document.createElement("DIV");
        b.innerHTML = arr[i].substr(0, val.length);
        b.innerHTML += arr[i].substr(val.length);
        b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
        b.addEventListener("click", function (e) {
          inp.value = this.getElementsByTagName("input")[0].value;
          closeAllLists();
        });
        a.appendChild(b);
      }
    }
  });
  inp.addEventListener("keydown", function (e) {
    var x = document.getElementById(this.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode == 40) {
      currentFocus++;
      addActive(x);
    } else if (e.keyCode == 38) {
      //up
      currentFocus--;
      addActive(x);
    } else if (e.keyCode == 13) {
      e.preventDefault();
      if (currentFocus > -1) {
        if (x) x[currentFocus].click();
      }
    }
  });
  function addActive(x) {
    if (!x) return false;
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = x.length - 1;
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });
}
