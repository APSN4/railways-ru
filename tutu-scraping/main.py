import requests
from bs4 import BeautifulSoup


r = requests.get('https://www.tutu.ru/poezda/vkz/')

soup = BeautifulSoup(r.content, 'html.parser')

items = soup.find_all('a', class_='b-train--vokzal_list--links__link')
links = []
for item in items:
    links.append("https://www.tutu.ru" + item.get('href'))

for link in links:
    r = requests.get(link)
    soup = BeautifulSoup(r.content, 'html.parser')

    address = soup.find('div', attrs={'data-ti': 'about-address'})
    phone = soup.find('div', attrs={'data-ti': 'about-phone'})
    working_hours = soup.find('div', attrs={'data-ti': 'about-workingHours'})
    directions = soup.find('div', attrs={'data-ti': 'about-directions'})
    services = soup.find('div', attrs={'data-ti': 'about-services'})
    additional_services = soup.find('div', attrs={'data-ti': 'about-additionalServices'})
    accessibility = soup.find('div', attrs={'data-ti': 'about-accessibility'})
    additional_info = soup.find('div', attrs={'data-ti': 'about-additionalInfo'})

    spans_address = address.find_all('span')
    print(spans_address[1].text)
    spans_phone = phone.find_all('span')
    print(spans_phone[1].text)
    spans_working_hours = working_hours.find_all('span')
    print(spans_working_hours[1].text)
    spans_directions = directions.find_all('span')
    print(spans_directions[1].text)
    spans_services = services.find_all('span')
    for i, service in enumerate(spans_services):
        if i > 0:
            print(service.text)
    spans_additional_services = additional_services.find_all('span')
    print(spans_additional_services[1].text)
    spans_accessibility = accessibility.find_all('span')
    print(spans_accessibility[1].text)
    spans_additional_info = additional_info.find_all('span')
    print(spans_additional_info[1].text)
    break