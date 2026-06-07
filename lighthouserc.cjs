module.exports = {
  ci: {
    collect: {
      startServerCommand: 'pnpm preview --port 4173',
      url: ['http://127.0.0.1:4173/'],
      numberOfRuns: 1,
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
      },
    },
  },
}
