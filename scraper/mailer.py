import smtplib
import yaml


def interceptor(request):
    del request.headers['Referer']  # Delete the header first
    request.headers['Referer'] = 'https://www.hermes.com/'
    del request.headers['User-Agent']
    request.headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'


def load_conf_file(config_file):
    with open(config_file, "r") as f:
        config = yaml.safe_load(f)
        inputs = [i["EMAIL_CONFIGS"] for i in config]
    return inputs[0]


def send_mail(txt):
    dt = load_conf_file('./config.yml')
    message = 'Subject: {}\n{}'.format("A New Product Arrived", txt)
    open('results.md', 'a').writelines(message + '\n' + 50*"*-" + '\n')
    try:
        smtp_server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
        smtp_server.ehlo()
        smtp_server.login(dt['EMAIL_HOST_USER'], dt['EMAIL_HOST_PASSWORD'])
        smtp_server.sendmail(dt['EMAIL_HOST_USER'], dt['to'], message)
        smtp_server.close()
        print("\033[92m""Email sent successfully!""\033[0m")
    except Exception as ex:
        print("\033[91m""Something went wrong….""\033[0m", ex)
