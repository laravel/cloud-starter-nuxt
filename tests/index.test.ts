import { fileURLToPath } from 'node:url';
import { $fetch, setup } from '@nuxt/test-utils/e2e';
import { describe, expect, test } from 'vitest';

describe('home page', async () => {
    await setup({ rootDir: fileURLToPath(new URL('..', import.meta.url)) });

    test('renders the welcome screen', async () => {
        const html = await $fetch<string>('/');

        expect(html).toContain('Your Nuxt app is up and running on Laravel Cloud.');
    });
});
