import test, { expect } from "@playwright/test";
import { TextBoxPage } from "../../../pages/elements/textBox.page";

test.describe('Проверка раздела Elements - Text Box', () => {
    let textBoxPage: TextBoxPage;
    test.beforeEach(async ({ page }) => {
        textBoxPage = new TextBoxPage(page)
        await textBoxPage.navigateToPage()
    })



    test('Успешное заполнение всех полей формы', async () => {
        const validData = {
            fullName: 'User',
            email: 'test@m.ru',
            currentAddress: 'Address',
            permanentAddress: 'Address2',
        }
        await test.step('Заполнить форму валидными данными', async () => {
            await textBoxPage.fillForm(validData)
        })
        await test.step('Нажать Submit', async () => {
            await textBoxPage.clickSubmit()
        })
        await test.step('Проверить Output', async () => {
            await expect(textBoxPage.isOutputVisible()).resolves.toBe(true)
        })
    })

    test('Проверка ввода специальных символов', async () => {
        const specialData = {
            fullName: '!@#$%^&*()_+{}[]|\\;:\'"<>,.?/~`',
            email: 'test@example.com',
            currentAddress: 'Special: !@#$%^&*()_+',
            permanentAddress: 'More: {}[]|\\;:\'"<>,.?/~`'
        }
        await test.step('Заполнить форму специальными символами', async () => {
            await textBoxPage.fillForm(specialData)
        })
        await test.step('Нажать Submit', async () => {
            await textBoxPage.clickSubmit()
        })
        await test.step('Проверить, что спецсимволы отображаются корректно', async () => {
            await expect(textBoxPage.isOutputVisible()).resolves.toBe(true)
            await textBoxPage.verifyOutputContains(specialData)
        })
    })
    test('Проверка защиты от XSS (внедрение JavaScript)', async () => {

        const xssData = {
            fullName: '<script>alert("XSS")</script>',
            email: 'test@example.com',
            currentAddress: '<script>alert("XSS")</script>',
            permanentAddress: '<script>alert("XSS")</script>'
        };
        await test.step('Заполнить форму XSS-скриптами', async () => {
            await textBoxPage.fillForm(xssData)
        })
        await test.step('Нажать Submit', async () => {
            await textBoxPage.clickSubmit()
        })
        await test.step('Проверить, что скрипты не выполнились', async () => {
            await textBoxPage.checkDialogNotTriggered()
        })
        await test.step('Проверить, что Output содержит экранированные скрипты', async () => {
            await textBoxPage.verifyOutputContains(xssData);
        });
    })
    test('Проверка валидации поля Email', async () => {
        const validData = {
            fullName: 'User',
            email: 'test@m.ru',
            currentAddress: 'Address',
            permanentAddress: 'Address2',
        }
        const invalidEmail = [
            { email: 'test-email', description: "без @" },
            { email: 'test@', description: "без домена" },
            { email: '@test.ru', description: "без имени" },
            { email: 'test@test', description: "без доменной зоны" },
            { email: 'test test@test.ru', description: "с пробелом" },
            { email: 'test@test..ru', description: "Две точки подряд" },
            { email: 'тест@test.ru', description: "кириллица" },

        ]
        for (const invalid of invalidEmail) {
            await test.step(`Проверить невалидный email: ${invalid.email} (${invalid.description})`, async () => {
                const invalidData = { ...validData, email: invalid.email }
                await textBoxPage.fillForm(invalidData);
                await textBoxPage.clickSubmit();
                await textBoxPage.verifyEmailFieldHasError()
                await textBoxPage.verifyOutputNotVisible();
                await textBoxPage.clearEmailField()
            })
        }
    })

})