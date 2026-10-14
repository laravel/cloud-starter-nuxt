import { fileURLToPath } from 'node:url';
import { $fetch, setup } from '@nuxt/test-utils/e2e';
import { describe, expect, test } from 'vitest';

describe('home page', async () => {
    await setup({ rootDir: fileURLToPath(new URL('..', import.meta.url)) });

    test('renders', async () => {
        const html = await $fetch<string>('/');

        expect(html).toContain('<h1>Hello from Laravel Cloud</h1>');
    });
});
