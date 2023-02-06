const fs = require('fs');
const axios = require('axios');
const puppeteer = require('puppeteer-extra')
const process = require("process");
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const nodeoutlook = require('nodejs-nodemailer-outlook');
const logger = require('../../helpers/logger');

puppeteer.use(StealthPlugin())

var page = null;
//var target_mail_address = "volodfree34@gmail.com"
var target_mail_address = "us.sangawa3104@gmail.com"
var allItems = []
let newLine = []
const notify_api_url = 'http://127.0.0.1:5000/api/notify';

const load_product_list = async () => {
  const path = 'data/products.csv'

  try {
    if (fs.existsSync(path)) {
      //file exists
      var data = fs.readFileSync(path)
        .toString() // convert Buffer to string
        .split('\n') // split string to lines
        .map(e => e.trim()) // remove white spaces for each line
        .map(e => e.split(',').map(e => e.trim())); // split each line to array 

      for (var i = 0; i < data.length; i++) {
        allItems.push(data[i][0] + "")
      }
      logger.info(`Loaded ${allItems.length} products from list`)
    } else {
      allItems = [];
    }
  } catch (err) {
    logger.error(err)
  }
}

//const scrapOne = async (pos) => {  
const _scrapOne = async () => {
  const d = new Date();
  var hours = d.getHours();
  if (hours < 8 || hours > 20) {
    logger.debug(`Not in working time, skipping...`);
    return;
  }
  var pos = 21
  var product_category_str = "人気バッグ"
  if (pos == 3) product_category_str = "エヴリン16"
  if (pos == 20) product_category_str = "人気バッグ"
  if (pos == 22) product_category_str = "ピコタン"
  if (pos == 29) product_category_str = "リンディミニ"
  if (pos == 32) product_category_str = "ロデオ"

  // var r_pos = (pos - 1) % 32 + 1
  //for(var i=0;i<allItems.length;i++){  
  //let selector = `#userSearchContainer > div > li:nth-child(${r_pos}) > a`
  try {
    await page.waitForTimeout(3000)
    await axios.get(notify_api_url + '/product/on_start_scrape');
    //await page.click(selector)  
    for (var i = 0; i < allItems.length; i++) {
      // let card_deck_selector_a = `#cardsContainer > div:nth-child(1) > div:nth-child(1) > div.cardImg.container > a`
      //await page.click(card_deck_selector_a)
      //const currentURL = "https://www.hermes.com/jp/ja/product/スニーカー-《ゲーム》-H231728ZH78410/"
      const productURL = allItems[i]
      await page.goto(productURL, {
        waitUntil: 'networkidle0'
      });
      //await page.waitForTimeout(1000)

      var r_href_val_part1 = productURL.substring(0, 37)
      var r_href_val_part2 = productURL.substring(37, productURL.length - 1)
      var encode_url_r_href_val_part2 = encodeURIComponent(r_href_val_part2)
      var encode_url_r_href_val = r_href_val_part1 + encode_url_r_href_val_part2 + "/"
      logger.debug('encode_url_r_href_val:' + encode_url_r_href_val)

      const exists = await page.$eval("#tabpanel0 > button > div", () => true).catch(() => false)
      if (exists) {
        /*
        fs.appendFile('List_Product.csv', productURL + ",\n", (err) => {
          if (err) console.error('Couldn\'t append the data');
          console.log('The data was appended to product file!');
        });

        nodeoutlook.sendEmail({
          auth: {
            user: "smartdev1228_7@outlook.com",
            pass: "solomon1228"
          },
          from: 'smartdev1228_7@outlook.com',
          to: target_mail_address + ',dek201229@gmail.com',
          subject: 'エルメスオンライン更新',
          html: product_category_str + 'が更新されました。<br/>' + encode_url_r_href_val,
          text: 'This is text version!',
          replyTo: 'dek201229@gmail.com',
          attachments: [

          ],
          onError: (e) => logger.error(e),
          onSuccess: (i) => logger.info(i)
        }
        );
        */
        logger.info(`Found!!! ${productURL}`);
        await axios.post(notify_api_url + '/product/on_find_new', { url: productURL });
      } else {
        logger.debug(`${productURL} not found`);
      }
      await page.waitForTimeout(50000 + Math.random() * 20000)
      //setTimeout(4000 + Math.random()*4000)
    }
    //await page.waitForTimeout(500)
    /*const currentURL = page.url()    
    await page.goto(currentURL, {
      waitUntil: 'networkidle0' 
    });
    await page.waitForTimeout(2000)*/
  } catch (err) {
    logger.error(err);
    return;
  }
  /*const currentURL = page.url()
  //await page.goto(currentURL);
  await page.goto(currentURL, {
    waitUntil: 'networkidle0' 
  });*/
  //await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
  //await page.waitForTimeout(3000)  
  /*for(var i=0;i<allItems.length;i++){  
    let card_deck_selector_a = `#cardsContainer > div:nth-child(1) > div:nth-child(1) > div.cardImg.container > a`  
    const productURL = allItems[i]
    await page.goto(productURL, {
      waitUntil: 'networkidle0' 
    });    

    var r_href_val_part1 = productURL.substring(0,37)    
    var r_href_val_part2 = productURL.substring(37,productURL.length-1)    
    var encode_url_r_href_val_part2 = encodeURIComponent(r_href_val_part2)
    var encode_url_r_href_val = r_href_val_part1 + encode_url_r_href_val_part2 + "/"
    console.log('encode_url_r_href_val:' + encode_url_r_href_val)

      const exists = await page.$eval("#tabpanel0 > button > div", () => true).catch(() => false)  
      if(exists){
        let fs = require('fs');      
        
        fs.appendFile('List_Product.csv',  productURL + ",\n", (err) => {
          if (err) console.error('Couldn\'t append the data');
          console.log('The data was appended to product file!');
        });
        
        nodeoutlook.sendEmail({
          auth: {
              user: "smartdev1228_7@outlook.com",
              pass: "solomon1228"
          },
          from: 'smartdev1228_7@outlook.com',
          to: target_mail_address + ',dek201229@gmail.com',
          subject: 'エルメスオンライン更新',
          html: product_category_str + 'が更新されました。<br/>' + encode_url_r_href_val,
          text: 'This is text version!',
          replyTo: 'dek201229@gmail.com',
          attachments: [
                              
                          ],
          onError: (e) => console.log(e),
          onSuccess: (i) => console.log(i)
        }
        );
      }else{
        console.log("NNNNNOOOOOO!!!!!");
      }
      await page.waitForTimeout(4000 + Math.random()*4000)      
      //setTimeout(4000 + Math.random()*4000)
  }*/
  // await page.goto('https://www.aupdater.com/dashboard', {
  //   waitUntil: 'networkidle0' 
  // });
  await page.waitForTimeout(1000)
}

