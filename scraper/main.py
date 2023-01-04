from urllib.parse import urlencode
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
import pandas as pd
from datetime import datetime
from selenium import webdriver
from seleniumwire import webdriver
import seleniumwire.undetected_chromedriver as uc
from random import randint
import time
import os
import pickle
import string
import urllib
import urllib.parse
import pyautogui
from mailer import send_mail
import requests
from http import HTTPStatus
from logger import get_root_logger

logger = get_root_logger(__name__)


g_is_running = False
use_proxy = "N"
num = 2
dirr = os.path.abspath(os.curdir).rsplit("\\", 1)[0] + f"\\userdata_{num}"

API_KEY = "adfe018cb2d00b2eb8ebab37d64aa4fa"


options = Options()
# options.add_argument('--headless')
options.add_argument('--no-sandbox')
options.add_argument("--disable-infobars")
options.add_argument("--disable-dev-shm-usage")
options.add_argument("--disable-blink-features")
options.add_argument("excludeSwitches")
options.add_argument(r"user-data-dir={}".format(dirr))
options.add_experimental_option(
    "excludeSwitches", ['enable-automation', 'enable-logging'])
options.add_argument("--disable-blink-features=AutomationControlled")
# options.add_argument("--remote-debugging-port=9222")
s = Service(ChromeDriverManager().install())

if use_proxy.lower() == "y":
    proxy_options = {
        'proxy': {
            'http': f'http://scraperapi:{API_KEY}@proxy-server.scraperapi.com:8001',
            'no_proxy': 'localhost,127.0.0.1'
        }
    }
else:
    proxy_options = {}

driver = webdriver.Chrome(service=s, options=options,
                          seleniumwire_options=proxy_options)
driver.maximize_window()
# driver.implicitly_wait(5)

notify_api_url = 'http://127.0.0.1:5000/api/notify'


def on_find_new_product(url):
    logger.debug('on_find_new_product ' + url)
    # result = urllib.unquote(url.encode()).decode('utf8')

    '''
    content = f"""
            A new product has arrived:
                Link: {url}
                Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
            """
    send_mail(content)
    '''
    response = requests.post(
        notify_api_url + '/product/on_find_new', json={"url": url})
    if HTTPStatus.OK != response.status_code:
        logger.warn(
            'Invalid response status from OM agent, status_code=' + str(response.status_code))
    else:
        if 0 < len(response.text):
            logger.debug(response.text)


def check_product(url):
    # driver.implicitly_wait(randint(5, 8))
    logger.debug('check_product ' + url)
    driver.request_interceptor = interceptor
    driver.get(url)
    try:
        pyautogui.moveTo(100*randint(0, 10), 100*randint(0, 10),
                         duration=randint(10, 50)/100)
        url_part2 = url[37:-1]
        encode_url_part2 = urllib.parse.quote_plus(url_part2)
        url_part1 = url[0:37]
        # encode_url_part1 = urllib.parse.quote_plus(url_part1)
        encode_url = url_part1 + encode_url_part2 + "/"
        add_to_cart = driver.find_element(
            By.XPATH, '//button[@name="add-to-cart"]')
        # if add_to_cart and add_to_cart.is_enabled() == True:
        # print(add_to_cart)
        if add_to_cart:
            on_find_new_product(encode_url)
    except Exception as e:
        # logger.error(e)
        pass


def interceptor(request):
    del request.headers['Referer']  # Delete the header first
    request.headers['Referer'] = 'https://www.hermes.com/'
    request.headers['Origin'] = 'https://www.hermes.com'
    request.headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
    request.headers['x-hermes-locale'] = 'jp_ja'
    request.headers['x-xsrf-token'] = '942ccbf2-9962-4d3a-b831-cdf9a208fe12'
    # request.headers['sec-fetch-site'] = 'cross-site'


if __name__ == "__main__":
    df = pd.read_csv(f"picotan_rock_{num}.csv")
    urls = df.iloc[:, 0].values
    logger.debug('Loaded ' + str(len(urls)) + " URLs")

    driver.get(
        'https://www.hermes.com/jp/ja/category/women/bags-and-small-leather-goods')
    driver.implicitly_wait(randint(1, 3))
    pickle.dump(driver.get_cookies(), open("cookies.pkl", "wb"))
    cookies = pickle.load(open("cookies.pkl", "rb"))
    for cookie in cookies:
        driver.add_cookie(cookie)

    g_is_running = True

    while (g_is_running):
        requests.get(notify_api_url + '/product/on_start_scrape')
        for link in urls:
            time.sleep(randint(3, 8))
            check_product(link)

    driver.close()
    driver.quit()
