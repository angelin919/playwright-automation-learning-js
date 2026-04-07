import { test, expect, Page, Locator } from '@playwright/test';
interface RadioButton {
  locator: (page: Page) => Locator;
  labelLocator: (page: Page) => Locator;
  name: string;
  id: string;
  isDisabled?: boolean;
  expectedMessage?: string;

}
const radioButton: RadioButton[] = [
  {
    locator: (page: Page) => page.locator('#yesRadio'),
    labelLocator: (page: Page) => page.locator('label[for="yesRadio"]'),
    name: 'Yes',
    id: 'yesRadio',
    isDisabled: false,
    expectedMessage: 'You have selected Yes'

  },
  {
    locator: (page: Page) => page.locator('#impressiveRadio'),
    labelLocator: (page: Page) => page.locator('label[for="impressiveRadio"]'),
    name: 'Impressive',
    id: 'impressiveRadio',
    isDisabled: false,
    expectedMessage: 'You have selected Impressive'

  },
  {
    locator: (page: Page) => page.locator('#noRadio'),
    labelLocator: (page: Page) => page.locator('label[for="noRadio"]'),
    name: 'No',
    id: 'noRadio',
    isDisabled: true,
    expectedMessage: 'null'

  },



]

test.describe('Проверка раздела elements Radio Button', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://demoqa.com/radio-button');
    await page.waitForLoadState('networkidle')
  });

  test('Выбор радиокнопки "YES"', async ({ page }) => {
    const button = radioButton.find(btn => btn.name == 'Yes')

    await button?.labelLocator(page).click();
    const successText = page.locator('.mt-3');
    await test.step(`Текст radio button ${button?.name} отображается на странице`, async () => {
      await expect(successText).toBeVisible();

    })
    await test.step(`Текст radio button ${button?.name} отображается корректно`, async () => {
      await expect(successText).toHaveText(button!.expectedMessage!)

    })
    await test.step(`Кнопка radio button ${button?.name} выбрана`, async () => {
      await expect(button!.locator(page)).toBeChecked();

    })

  })

  test('Выбор радиокнопки "Impressive"', async ({ page }) => {
    const button = radioButton.find(btn => btn.name == 'Impressive')

    await button?.labelLocator(page).click();
    const successText = page.locator('.mt-3');
    await test.step(`Текст radio button ${button?.name} отображается на странице`, async () => {
      await expect(successText).toBeVisible();

    })
    await test.step(`Текст radio button ${button?.name} отображается корректно`, async () => {
      await expect(successText).toHaveText(button!.expectedMessage!)

    })
    await test.step(`Кнопка radio button ${button?.name} выбрана`, async () => {
      await expect(button!.locator(page)).toBeChecked();

    })

  })
  test('Кнопка "No" disabled', async ({ page }) => {
    const button = radioButton.find(btn => btn.name == 'No')

    await test.step(`Кнопка ${button?.name} disabled`, async () => {
      await expect(button!.locator(page)).toBeDisabled();

    })
    await test.step(`Label ${button?.name} имеет класс disabled`, async () => {
      await expect(button!.labelLocator(page)).toHaveClass(/disabled/);

    })
    await test.step(`Сообщение ${button?.name} не появляется`, async () => {
      await expect(page.locator('.mt-3')).toBeHidden();

    })

  })

  test('Переключение между "Yes" и "Impressive"', async ({ page }) => {
    const yesButton = radioButton.find(btn => btn.name == 'Yes')!
    const impressiveButton = radioButton.find(btn => btn.name == 'Impressive')!
    const successText = page.locator('.mt-3');


    await test.step(`Выбираем кнопку ${yesButton?.name}, текст на странице соответсвует, кнопка "Impressive" не активна `, async () => {
      await yesButton.labelLocator(page).click();
      await expect(successText).toHaveText(yesButton.expectedMessage!);
      await expect(yesButton.locator(page)).toBeChecked();
      await expect(impressiveButton.locator(page)).not.toBeChecked()

    })
    await test.step(`Выбираем кнопку ${impressiveButton.name}, текст на странице соответсвует, кнопка "Yes" не активна `, async () => {
      await impressiveButton.labelLocator(page).click();
      await expect(successText).toHaveText(impressiveButton.expectedMessage!);
      await expect(impressiveButton.locator(page)).toBeChecked();
      await expect(yesButton.locator(page)).not.toBeChecked()
    })


  })
  test('Проверка состояния по умолчанию', async ({ page }) => {
    const yesButton = radioButton.find(btn => btn.name == 'Yes')
    const impressiveButton = radioButton.find(btn => btn.name == 'Impressive')

    for (const button of radioButton) {
      await test.step(`Кнопка ${button.name} не выбрана`, async () => {
        await expect(button.locator(page)).not.toBeChecked()
      })
    }

    await test.step(`Сообщение на странице отсутствуют`, async () => {
      await expect(page.locator('.mt-3')).toBeHidden();

    })

  })

})
