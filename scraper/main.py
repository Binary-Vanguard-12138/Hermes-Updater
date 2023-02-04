from urllib.parse import urlencode
# from selenium.webdriver.chrome.service import Service
# from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
import pandas as pd
import undetected_chromedriver as uc
from undetected_chromedriver import Chrome, ChromeOptions
from random import randint
import time
import os
import pickle
import urllib
import urllib.parse
import pyautogui
from mailer import send_mail
import requests
from http import HTTPStatus
import json
from logger import get_root_logger
import time
import signal
import sys
import random
import httpagentparser
from helper.launcher import startScheduler
from handler.proxyHandler import ProxyHandler

logger = get_root_logger(__name__)


g_is_running = False
requests_session = requests.Session()

COOKIE_DUMP_FILE = 'cookies.pkl'
# USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
# UA_PLATFORM = '"Windows"'

USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:106.0) Gecko/20100101 Firefox/106.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:105.0) Gecko/20100101 Firefox/105.0",
    "Mozilla/5.0 (X11; Linux x86_64; rv:106.0) Gecko/20100101 Firefox/106.0",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64; rv:105.0) Gecko/20100101 Firefox/105.0",
    "Mozilla/5.0 (Windows NT 10.0; rv:106.0) Gecko/20100101 Firefox/106.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:106.0) Gecko/20100101 Firefox/106.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Safari/605.1.15",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:106.0) Gecko/20100101 Firefox/106.0",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36 Edg/106.0.1370.52",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:105.0) Gecko/20100101 Firefox/105.0",
    "Mozilla/5.0 (X11; Linux x86_64; rv:102.0) Gecko/20100101 Firefox/102.0",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36 Edg/106.0.1370.47",
    "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:105.0) Gecko/20100101 Firefox/105.0",
    "Mozilla/5.0 (Windows NT 10.0; rv:105.0) Gecko/20100101 Firefox/105.0",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 Edg/107.0.1418.35",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36 Edg/106.0.1370.42",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 Edg/107.0.1418.26",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.6.1 Safari/605.1.15",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:102.0) Gecko/20100101 Firefox/102.0",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36 OPR/91.0.4516.77",
    "Mozilla/5.0 (X11; Linux x86_64; rv:103.0) Gecko/20100101 Firefox/103.0",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36 OPR/92.0.0.0",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; rv:91.0) Gecko/20100101 Firefox/91.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64; rv:104.0) Gecko/20100101 Firefox/104.0",
    "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64; rv:91.0) Gecko/20100101 Firefox/91.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.5 Safari/605.1.15",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 Edg/107.0.1418.24",
    "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:106.0) Gecko/20100101 Firefox/106.0",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Safari/605.1.15",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36 OPR/91.0.4516.106",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:107.0) Gecko/20100101 Firefox/107.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:104.0) Gecko/20100101 Firefox/104.0",
    "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; rv:102.0) Gecko/20100101 Firefox/102.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.6 Safari/605.1.15",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:107.0) Gecko/20100101 Firefox/107.0",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.124 YaBrowser/22.9.5.710 Yowser/2.5 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 16_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/109.0.5414.83 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (iPad; CPU OS 16_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/109.0.5414.83 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (iPod; CPU iPhone OS 16_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/109.0.5414.83 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.5359.128 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 10; SM-A205U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.5359.128 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 10; SM-A102U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.5359.128 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 10; SM-G960U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.5359.128 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 10; SM-N960U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.5359.128 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 10; LM-Q720) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.5359.128 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 10; LM-X420) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.5359.128 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 10; LM-Q710(FGN)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.5359.128 Mobile Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:108.0) Gecko/20100101 Firefox/108.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 13.1; rv:108.0) Gecko/20100101 Firefox/108.0",
    "Mozilla/5.0 (X11; Linux i686; rv:108.0) Gecko/20100101 Firefox/108.0",
    "Mozilla/5.0 (X11; Linux x86_64; rv:108.0) Gecko/20100101 Firefox/108.0",
    "Mozilla/5.0 (X11; Ubuntu; Linux i686; rv:108.0) Gecko/20100101 Firefox/108.0",
    "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:108.0) Gecko/20100101 Firefox/108.0",
    "Mozilla/5.0 (X11; Fedora; Linux x86_64; rv:108.0) Gecko/20100101 Firefox/108.0",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 13_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/108.0 Mobile/15E148 Safari/605.1.15",
    "Mozilla/5.0 (iPad; CPU OS 13_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/108.0 Mobile/15E148 Safari/605.1.15",
    "Mozilla/5.0 (iPod touch; CPU iPhone OS 13_1 like Mac OS X) AppleWebKit/604.5.6 (KHTML, like Gecko) FxiOS/108.0 Mobile/15E148 Safari/605.1.15",
    "Mozilla/5.0 (Android 13; Mobile; rv:68.0) Gecko/68.0 Firefox/108.0",
    "Mozilla/5.0 (Android 13; Mobile; LG-M255; rv:108.0) Gecko/108.0 Firefox/108.0",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:102.0) Gecko/20100101 Firefox/102.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 13.1; rv:102.0) Gecko/20100101 Firefox/102.0",
    "Mozilla/5.0 (X11; Linux i686; rv:102.0) Gecko/20100101 Firefox/102.0",
    "Mozilla/5.0 (Linux x86_64; rv:102.0) Gecko/20100101 Firefox/102.0",
    "Mozilla/5.0 (X11; Ubuntu; Linux i686; rv:102.0) Gecko/20100101 Firefox/102.0",
    "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:102.0) Gecko/20100101 Firefox/102.0",
    "Mozilla/5.0 (X11; Fedora; Linux x86_64; rv:102.0) Gecko/20100101 Firefox/102.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 16_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (iPad; CPU OS 16_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (iPod touch; CPU iPhone 16_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Mobile/15E148 Safari/604.1",
]


