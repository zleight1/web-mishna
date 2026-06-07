/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: 'no-core-to-outer',
      severity: 'error',
      from: { path: '^src/core' },
      to: { path: '^src/(content|ui|features|app)' },
    },
    {
      name: 'no-cross-feature-imports',
      severity: 'error',
      from: { path: '^src/features/([^/]+)/' },
      to: {
        path: '^src/features/([^/]+)/',
        pathNot: ['^src/features/$1/', '^src/features/activities/registry', '^src/features/visual/registry'],
      },
    },
  ],
  options: { doNotFollow: { path: 'node_modules' } },
}