async function scrapOne() {
  try {
    await _scrapOne();
  } catch (err) {
    // await page.goto('https://www.aupdater.com/dashboard', {
    //   waitUntil: 'networkidle0' 
    // });    
    await page.goto('https://www.hermes.com/jp/ja/', {
      waitUntil: 'networkidle0'
    });
    await page.waitForTimeout(500000 + Math.random() * 20000)
    logger.error(err);
  }

  const time_out = 50 + (Math.floor(Math.random() * 20));
  setTimeout(scrapOne, time_out * 1000);
}

async function monitorProducts() {
  chromePath = ("win32" === process.platform) ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' : '/Applications/Google Chrome.app/';
  const browser = await puppeteer.launch({
    // args: ['--disable-infobars'],
    ignoreDefaultArgs: ["--enable-automation"],
    // // product: 'firefox',
    executablePath: chromePath,
    headless: false,
    ignoreHTTPSErrors: true,
    slowMo: 0,
    args: ['--window-size=1400,900',
      '--remote-debugging-port=9222',
      "--remote-debugging-address=0.0.0.0", // You know what your doing?
      '--disable-gpu', "--disable-features=IsolateOrigins,site-per-process", '--blink-settings=imagesEnabled=true']
  })

  page = await browser.newPage()
  /*
  await page.waitForTimeout(500)
  await page.goto('https://www.aupdater.com/login/', {
    waitUntil: 'load',
  })

  await page.waitForTimeout(2000)
  await page.waitForSelector('#formBasicEmail')
  await page.type('#formBasicEmail', "hermes.online.push@gmail.com")
  await page.waitForSelector('#formBasicPassword')
  await page.type('#formBasicPassword', "sangawa3104")
  await page.waitForTimeout(500)
  await page.keyboard.press('Enter')
  */

  await load_product_list()
  scrapOne();

  await browser.close
}

module.exports = { monitorProducts }