def getRandomUserAgent():
    return random.choice(USER_AGENTS)


def getPlatform4UA(uas):
    ua = httpagentparser.detect(uas)
    if 'os' in ua and 'name' in ua['os']:
        return ua['os']['name']
    return 'Windows'


def getRandomProxy():
    proxy_handler = ProxyHandler()
    proxy = proxy_handler.get(True)
    if None == proxy:
        return None
    return {'http': proxy.proxy, 'https': proxy.proxy}


USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
UA_PLATFORM = '"macOS"'

driver: Chrome = None

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
            # logger.debug(response.text)
            pass


def get_encoded_url(url):
    url_part2 = url[37:-1]
    encode_url_part2 = urllib.parse.quote_plus(url_part2)
    url_part1 = url[0:37]
    # encode_url_part1 = urllib.parse.quote_plus(url_part1)
    encode_url = url_part1 + encode_url_part2 + "/"
    return encode_url


def check_product_selenium(url):
    global driver
    logger.debug('check_product_selenium ' + url)
    # driver.request_interceptor = interceptor
    driver.get(url)
    try:
        pyautogui.moveTo(100*randint(0, 10), 100*randint(0, 10),
                         duration=randint(10, 50)/100)
        add_to_cart = driver.find_element(
            By.XPATH, '//button[@name="add-to-cart"]')
        # if add_to_cart and add_to_cart.is_enabled() == True:
        # print(add_to_cart)
        if add_to_cart:
            on_find_new_product(get_encoded_url(url))
    except Exception as e:
        # logger.error(e)
        pass
    # Save the current cookie
    try:
        with open(COOKIE_DUMP_FILE, "wb") as f:
            pickle.dump(driver.get_cookies(), f)
    except Exception as e:
        logger.error(e)


cookies_datadome = None


def check_products_image_requests(url):
    global requests_session
    headers = {
        "user-agent": USER_AGENT
    }
    productsku = url[-11: -1]
    img_url = f'https://assets.hermes.com/is/image/hermesproduct/{productsku}_set'
    try:
        res = requests_session.get(img_url, headers=headers, timeout=10)
        if 200 != res.status_code:
            logger.warn(f'Invalid response {res.status_code} for {url}')
        elif 1000 < len(res._content):
            on_find_new_product(get_encoded_url(url))
    except Exception as e:
        logger.error(e)


