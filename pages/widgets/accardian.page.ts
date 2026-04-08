import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "../base.page";

interface AccordionSection {
    id: string;
    headerId?: string;
    contentId?: string;
    title: string;
    expectedTextPattern: RegExp;
    expectedTextLength: number;
}

export class AccordianPage extends BasePage {

    private readonly url = 'https://demoqa.com/accordian';
    private readonly sections: AccordionSection[] = [
        {
            id: 'section1',
            headerId: 'button:has-text("What is Lorem Ipsum?")',
            contentId: '.accordion-collapse',
            title: 'What is Lorem Ipsum?',
            expectedTextPattern: /Lorem Ipsum is simply dummy text/i,
            expectedTextLength: 100
        },
        {
            id: 'section2',

            headerId: '#section2Heading',
            contentId: '#section2Content',
            title: 'Where does it come from?',
            expectedTextPattern: /Contrary to popular belief, Lorem Ipsum is not simply random text/i,
            expectedTextLength: 200
        },
        {
            id: 'section3',
            headerId: '#section3Heading',
            contentId: '#section3Content',
            title: 'Why do we use it?',
            expectedTextPattern: /distracted by the readable content/i,
            expectedTextLength: 150
        },

    ]

    constructor(page: Page) {
        super(page)
    }


    //Кнопка
    getSectionButton(sectionId: string): Locator {
        const section = this.sections.find(s => s.id == sectionId)
        if (!section) throw new Error(`Header locator for section ${sectionId} not found`)
        return this.page.getByRole('button', { name: `${section.title}` });

    }
    //Контейнер с контентом
    private getSectionContent(sectionId: string): Locator {
        const section = this.sections.find(s => s.id == sectionId)
        if (!section) throw new Error(`Content locator for section ${sectionId} not found`)
        return this.getSectionButton(sectionId).locator('..').locator('..').locator('.accordion-collapse')
    }
    private getSectionBody(sectionId: string): Locator {
        const section = this.sections.find(s => s.id == sectionId);
        if (!section) throw new Error(`Section ${sectionId} not found`)
        return this.getSectionContent(sectionId).locator('.accordion-body')
    }

    getAllSections(): AccordionSection[] {
        return [...this.sections]
    }
    async navigateToPage(): Promise<void> {
        await this.navigate(this.url)
        await this.page.waitForSelector('.accordion', { timeout: 10000 });


    }

    async clickSection(sectionId: string): Promise<void> {
        await this.getSectionButton(sectionId).click()
        await this.page.waitForTimeout(300)
    }

    async isSectionExpanded(sectionId: string): Promise<boolean> {
        const content = this.getSectionContent(sectionId)
        const classAttribute = await content.getAttribute('class')
        if (!classAttribute) return false
        return classAttribute.includes('show')
    }
    async getSectionBodyText(sectionId: string): Promise<string> {
        const body = this.getSectionBody(sectionId)
        await body.waitFor({ state: 'visible', timeout: 5000 })
        return (await body.textContent()) || '';
    }

    async verifySectionTextMatches(sectionId: string): Promise<void> {
        const section = this.sections.find(s => s.id == sectionId)!;
        if (!(await this.isSectionExpanded(sectionId))) {
            await this.clickSection(sectionId)
        }
        const text = await this.getSectionBodyText(sectionId)
        expect(text).toMatch(section.expectedTextPattern)
    }
    // Метод для ОТКРЫТИЯ секции
    async verifySectionBehaviorOpen(sectionId: string): Promise<void> {
        const button = this.getSectionButton(sectionId);
        const content = this.getSectionContent(sectionId);

        // Если секция уже открыта, сначала закроем (чтобы тест был чистым)
        if (await this.isSectionExpanded(sectionId)) {
            await button.click();
            await expect(content).not.toHaveClass(/show/);
            await expect(content).toBeHidden();
        }

        // Открываем секцию
        await button.click();
        await expect(content).toBeVisible();
        await expect(content).toHaveClass(/show/);

        // Проверяем текст содержимого
        await this.verifySectionTextMatches(sectionId);
    }

    // Метод для ЗАКРЫТИЯ секции
    async verifySectionBehaviorClose(sectionId: string): Promise<void> {
        const button = this.getSectionButton(sectionId);
        const content = this.getSectionContent(sectionId);

        // Если секция закрыта, сначала откроем (чтобы было что закрывать)
        if (!(await this.isSectionExpanded(sectionId))) {
            await button.click();
            await expect(content).toBeVisible();
            await expect(content).toHaveClass(/show/);
        }

        // Закрываем секцию
        await button.click();
        await expect(content).not.toHaveClass(/show/);
        await expect(content).toBeHidden();
    }

    async verifySectionsCanNotBeOpenedTogether(sectionId: string[]): Promise<void> {
        let openCount = 0;

        //Закрываем все, если открыто
        for (const id of sectionId) {
            if (await this.isSectionExpanded(id)) {
                await this.clickSection(id)
            }
        }
        //Откпываем по порядку
        for (const id of sectionId) {
            await this.clickSection(id)
        }
        for (const id of sectionId) {
            if (await this.isSectionExpanded(id)) {
                openCount++;
            }
        }
        expect(openCount).toBe(1);
    }
    async verifyContentIsNotEmpty(sectionId: string): Promise<void> {
        if (!(await this.isSectionExpanded(sectionId))) {
            await this.clickSection(sectionId)
        }
        const content = await this.getSectionBodyText(sectionId);
        expect(content.trim().length).toBeGreaterThan(0);
    }
}

