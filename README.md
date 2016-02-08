[![Stories in Ready](https://badge.waffle.io/StorytellerCZ/meteor-accounts-server.png?label=ready&title=Ready)](https://waffle.io/StorytellerCZ/meteor-accounts-server)
Server functionality to `storyteller:accounts-react-materialize`

NOT FOR PRODUCTION

Methods:
====
`accountChangeUsername`
Accepts a new username

`accountAddEmail`
Accepts a new e-mail address to be added to the user profile

`accountRemoveEmail`
Removes the inputed e-mail address from the user profile

`accountVerifyEmailSend`
Sends verification e-mail to the given address

`accountSendResetPassword`
Sends reset password e-mail to the given e-mail address
NOTE: Reset password flow is not yet implemented

TODO:
====
* More validation
* Reset password process
* E-mails
* Ability to change defaults via a settings file
* Tests
* Handle third party logins
* i18n
