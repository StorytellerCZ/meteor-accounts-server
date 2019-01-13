Package.describe({
  name: 'storyteller:accounts-server',
  version: '1.0.0-alpha.3',
  summary: 'Basic server side for account creation with basic user role and updates to e-mails and username.',
  git: 'https://github.com/StorytellerCZ/meteor-accounts-server',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.5');
  api.use(['meteor', 'ecmascript', 'accounts-password', 'check']);
  api.use([
    'matb33:collection-hooks@0.8.4',
    'alanning:roles@1.2.16',
    'aldeed:collection2@3.0.0',
    'aldeed:schema-index@3.0.0',
    'aldeed:schema-deny@3.0.0'
  ]);
  api.imply([
    'accounts-password',
    'check',
    'matb33:collection-hooks',
    'alanning:roles',
    'aldeed:collection2',
    'aldeed:schema-index',
    'aldeed:schema-deny'
  ]);
  api.mainModule('accounts-server.js', 'server');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('storyteller:accounts-server');
  api.mainModule('accounts-server-tests.js');
});
