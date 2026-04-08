import { test, expect, Page, Locator } from '@playwright/test';
import { AccordianPage } from '../../../pages/widgets/accardian.page';

test.describe('Проверка раздела elements Widgets - Accordian', () => {
  let accordianPage: AccordianPage;
  test.beforeEach(async ({ page }) => {
    accordianPage = new AccordianPage(page)
    await accordianPage.navigateToPage()
  });

  test('Проверка первой секции текст и кнопка соответствуют ', async () => {
    const button = await accordianPage.getSectionButton('section1')
    await test.step('Секция изначально открыта', async () => {
      await expect(accordianPage.isSectionExpanded('section1')).resolves.toBe(true)

    })
    await test.step('Текст у кнопки корректный', async () => {
      await expect(button).toBeVisible();
      await expect(button).toHaveText('What is Lorem Ipsum?');


    })
    await test.step('Текст в секции корректный', async () => {
      await accordianPage.verifySectionTextMatches('section1')


    })
    await test.step('Cодержимое первой секции не пустое ', async () => {
      await accordianPage.verifyContentIsNotEmpty('section1')
    })

  })
  test('Проверка второй секции текст и кнопка соответствуют ', async () => {
    const button = await accordianPage.getSectionButton('section2')

    await test.step('Секция изначально закрыта', async () => {
      await expect(accordianPage.isSectionExpanded('section2')).resolves.toBe(false)

    })
    await test.step('Текст у кнопки корректный', async () => {
      await expect(button).toBeVisible();
      await expect(button).toHaveText('Where does it come from?');


    })
    await test.step('Текст в секции корректный', async () => {
      if (!await accordianPage.isSectionExpanded('section2')) {
        await accordianPage.clickSection('section2')
      }
      await accordianPage.verifySectionTextMatches('section2')

    })
    await test.step('Cодержимое второй секции не пустое ', async () => {
      if (!await accordianPage.isSectionExpanded('section2')) {
        await accordianPage.clickSection('section2')
      }
      await accordianPage.verifyContentIsNotEmpty('section2')
    })

  })
  test('Проверка третьей секции текст и кнопка соответствуют ', async () => {
    const button = await accordianPage.getSectionButton('section3')

    await test.step('Секция изначально закрыта', async () => {
      await expect(accordianPage.isSectionExpanded('section3')).resolves.toBe(false)

    })
    await test.step('Текст у кнопки корректный', async () => {
      await expect(button).toBeVisible();
      await expect(button).toHaveText('Why do we use it?');


    })
    await test.step('Текст в секции корректный', async () => {
      if (!await accordianPage.isSectionExpanded('section3')) {
        await accordianPage.clickSection('section3')
      }
      await accordianPage.verifySectionTextMatches('section3')

    })
    await test.step('Cодержимое третьей секции не пустое ', async () => {
      if (!await accordianPage.isSectionExpanded('section3')) {
        await accordianPage.clickSection('section3')
      }
      await accordianPage.verifyContentIsNotEmpty('section3')
    })

  })
  test('Можно открыть один разделов одновременно', async () => {
    await accordianPage.verifySectionsCanNotBeOpenedTogether(['section1', 'section2'])

  })


})
