import json
import os
from time import sleep

import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv

load_dotenv()
r = requests.get('https://www.tutu.ru/poezda/vkz/')

soup = BeautifulSoup(r.content, 'html.parser')

items = soup.find_all('a', class_='b-train--vokzal_list--links__link')
objects = []
data = {}
for item in items:
    data_local = {
        "title": item.text,
        "link": "https://www.tutu.ru" + item.get('href')
    }
    objects.append(data_local)

data["links"] = objects

with open("data_links.json", "w", encoding="utf-8") as outfile:
    json.dump(data, outfile, ensure_ascii=False)