Package.describe({
  name: 'storyteller:accounts-server',
  version: '1.0.0-alpha.1',
  summary: 'Basic server side for account creation with basic user role and updates to e-mails and username.',
  git: 'https://github.com/StorytellerCZ/meteor-accounts-server',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.4.1');
  api.use(['meteor', 'ecmascript', 'accounts-password', 'check']);
  Npm.depends({'simpl-schema': '1.1.0'});
  api.use(['matb33:collection-hooks@0.8.4', 'alanning:roles@1.2.16'])
  api.imply(['accounts-password', 'check', 'matb33:collection-hooks', 'alanning:roles'])
  api.mainModule('accounts-server.js', 'server');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('storyteller:accounts-server');
  api.mainModule('accounts-server-tests.js');
});
