Package.describe({
  name: 'storyteller:accounts-server',
  version: '0.1.3',
  // Brief, one-line summary of the package.
  summary: 'Server side package for storyteller:accounts-react-materialize for username and e-mail operations.',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/StorytellerCZ/meteor-accounts-server.git',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use(['meteor', 'ecmascript', 'accounts-password', 'check']);
  api.use(['aldeed:simple-schema@1.5.3', 'matb33:collection-hooks@0.8.1', 'alanning:roles@1.2.14'])
  api.imply(['accounts-password', 'check', 'aldeed:simple-schema', 'matb33:collection-hooks', 'alanning:roles'])
  api.addFiles('accounts-server.js', 'server');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('storyteller:accounts-server');
  api.addFiles('accounts-server-tests.js');
});
