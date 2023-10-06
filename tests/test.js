const { Builder } = require('selenium-webdriver')
const chrome = require('selenium-webdriver/chrome')

;(async function example () {
  const driver = await new Builder().forBrowser('chrome').build()

  try {
    await driver.get('https://www.booking.com/')
  } finally {
    await driver.quit()
  }
})()
