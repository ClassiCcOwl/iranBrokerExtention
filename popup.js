const mainTable = document.querySelector("table");

document.addEventListener("DOMContentLoaded", async () => {
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

      buy_btn.style.background = "red"
      buy_btn.innerText= "BUY"

      sell_btn.style.background = "green"
      sell_btn.innerText = "SELL"

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

      td_sell_buy.appendChild(buy_btn)
      td_sell_buy.appendChild(sell_btn)

      tr.appendChild(td_broker_image);
      tr.appendChild(td_broker_name);
      tr.appendChild(td_coin_image);
      tr.appendChild(td_coin_name);
      tr.appendChild(td_sell);
      tr.appendChild(td_buy);
      tr.appendChild(td_sell_buy)
      mainTable.appendChild(tr);
    }
  }
});
