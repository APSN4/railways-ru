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

data = {
    "addresses": [],
    "phones": [],
    "working_hours": [],
    "directions": [],
    "services": [],
    "additional_services": [],
    "accessibility": [],
    "additional_info": []
}

for link in links:
    r = requests.get(link)
    soup = BeautifulSoup(r.content, 'html.parser')

    address = soup.find('div', attrs={'data-ti': 'about-address'})
    phones = soup.find('div', attrs={'data-ti': 'about-phone'})
    working_hours = soup.find('div', attrs={'data-ti': 'about-workingHours'})
    directions = soup.find('div', attrs={'data-ti': 'about-directions'})
    services = soup.find('div', attrs={'data-ti': 'about-services'})
    additional_services = soup.find('div', attrs={'data-ti': 'about-additionalServices'})
    accessibility = soup.find('div', attrs={'data-ti': 'about-accessibility'})
    additional_info = soup.find('div', attrs={'data-ti': 'about-additionalInfo'})

    if address is not None:
        spans_address = address.find_all('span')
        data["addresses"].append(spans_address[1].text)
    if phones is not None:
        spans_phone = phones.find_all('span')
        data["phones"].append(spans_phone[1].text)
    if working_hours is not None:
        spans_working_hours = working_hours.find_all('span')
        data["working_hours"].append(spans_working_hours[1].text)
    if directions is not None:
        spans_directions = directions.find_all('span')
        data["directions"].append(spans_directions[1].text)
    if services is not None:
        services_list = []
        spans_services = services.find_all('span')
        for i, service in enumerate(spans_services):
            if i > 0:
                services_list.append(service.text)
        data['services'].append(', '.join(services_list))

    if additional_services is not None:
        spans_additional_services = additional_services.find_all('span')
        data['additional_services'].append(spans_additional_services[1].text)
    if accessibility is not None:
        spans_accessibility = accessibility.find_all('span')
        data['accessibility'].append(spans_accessibility[1].text)
    if additional_services is not None:
        spans_additional_info = additional_info.find_all('span')
        data['additional_info'].append(spans_additional_info[1].text)
    print(json.dumps(data))
    sleep(2)
