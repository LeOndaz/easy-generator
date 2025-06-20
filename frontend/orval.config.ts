import { defineConfig } from 'orval';

export default defineConfig({
  api: {
    input: 'http://localhost:3000/api/v1/swagger.yaml',
    output: {
      target: './src/api/api.ts',
      client: 'react-query',
      override: {
        mutator: {
          path: './src/utils/client.ts',
          name: 'customInstance',
        },
      },
    },
  },
}); 