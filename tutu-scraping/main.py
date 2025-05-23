import json
from time import sleep

import requests
from bs4 import BeautifulSoup


r = requests.get('https://www.tutu.ru/poezda/vkz/')

soup = BeautifulSoup(r.content, 'html.parser')

items = soup.find_all('a', class_='b-train--vokzal_list--links__link')
links = []
for item in items:
    links.append("https://www.tutu.ru" + item.get('href'))

data = {"train_stations": []}

for link in links:

    data_local = {
        "title": "",
        "address": "",
        "phone": "",
        "working_hours": "",
        "direction": "",
        "service": "",
        "additional_service": "",
        "accessibility": "",
        "additional_info": "",
        "photo": ""
    }

    r = requests.get(link)
    soup = BeautifulSoup(r.content, 'html.parser')

    title = soup.find('h1', attrs={'data-ti': 'header'})
    address = soup.find('div', attrs={'data-ti': 'about-address'})
    phones = soup.find('div', attrs={'data-ti': 'about-phone'})
    working_hours = soup.find('div', attrs={'data-ti': 'about-workingHours'})
    directions = soup.find('div', attrs={'data-ti': 'about-directions'})
    services = soup.find('div', attrs={'data-ti': 'about-services'})
    additional_services = soup.find('div', attrs={'data-ti': 'about-additionalServices'})
    accessibility = soup.find('div', attrs={'data-ti': 'about-accessibility'})
    additional_info = soup.find('div', attrs={'data-ti': 'about-additionalInfo'})
    photo = soup.find('div', attrs={'data-ti': 'photo'})

    if title is not None:
        data_local["title"] = title.text
    if address is not None:
        spans_address = address.find_all('span')
        data_local["address"] = spans_address[1].text
    if phones is not None:
        spans_phone = phones.find_all('span')
        data_local["phone"] = spans_phone[1].text
    if working_hours is not None:
        spans_working_hours = working_hours.find_all('span')
        data_local["working_hours"] = spans_working_hours[1].text
    if directions is not None:
        spans_directions = directions.find_all('span')
        data_local["direction"] = spans_directions[1].text
    if services is not None:
        services_list = []
        spans_services = services.find_all('span')
        for i, service in enumerate(spans_services):
            if i > 0:
                services_list.append(service.text)
        data_local['service'] = ', '.join(services_list)

    if additional_services is not None:
        spans_additional_services = additional_services.find_all('span')
        data_local['additional_service'] = spans_additional_services[1].text
    if accessibility is not None:
        spans_accessibility = accessibility.find_all('span')
        data_local['accessibility'] = spans_accessibility[1].text
    if additional_info is not None:
        spans_additional_info = additional_info.find_all('span')
        data_local['additional_info'] = spans_additional_info[1].text
    if photo is not None:
        img_photo = photo.find_all('img')
        data_local['photo'] = img_photo[0].get('src')
    data["train_stations"].append(data_local)

with open("data.json", "w", encoding="utf-8") as outfile:
    json.dump(data, outfile, ensure_ascii=False)