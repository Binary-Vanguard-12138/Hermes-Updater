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
import json
from logger import get_root_logger
import time


logger = get_root_logger(__name__)


g_is_running = False

USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
UA_PLATFORM = '"Windows"'

# USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
# UA_PLATFORM = '"macOS"'

driver = None

use_proxy = "N"
num = 2

API_KEY = "adfe018cb2d00b2eb8ebab37d64aa4fa"


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


def check_product_selenium(url):
    global driver
    # driver.implicitly_wait(randint(5, 8))
    logger.debug('check_product_selenium ' + url)
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


cookies_datadome = None


def check_product_requests(url):
    global cookies_datadome

    cookies = {'datadome': cookies_datadome}

    headers = {
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "ja,en-US;q=0.9,en;q=0.8",
        "sec-ch-device-memory": "8",
        "sec-ch-ua": '"Not?A_Brand";v="8", "Chromium";v="108", "Google Chrome";v="108"',
        "sec-ch-ua-arch": "x86",
        "sec-ch-ua-full-version-list": '"Not?A_Brand";v="8.0.0.0", "Chromium";v="108.0.5359.124", "Google Chrome";v="108.0.5359.124"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-model": "",
        "sec-ch-ua-platform": UA_PLATFORM,
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "none",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1",
        "user-agent": USER_AGENT
    }

    res = requests.get(url, headers=headers, cookies=cookies)

    main_res_status = res.status_code
    logger.debug(str(res.status_code) + " " + url)
    if 403 == res.status_code:
        return False

    js_url = 'https://d.digital.hermes/js/'
    js_headers = {
        'accept': '*/*',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.9',
        'content-type': 'application/x-www-form-urlencoded',
        'origin': 'https://www.hermes.com',
        'referer': 'https://www.hermes.com/',
        'sec-ch-ua': '"Not?A_Brand";v="8", "Chromium";v="108", "Google Chrome";v="108"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': UA_PLATFORM,
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'cross-site',
        'user-agent': USER_AGENT
    }
    timestamp = int(round(time.time()))
    data = {
        "jsData": {"ttst": 51.599999994039536, "ifov": False, "tagpu": 17.099999994039536, "glvd": "Google Inc. (Intel)", "glrd": "ANGLE (Intel, Intel(R) UHD Graphics Direct3D11 vs_5_0 ps_5_0, D3D11)", "hc": 8, "br_oh": 1040, "br_ow": 1920, "ua": '"' + USER_AGENT + '"', "wbd": False, "wdif": False, "wdifrm": False, "npmtm": False, "br_h": 880, "br_w": 902, "nddc": 1, "rs_h": 1080, "rs_w": 1920, "rs_cd": 24, "phe": False, "nm": False, "jsf": False, "lg": "en-US", "pr": 1, "ars_h": 1040, "ars_w": 1920, "tz": -480, "str_ss": True, "str_ls": True, "str_idb": True, "str_odb": True, "plgod": False, "plg": 5, "plgne": True, "plgre": True, "plgof": False, "plggt": False, "pltod": False, "hcovdr": False, "hcovdr2": False, "plovdr": False, "plovdr2": False, "ftsovdr": False, "ftsovdr2": False, "lb": False, "eva": 33, "lo": False, "ts_mtp": 0, "ts_tec": False, "ts_tsa": False, "vnd": "Google Inc.", "bid": "NA", "mmt": "application/pdf,text/pdf", "plu": "PDF Viewer,Chrome PDF Viewer,Chromium PDF Viewer,Microsoft Edge PDF Viewer,WebKit built-in PDF", "hdn": False, "awe": False, "geb": False, "dat": False, "med": "defined", "aco": "probably", "acots": False, "acmp": "probably", "acmpts": True, "acw": "probably", "acwts": False, "acma": "maybe", "acmats": False, "acaa": "probably", "acaats": True, "ac3": "", "ac3ts": False, "acf": "probably", "acfts": False, "acmp4": "maybe", "acmp4ts": False, "acmp3": "probably", "acmp3ts": False, "acwm": "maybe", "acwmts": False, "ocpt": False, "vco": "probably", "vcots": False, "vch": "probably", "vchts": True, "vcw": "probably", "vcwts": True, "vc3": "maybe", "vc3ts": False, "vcmp": "", "vcmpts": False, "vcq": "", "vcqts": False, "vc1": "probably", "vc1ts": True, "dvm": 8, "sqt": False, "so": "landscape-primary", "wdw": True, "cokys": "bG9hZFRpbWVzY3NpYXBwL=", "ecpc": False, "lgs": True, "lgsod": False, "psn": True, "edp": True, "addt": True, "wsdc": True, "ccsr": True, "nuad": True, "bcda": False, "idn": True, "capi": False, "svde": False, "vpbq": True, "ucdv": False, "spwn": False, "emt": False, "bfr": False, "dbov": False, "prm": True, "tzp": "Asia/Hong_Kong", "cvs": True, "usb": "defined", "uid": "976cefa955fab94ce7c40cd04043746f21b14621158d1d249c8ef5a4396e9171", "jset": timestamp},
        "eventCounters": {"mousemove": randint(10, 30), "click": randint(1, 3), "scroll": 0, "touchstart": 0, "touchend": 0, "touchmove": 0, "keydown": 0, "keyup": 0},
        "jsType": "ch",
        "cid": "3DC2wVwFSR1eAPjNh~KVutfPGlQjazUp_dI6UC6Y2w1ohYgMo1oE7wfNo259BQhJux0~l7PXyR_LwM9kAJTVcfhID0Fcbyhyc0hqgRxMHP6I8n6jiC711-18egDYhyh-",
        "ddk": "2211F522B61E269B869FA6EAFFB5E1",
        "Referer": url,
        "request": url,
        "responsePage": "origin",
        "ddv": "4.6.0"
    }
    res = requests.post(js_url, headers=js_headers, data=data)
    if 200 != res.status_code:
        return False

    res_json = json.loads(res.text)
    res_cookie: str = res_json['cookie']
    start_pos = res_cookie.find('datadome=')
    if 0 > start_pos:
        logger.error('datadome not found in ' + res_cookie)
        return False
    end_pos = res_cookie.find(';', start_pos + 9)
    datadome_cookie = None
    if 0 > end_pos:
        datadome_cookie = res_cookie[start_pos + 9:]
    else:
        datadome_cookie = res_cookie[start_pos + 9:end_pos]
    productsku = url[-12: -1]
    options_headers = {
        'accept': '*/*',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.9',
        'access-control-request-headers': 'x-hermes-locale',
        'access-control-request-method': 'GET',
        'origin': 'https://www.hermes.com',
        'referer': 'https://www.hermes.com/',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
        'user-agent': USER_AGENT
    }
    bck_url = 'https://bck.hermes.com/product?locale=jp_ja&productsku=' + productsku
    res = requests.options(bck_url, headers=options_headers)
    if 204 != res.status_code:
        return False
    headers['Cookies'] = res_cookie
    get_headers = {
        'accept': 'application/json, text/plain, */*',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.9',
        'origin': 'https://www.hermes.com',
        'referer': 'https://www.hermes.com/',
        'sec-ch-ua': '"Not?A_Brand";v="8", "Chromium";v="108", "Google Chrome";v="108"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': UA_PLATFORM,
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
        'user-agent': USER_AGENT,
        'x-hermes-locale': 'jp_ja'
    }
    res = requests.get(bck_url, headers=get_headers, cookies={
        'datadome': datadome_cookie})
    logger.debug('check_product_requests ' + url +
                 ', status_code=' + str(res.status_code))
    cookies_datadome = res.cookies['datadome']
    with open("datadome.pkl", "wb") as f:
        pickle.dump(cookies_datadome, f)

    if 403 == res.status_code:
        return False

    if 200 == main_res_status or 200 == res.status_code:
        url_part2 = url[37:-1]
        encode_url_part2 = urllib.parse.quote_plus(url_part2)
        url_part1 = url[0:37]
        # encode_url_part1 = urllib.parse.quote_plus(url_part1)
        encode_url = url_part1 + encode_url_part2 + "/"
        on_find_new_product(encode_url)

    return True


