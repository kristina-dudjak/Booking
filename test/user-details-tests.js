const { Builder, By, until } = require('selenium-webdriver')
const chai = require('chai')
const { expect } = chai

describe('User details page tests', function () {
  this.timeout(50000)
  let firstname = 'John'
  let lastname = 'Doe'
  let email = 'john.doe@gmail.com'
  let phone = '+385911111111'
  const timeout = 10000

  beforeEach(async function () {
    driver = await new Builder().forBrowser('chrome').build()
    await driver.get(
      'https://secure.booking.com/book.html?hotel_id=19718&aid=304142&label=gen173nr-1FCAEoggI46AdIM1gEaGWIAQGYAQm4ARfIAQzYAQHoAQH4AQyIAgGoAgO4AvfbgakGwAIB0gIkZjRjM2JiMjUtYWE4MS00NTRjLTg2ZmQtMmFhMjVhOTYxYzA22AIG4AIB&sid=2eebc9bec25974dbd4fef18590f5dfd9&room1=A%2CA&error_url=%2Fhotel%2Fhr%2Fbristolhotelopatija.en-gb.html%3Faid%3D304142%26label%3Dgen173nr-1FCAEoggI46AdIM1gEaGWIAQGYAQm4ARfIAQzYAQHoAQH4AQyIAgGoAgO4AvfbgakGwAIB0gIkZjRjM2JiMjUtYWE4MS00NTRjLTg2ZmQtMmFhMjVhOTYxYzA22AIG4AIB%26sid%3D2eebc9bec25974dbd4fef18590f5dfd9%26srpvid%3D4381792fe0850169%26%26&hostname=www.booking.com&stage=1&checkin=2023-11-01&interval=1&children_extrabeds=&srpvid=4381792fe0850169&hp_visits_num=1&rt_pos_selected=1&rt_pos_selected_within_room=1&rt_selected_block_position=1&rt_num_blocks=61&rt_num_rooms=6&rt_num_blocks_per_room=%7B%221971810%22%3A11%2C%221971802%22%3A11%2C%221971809%22%3A11%2C%221971821%22%3A6%2C%221971819%22%3A11%2C%221971820%22%3A11%7D&rt_relevance_metric_id=47fe5e32-83e2-4267-9aea-cdf8fae53289&rt_pageview_id=2f578c48fcab01d8&rt_pos_final=1.1&rt_selected_total_price=78&rt_cheapest_search_price=78&from_source=hotel&nr_rooms_1971802_95144458_0_34_0=1'
    )
    const cookies = By.id('onetrust-reject-all-handler')
    await driver.wait(until.elementLocated(cookies), timeout).click()
  }),
    afterEach(async function () {
      await driver.quit()
    }),
    it('Fill out user details and go to the final page', async function () {
      const pageTitle = await driver.getTitle()
      let redirectTitle
      await driver.findElement(By.id('firstname')).sendKeys(firstname)
      await driver.findElement(By.id('lastname')).sendKeys(lastname)
      await driver.findElement(By.id('email')).sendKeys(email)
      await driver.findElement(By.id('phone')).sendKeys(phone)
      await driver.findElement(By.id('checkin_eta_hour')).click()
      await driver
        .findElement(By.xpath('//*[@id="checkin_eta_hour"]/option[2]'))
        .click()
      await driver.findElement(By.id('checkin_eta_hour')).click()
      await driver.findElement(By.name('book')).click()
      await driver.wait(async function () {
        redirectTitle = await driver.getTitle()
        return redirectTitle !== pageTitle
      }, 30000)
      expect(redirectTitle).to.equal('Booking.com: Final Details')
    }),
    it('Display warning message for trying to navigate to final details page with empty user information', async function () {
      await new Promise(resolve => setTimeout(resolve, 1000))
      const bookBtn = await driver.findElement(By.name('book'))
      await driver.wait(until.elementIsVisible(bookBtn), timeout)
      await driver.wait(until.elementIsEnabled(bookBtn), timeout).click()
      const alertElement = await driver.findElement(By.id('validation-errors'))
      await driver.wait(until.elementIsVisible(alertElement), timeout)
      const alertText = await alertElement.getText()
      expect(alertText).to.not.equal('')
    }),
    it('Display warning message for providing too long first name input', async function () {
      firstname =
        'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
      await driver.findElement(By.id('firstname')).sendKeys(firstname)
      await driver.findElement(By.tagName('body')).click()
      const alertElement = await driver.findElement(
        By.id('bp_form_firstname_msg')
      )
      await driver.wait(until.elementIsVisible(alertElement), timeout)
      const alertText = await alertElement.getText()
      expect(alertText).to.not.equal('')
    }),
    it('Display warning message for providing too long last name input', async function () {
      lastname = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
      await driver.findElement(By.id('lastname')).sendKeys(lastname)
      await driver.findElement(By.tagName('body')).click()
      const alertElement = await driver.findElement(
        By.id('bp_form_lastname_msg')
      )
      await driver.wait(until.elementIsVisible(alertElement), timeout)
      const alertText = await alertElement.getText()
      expect(alertText).to.not.equal('')
    }),
    it('Display warning message for invalid email address', async function () {
      email = 'a'
      await driver.findElement(By.id('email')).sendKeys(email)
      await driver.findElement(By.tagName('body')).click()
      const alertElement = await driver.findElement(By.id('bp_form_email_msg'))
      await driver.wait(until.elementIsVisible(alertElement), timeout)
      const alertText = await alertElement.getText()
      expect(alertText).to.not.equal('')
    }),
    it('Display warning message for invalid phone input', async function () {
      phone = '123'
      await driver.findElement(By.id('phone')).sendKeys(phone)
      await driver.findElement(By.tagName('body')).click()
      const alertElement = await driver.findElement(By.id('bp_form_phone_msg'))
      await driver.wait(until.elementIsVisible(alertElement), timeout)
      const alertText = await alertElement.getText()
      expect(alertText).to.not.equal('')
    }),
    it('Display warning message for not selecting arrival times', async function () {
      firstname = 'John'
      lastname = 'Doe'
      email = 'john.doe@gmail.com'
      phone = '+385911111111'
      const pageTitle = await driver.getTitle()
      let redirectTitle
      await driver.findElement(By.id('firstname')).sendKeys(firstname)
      await driver.findElement(By.id('lastname')).sendKeys(lastname)
      await driver.findElement(By.id('email')).sendKeys(email)
      await driver.findElement(By.id('phone')).sendKeys(phone)
      await driver.findElement(By.name('book')).click()
      await driver.wait(async function () {
        redirectTitle = await driver.getTitle()
        return redirectTitle !== pageTitle
      }, 30000)
      expect(redirectTitle).to.not.equal('Booking.com: Final Details')
    })
})
