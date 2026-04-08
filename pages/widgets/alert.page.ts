import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "../base.page";

interface AlertButton {
    id: string;
    name: string;
    locator: (page: Page) => Locator;
    buttonType: 'alert' | 'confirm' | 'prompt'
    expectedMessage?: string;
    resultLocator?: (page: Page) => Locator;
     hasDelay?: boolean;
}

export class AlertPage extends BasePage {

    private readonly url = 'https://demoqa.com/alerts';
    private readonly elements: AlertButton[]

    constructor(page: Page) {
        super(page)
        this.elements = [
            {
                id: 'alertButton',
                name: 'Simple Alert',
                locator: (page: Page) => page.locator('#alertButton'),
                buttonType: 'alert',
                expectedMessage: 'You clicked a button',
            },
            {
                id: 'timerButton',
                name: 'Timer Alert',
                locator: (page: Page) => page.locator('#timerAlertButton'),
                buttonType: 'alert',
                expectedMessage: 'This alert appeared after 5 seconds',
                hasDelay: true
            },
            {
                id: 'confirmButton',
                name: 'Confirm Box',
                locator: (page: Page) => page.locator('#confirmButton'),
                buttonType: 'confirm',
                expectedMessage: 'Do you confirm action?',
                resultLocator: (page: Page) => page.locator('#confirmResult')
            },
            {
                id: 'promtButton',
                name: 'Prompt Box',
                locator: (page: Page) => page.locator('#promtButton'),
                buttonType: 'prompt',
                expectedMessage: 'Please enter your name',
                resultLocator: (page: Page) => page.locator('#promptResult')
            },

        ]
    }


    //Кнопка
    private getElement(elementId: string): AlertButton {
        const element = this.elements.find(el => el.id == elementId)
        if (!element) throw new Error(`Element with id ${elementId} not found`)
        return element;

    }

    private getButtonLocator(elementId: string): Locator {
        return this.getElement(elementId).locator(this.page)
    }
    private getResultLocator(elementId: string): Locator | null {
        const element = this.getElement(elementId)
        return element.resultLocator ? element.resultLocator(this.page) : null
    }

    async navigateToPage(): Promise<void> {
        await this.navigate(this.url)
        await this.page.waitForLoadState('networkidle')
    }

    private async handleDialog(elementId: string, action: 'accept' | 'dismiss' = 'accept', inputText?: string): Promise<{ message: string }> {
        const element = this.getElement(elementId)

        let dialogMessage = '';
        const dialogPromise = new Promise<void>((resolve) => {
            this.page.once('dialog', async (dialog) => {
                dialogMessage = dialog.message()
                expect(dialog.type()).toBe(element.buttonType)
                if (action == 'accept') {
                    if (inputText !== undefined) {
                        await dialog.accept(inputText)
                    } else {
                        await dialog.accept()
                    }
                } else {
                    await dialog.dismiss()
                }
                resolve()
            })
        })
        await this.getButtonLocator(elementId).click()
        if (element.hasDelay) {
            await this.page.waitForTimeout(5500)
        }
        await dialogPromise;
        if (element.expectedMessage) {
            expect(dialogMessage).toBe(element.expectedMessage)
        }
        return { message: dialogMessage }
    }

    async verifySimpleAlert(): Promise<void> {
        await this.handleDialog('alertButton', 'accept')
    }
    async verifyTimerAlert(): Promise<void> {
        await this.handleDialog('timerButton', 'accept')
    }
    async verifyConfirmOk(): Promise<void> {
        await this.handleDialog('confirmButton', 'accept')
        const resultLocator = this.getResultLocator('confirmButton')
        if (resultLocator) {
            await expect(resultLocator).toHaveText('You selected Ok')
        }
    }


    async verifyConfirmCancel(): Promise<void> {
        await this.handleDialog('confirmButton', 'dismiss')
        const resultLocator = this.getResultLocator('confirmButton')
        if (resultLocator) {
            await expect(resultLocator).toHaveText('You selected Cancel')
        }
    }
    async verifyPromptWithText(text: string): Promise<void> {
        await this.handleDialog('promtButton', 'accept', text)
        const resultLocator = this.getResultLocator('promtButton')
        if (resultLocator) {
            await expect(resultLocator).toHaveText(`You entered ${text}`)
        }
    }
    async verifyPromptCancel(): Promise<void> {
        await this.handleDialog('promtButton', 'dismiss')
        const resultLocator = this.getResultLocator('promtButton')
        if (resultLocator) {
            await expect(resultLocator).toHaveText(`You entered null`)
        }
    }
        async verifyPromptEmpty(): Promise<void> {
        await this.handleDialog('promtButton', 'accept', '')
        const resultLocator = this.getResultLocator('promtButton')
        if (resultLocator) {
            await expect(resultLocator).not.toBeVisible()
        }
    }
}