def interceptor(request):
    del request.headers['Referer']  # Delete the header first
    request.headers['Referer'] = 'https://www.hermes.com/'
    request.headers['Origin'] = 'https://www.hermes.com'
    request.headers['User-Agent'] = USER_AGENT
    request.headers['x-hermes-locale'] = 'jp_ja'
    request.headers['x-xsrf-token'] = '942ccbf2-9962-4d3a-b831-cdf9a208fe12'
    # request.headers['sec-fetch-site'] = 'cross-site'


def scrape_selinium(urls):
    global g_is_running

    dirr = os.path.abspath(os.curdir).rsplit("\\", 1)[0] + f"\\userdata_{num}"
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
            check_product_selenium(link)

    driver.close()
    driver.quit()


def scrape_requests(urls):
    global cookies_datadome
    while (g_is_running):
        try:
            with open("datadome.pkl", "rb") as f:
                cookies_datadome = pickle.load(f)
            requests.get(notify_api_url + '/product/on_start_scrape')
        except Exception as e:
            logger.error(e)
        for link in urls:
            check_product_requests(link)
            time.sleep(randint(8, 12))
        break


if __name__ == "__main__":

    df = pd.read_csv(f"picotan_rock_{num}.csv")
    urls = df.iloc[:, 0].values
    logger.debug('Loaded ' + str(len(urls)) + " URLs")

    g_is_running = True
    scrape_requests(urls)
