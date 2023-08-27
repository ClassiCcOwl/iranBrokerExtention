import requests
import json
from bs4 import BeautifulSoup as bs
import pandas as pd
import concurrent.futures
import os


def get_image_from_url(url, image_path):
    try:
        response = requests.get(url)
        with open(image_path, 'wb') as file:
            file.write(response.content)
    except Exception as e:
        print(name, e)


def download_all_images(df, dirname):
    urls = df["urls"].tolist()
    names = df["names"].tolist()
    futures = []
    if not os.path.exists(f"./{dirname}"):
        os.mkdir(f"./{dirname}")
    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
        for url, name in zip(urls, names):
            image_path = f'./{dirname}/{name}.jpg'
            if not os.path.exists(image_path):
                futures.append(executor.submit(
                    get_image_from_url, url, image_path))
    for future in concurrent.futures.as_completed(futures):
        future.result()


brokers_df = pd.DataFrame(columns=['urls', 'names', 'links', 'names2'])
coins_df = pd.DataFrame(columns=['urls', 'names', 'names2'])
url = "https://iranbroker.net/excompare"
broker = requests.get(url)
print(broker.status_code)
soup = bs(broker.content, 'lxml')
logos = soup.select('img.ibw-exchange-logo')
extradata = soup.select_one(
    'script#ibw-exchange-comparison-script-short-code-js-extra')
data = extradata.text.replace("var ibwMainData = ", "").replace(";", "")
data = json.loads(data)

data_keys = list(data.keys())
for key in data_keys:
    if key != "exchangesSettings":
        del data[key]

for logo in logos:
    if 'data-lazy-src' not in logo.attrs:
        url = logo['src']
        name = url.split('exchanges/')[1].replace('.webp', "")
        next_sibiling = logo.parent.next_sibling
        link = next_sibiling['href']
        text = next_sibiling.getText()
        temp = pd.DataFrame({"urls": url, "names": name,
                            "links": link, "names2": text}, index=[0])
        brokers = pd.concat([brokers_df, temp], ignore_index=True)
    brokers = pd.concat([brokers_df, pd.DataFrame(
        {"urls": "https://iranbroker.net/wp-content/plugins/iranbroker-widget/assets/public/img/exchanges/tetherland.webp",
         "names": "tetherland",
         "links": "https://iranbroker.net/exchange/tetherland",
         "names2": "تترلند"}, index=[0])], ignore_index=True)
coins = soup.select('.ibwCoinsDropdown-content a[onclick]')
for coin in coins:
    name2 = coin['data-value']
    name = coin['data-name']
    url = coin.select_one('img')['src']
    temp = pd.DataFrame({"urls": url, "names": name,
                        "names2": name2}, index=[0])
    coins_df = pd.concat([coins_df, temp], ignore_index=True)
download_all_images(brokers_df, dirname="brokers")
download_all_images(coins_df, dirname="coins")

a = list(zip(coins_df['names'], coins_df['names']))
b = list((k, v) for k, v in zip(coins_df['names2'], coins_df['names']) if k != "" and v != "")
a = a+b
translator = dict(a)


data["translator"] = translator

json_data = json.dumps(data)
with open("exchanges.json", "w") as file:
    file.write(json_data)
