const { Builder, By, until } = require('selenium-webdriver')
const chai = require('chai')
const { expect } = chai

describe('Property info page tests', function () {
  this.timeout(50000)
  const timeout = 10000

  beforeEach(async function () {
    driver = await new Builder().forBrowser('chrome').build()
  }),
    afterEach(async function () {
      await driver.quit()
    }),
    it('Navigate to property info page by image click', async function () {
      await driver.get(
        'https://www.booking.com/searchresults.en-gb.html?ss=Opatija%2C+Croatia&efdco=1&label=gen173nr-1BCAEoggI46AdIM1gEaGWIAQGYAQm4ARfIAQzYAQHoAQGIAgGoAgO4AvfbgakGwAIB0gIkZjRjM2JiMjUtYWE4MS00NTRjLTg2ZmQtMmFhMjVhOTYxYzA22AIF4AIB&sid=2eebc9bec25974dbd4fef18590f5dfd9&aid=304142&lang=en-gb&sb=1&src_elem=sb&src=index&dest_id=-90715&dest_type=city&checkin=2023-11-01&checkout=2023-11-02&group_adults=2&no_rooms=1&sb_travel_purpose=leisure'
      )
      const cookies = By.id('onetrust-reject-all-handler')
      await driver.wait(until.elementLocated(cookies), timeout).click()
      const title = await driver
        .findElement(By.css('[data-testid="title"]'))
        .getText()
      await driver
        .findElement(
          By.css('[data-testid="property-card-desktop-single-image"]')
        )
        .click()
      const windowHandles = await driver.getAllWindowHandles()
      const newWindowHandle = windowHandles[1]
      await driver.switchTo().window(newWindowHandle)
      const secondTitle = await driver
        .findElement(By.className('pp-header__title'))
        .getText()
      expect(secondTitle).to.equal(title)
    }),
    it('Reserve a stay and go to user details page', async function () {
      await driver.get(
        'https://www.booking.com/hotel/hr/bristolhotelopatija.en-gb.html?aid=304142&label=gen173nr-1FCAEoggI46AdIM1gEaGWIAQGYAQm4ARfIAQzYAQHoAQH4AQyIAgGoAgO4AvfbgakGwAIB0gIkZjRjM2JiMjUtYWE4MS00NTRjLTg2ZmQtMmFhMjVhOTYxYzA22AIG4AIB&sid=2eebc9bec25974dbd4fef18590f5dfd9&all_sr_blocks=1971802_95144458_0_34_0;checkin=2023-11-01;checkout=2023-11-02;dest_id=-90715;dest_type=city;dist=0;group_adults=2;group_children=0;hapos=1;highlighted_blocks=1971802_95144458_0_34_0;hpos=1;matching_block_id=1971802_95144458_0_34_0;no_rooms=1;req_adults=2;req_children=0;room1=A%2CA;sb_price_type=total;sr_order=popularity;sr_pri_blocks=1971802_95144458_0_34_0__7817;srepoch=1696698850;srpvid=4381792fe0850169;type=total;ucfs=1&#hotelTmpl'
      )
      const cookies = By.id('onetrust-reject-all-handler')
      await driver.wait(until.elementLocated(cookies), timeout).click()
      await driver.findElement(By.id('hp_book_now_button')).click()
      const pageTitle = await driver.getTitle()
      let redirectTitle
      await new Promise(resolve => setTimeout(resolve, 1000))
      await driver
        .findElement(
          By.css('button[data-tooltip-class="submit_holder_button_tooltip"]')
        )
        .click()
      await driver.wait(async function () {
        redirectTitle = await driver.getTitle()
        return redirectTitle !== pageTitle
      }, timeout)
      expect(redirectTitle).to.equal('Booking.com: Your details')
    }),
    it('Display warning message for attempt to reserve 0 rooms', async function () {
      await driver.get(
        'https://www.booking.com/hotel/hr/bristolhotelopatija.en-gb.html?aid=304142&label=gen173nr-1FCAEoggI46AdIM1gEaGWIAQGYAQm4ARfIAQzYAQHoAQH4AQyIAgGoAgO4AvfbgakGwAIB0gIkZjRjM2JiMjUtYWE4MS00NTRjLTg2ZmQtMmFhMjVhOTYxYzA22AIG4AIB&sid=2eebc9bec25974dbd4fef18590f5dfd9&all_sr_blocks=1971802_95144458_0_34_0;checkin=2023-11-01;checkout=2023-11-02;dest_id=-90715;dest_type=city;dist=0;group_adults=2;group_children=0;hapos=1;highlighted_blocks=1971802_95144458_0_34_0;hpos=1;matching_block_id=1971802_95144458_0_34_0;no_rooms=1;req_adults=2;req_children=0;room1=A%2CA;sb_price_type=total;sr_order=popularity;sr_pri_blocks=1971802_95144458_0_34_0__7817;srepoch=1696698850;srpvid=4381792fe0850169;type=total;ucfs=1&#hotelTmpl'
      )
      const cookies = By.id('onetrust-reject-all-handler')
      await driver.wait(until.elementLocated(cookies), timeout).click()
      await driver.findElement(By.id('hp_book_now_button')).click()
      await new Promise(resolve => setTimeout(resolve, 1000))
      const roomsSelector = By.css('[data-testid="select-room-trigger"]')
      const roomsElement = await driver.wait(
        until.elementLocated(roomsSelector),
        timeout
      )
      await driver.wait(until.elementIsVisible(roomsElement), timeout).click()
      await driver
        .findElement(
          By.xpath(
            '//*[@id="hprt_nos_select_1971802_95144458_0_34_0"]/option[1]'
          )
        )
        .click()
      await driver.findElement(By.className('js-reservation-button')).click()
      const alertSelector = By.className('select_room_tooltip_alert_container')
      const alertElement = await driver.wait(
        until.elementLocated(alertSelector),
        timeout
      )
      expect(alertElement).to.exist
    })
})
