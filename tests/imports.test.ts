describe('import components', () => {
    test('import Footer component', async () => {
        const cmp = await import('../components/common/Footer.vue')
        expect(cmp).toBeDefined()
    })
    test('import MainMenu component', async () => {
        const cmp = await import('../components/common/MainMenu.vue')
        expect(cmp).toBeDefined()
    })
    test('import ScrollTop component', async () => {
        const cmp = await import('../components/common/ScrollTop.vue')
        expect(cmp).toBeDefined()
    })
})

describe('import layouts', () => {
    test('import default layout', async () => {
        const cmp = await import('../layouts/default.vue')
        expect(cmp).toBeDefined()
    })
})

describe('import pages', () => {
    test('import consortium page', async () => {
        const cmp = await import('../pages/consortium.vue')
        expect(cmp).toBeDefined()
    })
    test('import index page', async () => {
        const cmp = await import('../pages/index.vue')
        expect(cmp).toBeDefined()
    })
})