def check_product_requests(url):
    global cookies_datadome
    global requests_session
    ua = getRandomUserAgent()
    platform = getPlatform4UA(ua)
    logger.debug(f'{platform} {ua}')

    # cookies = {'datadome': cookies_datadome}

    headers = {
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "ja,en-US;q=0.9,en;q=0.8",
        "user-agent": ua
    }
    proxies = getRandomProxy()
    if None == proxies:
        # Give up if fails to get proxy server
        return False

    try:
        res = requests_session.head(url, headers=headers, proxies=proxies)
        main_res_status = res.status_code
        logger.debug(str(res.status_code) + " " + str(proxies) + " " + url)
        if 200 == res.status_code:
            on_find_new_product(get_encoded_url(url))
            return True
    except Exception as e:
        logger.error(e)

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
    bck_url = 'https://bck.hermes.com/product?productsku=' + productsku
    res = requests.options(bck_url, headers=options_headers)
    if 204 != res.status_code:
        return False
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
    res = requests.get(bck_url, headers=get_headers, proxies=proxies)
    logger.debug('check_product_requests ' + url +
                 ', status_code=' + str(res.status_code))
    cookies_datadome = res.cookies['datadome']
    with open("datadome.pkl", "wb") as f:
        pickle.dump(cookies_datadome, f)

    if 403 == res.status_code:
        return False

    if 200 == main_res_status or 200 == res.status_code:
        on_find_new_product(get_encoded_url(url))

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
    global driver

    user_data_dir = os.path.abspath(os.curdir).rsplit("\\", 1)[
        0] + f"\\userdata_{num}"
    options = ChromeOptions()
    # options.add_argument('--headless')
    options.add_argument('--no-sandbox')
    options.add_argument("--disable-infobars")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-blink-features")
    # options.add_argument("excludeSwitches")
    # options.add_argument(r"user-data-dir={}".format(user_data_dir))
    # options.add_experimental_option(
    #     "excludeSwitches", ['enable-automation', 'enable-logging'])
    options.add_argument("--disable-blink-features=AutomationControlled")
    # options.add_argument("--remote-debugging-port=9222")
    # s = Service(ChromeDriverManager().install())

    if use_proxy.lower() == "y":
        proxy_options = {
            'proxy': {
                'http': f'http://scraperapi:{API_KEY}@proxy-server.scraperapi.com:8001',
                'no_proxy': 'localhost,127.0.0.1'
            }
        }
    else:
        proxy_options = {}
    driver = uc.Chrome(user_data_dir=user_data_dir, options=options)
    # driver = uc.Chrome(service=s, options=options,
    #                    seleniumwire_options=proxy_options)
    driver.maximize_window()
    return
    # driver.implicitly_wait(5)
    driver.get(
        'https://www.hermes.com/jp/ja/category/%E3%83%AC%E3%83%87%E3%82%A3%E3%82%B9/%E3%82%A6%E3%82%A7%E3%82%A2/2023%E5%B9%B4%E6%98%A5%E5%A4%8F%E3%82%B3%E3%83%AC%E3%82%AF%E3%82%B7%E3%83%A7%E3%83%B3/#|')
    driver.implicitly_wait(randint(1, 3))
    pyautogui.moveTo(100*randint(0, 10), 100*randint(0, 10),
                     duration=randint(10, 50)/100)

    try:
        with open(COOKIE_DUMP_FILE, "rb") as f:
            cookies = pickle.load(f)
            for cookie in cookies:
                driver.add_cookie(cookie)
    except Exception as e:
        logger.error(e)

    g_is_running = True

    while (g_is_running):
        try:
            requests.get(notify_api_url + '/product/on_start_scrape')
        except Exception as e:
            logger.error(e)

        for link in urls:
            time.sleep(randint(3, 7))
            check_product_selenium(link)

    driver.close()
    driver.quit()
    logger.info('Finished!')


def scrape_requests(urls):
    global g_is_running
    global cookies_datadome
    while True == g_is_running:
        logger.info(f'Starting a new loop')
        idx = 0
        try:
            if None == cookies_datadome:
                with open("datadome.pkl", "rb") as f:
                    cookies_datadome = pickle.load(f)
            requests.get(notify_api_url + '/product/on_start_scrape')
        except Exception as e:
            logger.error(e)
        for link in urls:
            idx += 1
            if True == is_need_scrape():
                logger.debug(f'#{idx} {link}')
                # check_products_image_requests(link)
                check_product_requests(link)
                time.sleep(randint(9, 12))
            else:
                time.sleep(60)


def signal_handler(sig, frame):
    global g_is_running
    if (signal.SIGINT == sig):
        logger.debug('You pressed Ctrl+C!')
        g_is_running = False


def is_need_scrape():
    return True


def schedule():
    """ 启动调度程序 """
    startScheduler()


def main():
    schedule()
    global g_is_running
    df = pd.read_csv(f"data/picotan_rock_new.csv")
    urls = df.iloc[:, 0].values
    logger.debug('Loaded ' + str(len(urls)) + " URLs")

    g_is_running = True
    # signal.signal(signal.SIGINT, signal_handler)
    # signal.pause()

    scrape_requests(urls)


if __name__ == "__main__":
    main()
