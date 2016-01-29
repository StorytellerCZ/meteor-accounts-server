Meteor.methods({
  /**
   * Methods for handling account functionality
   * TODO: Add more validation
   */
  accountChangeUsername:function(newUsername){
    check(newUsername, String)
    return Accounts.setUsername(Meteor.userId(), newUsername)
  },
  accountAddEmail:function(newEmail){
    check(newEmail, String)
    return Accounts.addEmail(Meteor.userId(), newEmail)
  },
  accountRemoveEmail:function(email){
    check(email, String)
    return Accounts.removeEmail(Meteor.userId(), email)
  },
  accountVerifyEmailSend:function(email){
    check(email, String)
    return Accounts.sendVerificationEmail(Meteor.userId(), email);
  },
  accountSendResetPassword:function(email){
    check(email, String)
    let user = Accounts.findUserByEmail(email)

    if(user !== null){
      return Accounts.sendResetPasswordEmail(user._id);
    } else {
      return false
    }
  }
});

/**
 * Accounts e-mail templates
 * TODO
 */
Accounts.emailTemplates.siteName = "SITENAME"
Accounts.emailTemplates.from = "Webmaster <no-reply@example.com>"


Accounts.emailTemplates.enrollAccount.subject = function (user) {
   return "Welcome to Awesome Town, " + user.profile.name;
}
Accounts.emailTemplates.enrollAccount.text = function (user, url) {
  return "You have been selected to participate in building a better future!"
    + " To activate your account, simply click the link below:\n\n"
    + url;
}
Accounts.emailTemplates.resetPassword.subject = function (user) {}
Accounts.emailTemplates.resetPassword.html = function (user, url) {}

Accounts.urls.verifyEmail = function (token) {
   return Meteor.absoluteUrl('user/verify-email/'+token);
}

Accounts.emailTemplates.verifyEmail.subject = function (user) {
  return "SITENAME e-mail verification"
}
Accounts.emailTemplates.verifyEmail.html = function (user, url) {
  return
}
