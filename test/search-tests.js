const { Builder, By, until } = require('selenium-webdriver')
const chai = require('chai')
const { expect } = chai

describe('Search page tests', function () {
  this.timeout(50000)
  let location = 'Opatija'
  let checkInDate = '2023-11-01'
  let checkOutDate = '2023-11-02'
  const timeout = 10000

  beforeEach(async function () {
    driver = await new Builder().forBrowser('chrome').build()
    await driver.get('https://www.booking.com/')
    const cookies = By.id('onetrust-reject-all-handler')
    await driver.wait(until.elementLocated(cookies), timeout).click()
  }),
    afterEach(async function () {
      await driver.quit()
    }),
    it('Get a list of stays for 2 adults and a given destination', async function () {
      await driver.findElement(By.id(':re:')).sendKeys(location)
      await driver
        .findElement(By.css('[data-testid="date-display-field-start"]'))
        .click()
      await driver.findElement(By.css(`[data-date="${checkInDate}"]`)).click()
      await driver.findElement(By.css(`[data-date="${checkOutDate}"]`)).click()
      await driver.findElement(By.css('[type="submit"]')).click()

      const address = await driver
        .findElement(By.css('[data-testid="address"]'))
        .getText()
      const numberOfGuests = await driver
        .findElement(By.css('[data-testid="price-for-x-nights"]'))
        .getText()
      expect(address === location && numberOfGuests.includes('2 adults')).to.be
        .true
    }),
    it('Display message alert for searching stays with undefined destination', async function () {
      await new Promise(resolve => setTimeout(resolve, 1000))
      await driver.findElement(By.css('[type="submit"]')).click()
      const alert = await driver.findElement(
        By.css('[data-testid="searchbox-alert"]')
      )
      expect(alert).to.exist
    }),
    it('Get a list of stays for 2 adults and a child in a given destination', async function () {
      await driver.findElement(By.id(':re:')).sendKeys(location)
      await driver
        .findElement(By.css('[data-testid="date-display-field-start"]'))
        .click()
      await driver.findElement(By.css(`[data-date="${checkInDate}"]`)).click()
      await driver.findElement(By.css(`[data-date="${checkOutDate}"]`)).click()
      await driver
        .findElement(By.css('[data-testid="occupancy-config"]'))
        .click()

      const addChildBtn = await driver
        .findElement(
          By.xpath(
            '//*[@id="indexsearch"]/div[2]/div/form/div[1]/div[3]/div/div/div/div/div[2]/div[2]/button[2]'
          )
        )
        .click()
      await driver.findElement(By.name('age')).click()
      await driver.findElement(By.css('[data-key="0"]')).click()
      await driver.findElement(By.css('[type="submit"]')).click()
      const address = await driver
        .findElement(By.css('[data-testid="address"]'))
        .getText()
      const numberOfGuests = await driver
        .findElement(By.css('[data-testid="price-for-x-nights"]'))
        .getText()

      expect(
        address === location && numberOfGuests.includes('2 adults, 1 child')
      ).to.be.true
    }),
    it('Get empty list for no available stays', async function () {
      location = 'Našice'
      checkInDate = '2023-10-28'
      checkOutDate = '2023-10-29'
      await driver.findElement(By.id(':re:')).sendKeys(location)
      await driver
        .findElement(By.css('[data-testid="date-display-field-start"]'))
        .click()
      await driver.findElement(By.css(`[data-date="${checkInDate}"]`)).click()
      await driver.findElement(By.css(`[data-date="${checkOutDate}"]`)).click()
      const occupancyBtn = await driver.findElement(
        By.css('[data-testid="occupancy-config"]')
      )
      await driver.wait(until.elementIsEnabled(occupancyBtn), timeout).click()
      const addAdultBtn = await driver.findElement(
        By.xpath(
          '//*[@id="indexsearch"]/div[2]/div/form/div[1]/div[3]/div/div/div/div/div[1]/div[2]/button[2]'
        )
      )
      await driver.wait(until.elementIsVisible(addAdultBtn), timeout)
      await driver.wait(until.elementIsEnabled(addAdultBtn), timeout)
      for (let i = 0; i < 28; i++) {
        addAdultBtn.click()
      }
      await driver.findElement(By.css('[type="submit"]')).click()
      await new Promise(resolve => setTimeout(resolve, 2000))
      const emptyList = await driver.findElement(
        By.css('[data-testid="properties-list-empty-state"]')
      )
      expect(emptyList).to.exist
    })
})
