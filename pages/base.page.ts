import { Locator, Page } from "@playwright/test";
import { error } from "node:console";

export abstract class BasePage {
    protected readonly page: Page;
    constructor(page: Page) {
        this.page = page;
    }

    async navigate(url: string): Promise<void> {
        try {
            await this.page.goto(url, {
                waitUntil:'domcontentloaded',
                timeout: 60000
            });
            await this.page.waitForLoadState('networkidle', {timeout:10000})
        } catch (error) {
            console.log('Попытка загрузки страницы не удалась')
            throw error;
        }

    }

    async waitForElement(locator: Locator, timeout: number = 5000): Promise<void> {
        await locator.waitFor({ state: 'visible', timeout })
    }

    async isElementVisible(locator: Locator): Promise<boolean> {
        return await locator.isVisible();
    }
    async getText(locator: Locator): Promise<string> {
        return await locator.textContent() || '';
    }

    async scrollToElement(locator: Locator): Promise<void> {
        await locator.scrollIntoViewIfNeeded();
    }

    async takeScreenshot(name: string): Promise<void> {
        await this.page.screenshot({ path: `screenshots/${name}.png` })
    }
}