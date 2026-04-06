import { test, expect, Page, Locator } from '@playwright/test';
interface Links {
  locator: (page: Page) => Locator;
  name: string;
  code?: number;
  text?: string;
  expectedURL?: string;
  isApiLink?: boolean;
  opensNewTab?: boolean;

}
const links: Links[] = [
  {
    locator: (page: Page) => page.getByRole('link', { name: 'Home', exact: true }),
    name: 'Home',
    code: 200,
    text: 'Home',
    expectedURL: 'https://demoqa.com/',
    isApiLink: false,
    opensNewTab: true

  },
  {
    locator: (page: Page) => page.locator('#created'),
    name: 'Created',
    code: 201,
    text: 'Link has responded with staus 201 and status text Created',
    isApiLink: true

  },
  {
    locator: (page: Page) => page.locator('#no-content'),
    name: 'No Content',
    code: 204,
    text: 'Link has responded with staus 204 and status text No Content',
    isApiLink: true


  },
  {
    locator: (page: Page) => page.locator('#moved'),
    name: 'Moved',
    code: 301,
    text: 'Link has responded with staus 301 and status text Moved Permanently',
    isApiLink: true

  },
  {
    locator: (page: Page) => page.locator('#bad-request'),
    name: 'Bad Request',
    code: 400,
    text: 'Link has responded with staus 400 and status text Bad Request',
    isApiLink: true

  },
  {
    locator: (page: Page) => page.locator('#unauthorized'),
    name: 'Unauthorized',
    code: 401,
    text: 'Link has responded with staus 401 and status text Unauthorized',
    isApiLink: true

  },
  {
    locator: (page: Page) => page.locator('#forbidden'),
    name: 'Forbidden',
    code: 403,
    text: 'Link has responded with staus 403 and status text Forbidden',
    isApiLink: true

  },
  {
    locator: (page: Page) => page.locator('#invalid-url'),
    name: 'Not Found',
    code: 404,
    text: 'Link has responded with staus 404 and status text Not Found',
    isApiLink: true

  },

]

test.describe('Проверка раздела elements Links', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://demoqa.com/links');
    await page.evaluate(() => localStorage.clear());
    await page.waitForLoadState('networkidle')
  });
  test.describe('Проверка текста ссылки', ()=> {
    for(const link of links){
      test(`Текст ссылки ${link.name} соответствует ожидаемому`, async({page})=>{
        await expect(link.locator(page)).toHaveText(link.name)
      })
    }
  })
  test.describe('Проверка навигационных ссылок', () => {
    const navigation = links.filter(link => !link.isApiLink && link.opensNewTab == true)
    for (const link of navigation) {
      test(`Ссылка "${link.name}" открывает правильный URL в новой вкладке`, async ({ page, context }) => {
        const [newPage] = await Promise.all([
          context.waitForEvent('page'),
          link.locator(page).click()
        ])
        expect(newPage.url()).toBe(link.expectedURL)
        await newPage.close()
        expect(page.url()).toBe('https://demoqa.com/links')
      })
    }


  })

  test.describe('Api-ссылки HTTP status codes', () => {
    const apiLinks = links.filter(link => link.isApiLink)

    for (const link of apiLinks) {
      test(`API ссылка ${link.name} возвращавет код ${link.code}`, async ({ page }) => {
        await link.locator(page).click()
        const response = page.locator('#linkResponse')
        await test.step(`Ответ ${link.name} на странице`, async () => {
          await expect(response).toBeVisible()
        })
        await test.step(`Ответ ${link.name} на странице`, async () => {
          const textContent = await response.textContent()
          expect(textContent).toContain(`staus ${link.code}`)
        })
        await test.step(`Новая вкладка не открылась при click ${link.name}`, async () => {
          const pages = page.context().pages()
          expect(pages.length).toBe(1)
        })

      })

    }
  })

})
