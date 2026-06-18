const { Builder, By, until } = require('selenium-webdriver')
const chrome = require('selenium-webdriver/chrome')

describe('Selenium - Teste de Interface', () => {
  let driver

  beforeAll(async () => {
    const options = new chrome.Options()
    options.addArguments('--headless', '--no-sandbox', '--disable-dev-shm-usage')
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build()
  }, 30000)

  afterAll(async () => {
    await driver.quit()
  })

  test('deve carregar a página inicial', async () => {
    await driver.get('http://localhost:5000')
    const title = await driver.getTitle()
    expect(title).toBeDefined()
  }, 20000)
})
