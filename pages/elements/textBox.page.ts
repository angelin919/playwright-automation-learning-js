import { expect, Page } from "@playwright/test";
import { BasePage } from "../base.page";

interface TextBoxData {
    fullName: string;
    email: string;
    currentAddress: string;
    permanentAddress: string;
}

export class TextBoxPage extends BasePage {
    private readonly url = 'https://demoqa.com/text-box'
    private readonly fullNameInput = this.page.locator('#userName')
    private readonly emailInput = this.page.locator('#userEmail')
    private readonly currentAddressInput = this.page.locator('#currentAddress')
    private readonly permanentAddressInput = this.page.locator('#permanentAddress')
    private readonly submitButton = this.page.locator('#submit')

    //Locator Output
    private readonly nameOutput = this.page.locator('#output #name')
    private readonly emailOutput = this.page.locator('#output #email')
    private readonly currentAddressOutput = this.page.locator('#output #currentAddress')
    private readonly permanentAddressOutput = this.page.locator('#output #permanentAddress')
    private readonly blockOutput = this.page.locator("#output")

    constructor(page: Page) {
        super(page)
    }
    async navigateToPage(): Promise<void> {
        await this.navigate(this.url)
        await this.page.waitForLoadState('networkidle')
    }

    async fillForm(data: TextBoxData): Promise<void> {
        await this.fullNameInput.waitFor({ state: 'visible', timeout: 5000 });

        await this.fullNameInput.fill(data.fullName);
        await this.emailInput.fill(data.email);
        await this.currentAddressInput.fill(data.currentAddress);
        await this.permanentAddressInput.fill(data.permanentAddress)
    }

    async clearForm(): Promise<void> {
        await this.fullNameInput.clear()
        await this.emailInput.clear()
        await this.currentAddressInput.clear()
        await this.permanentAddressInput.clear()
    }
    async clearEmailField(): Promise<void> {
        await this.emailInput.clear()
    }

    async clickSubmit(): Promise<void> {
        await this.submitButton.click();
        await this.page.waitForTimeout(500);
    }

    async isOutputVisible(): Promise<boolean> {
        return await this.blockOutput.isVisible()
    }

    async getOutputText(): Promise<{ name: string; email: string; currentAddress: string; permanentAddress: string }> {
        return {
            name: (await this.nameOutput.textContent()) || '',
            email: (await this.emailOutput.textContent()) || '',
            currentAddress: (await this.currentAddressOutput.textContent()) || '',
            permanentAddress: (await this.permanentAddressOutput.textContent()) || ''
        }
    }

    async verifyOutputContains(data: TextBoxData): Promise<void> {
        await expect(this.nameOutput).toContainText(data.fullName);
        await expect(this.emailOutput).toContainText(data.email);
        await expect(this.currentAddressOutput).toContainText(data.currentAddress)
        await expect(this.permanentAddressOutput).toContainText(data.permanentAddress)
    }

    async verifyOutputNotVisible(): Promise<void> {
        await expect(this.blockOutput).toBeHidden()
    }

    async verifyEmailFieldHasError(): Promise<void> {
        const email = this.emailInput;
        const classAttribute = await email.getAttribute('class')
        expect(classAttribute).toContain('field-error')
    }

    async setupDialogHandle(): Promise<{ wasTriggered: () => boolean; getMessage: () => string }> {
        let triggered = false;
        let message = '';
        this.page.on('dialog', async (dialog) => {
            triggered = true
            message = dialog.message()
            await dialog.accept()
        })
        return {
            wasTriggered: () => triggered,
            getMessage: () => message
        }
    }

    async checkDialogNotTriggered(): Promise<void> {
        let triggered = false;

        this.page.on('dialog', async (dialog) => {
            triggered = true
            await dialog.accept();
        })
        await this.page.waitForTimeout(1000)
        expect(triggered).toBe(false)

    }
}