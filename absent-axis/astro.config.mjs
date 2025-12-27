// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  integrations: [
    starlight({
      title: 'FluxSec',
      sidebar: [
        {
          label: 'Sistemas 101',
          items: [
            {
              label: 'Fundamentos teóricos',
              autogenerate: { directory: 'sistemas-101/fundamentos-teoricos' },
            },
            {
              label: 'Laboratorios',
              autogenerate: { directory: 'sistemas-101/laboratorios' },
            },
            {
              label: 'Referencias',
              autogenerate: { directory: 'sistemas-101/referencias' },
            },
          ],
        },
        {
          label: 'Criptografía',
          items: [
            {
              label: 'Fundamentos teóricos',
              autogenerate: { directory: 'criptografia/fundamentos-teoricos' },
            },
            {
              label: 'Laboratorios',
              autogenerate: { directory: 'criptografia/laboratorios' },
            },
            {
              label: 'Referencias',
              autogenerate: { directory: 'criptografia/referencias' },
            },
          ],
        },
      ],
    }),
  ],
});
