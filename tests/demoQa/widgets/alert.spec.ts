import { test, expect, Page, Locator } from '@playwright/test';
import { AlertPage } from '../../../pages/widgets/alert.page';

test.describe('Проверка раздела Alert - Alert, Frame, Windows', () => {
    let alertPage: AlertPage;
    test.beforeEach(async ({ page }) => {
        alertPage = new AlertPage(page)
        await alertPage.navigateToPage()
    });
    test('Обычеый alert', async () => {
        await alertPage.verifySimpleAlert()

    })
    test('Alert с задержкой 5000ms', async () => {
        await alertPage.verifyTimerAlert()

    })
    test('Confirm Box  - Ok', async () => {
        await alertPage.verifyConfirmOk()

    })
    test('Confirm Box  - Cancel', async () => {
        await alertPage.verifyConfirmCancel()

    })
    test('Prompt Box  - ввод текста', async () => {
        await alertPage.verifyPromptWithText('Hello QA')

    })
    test('Prompt Box  - пустой ввод', async () => {
        await alertPage.verifyPromptEmpty()

    })


})