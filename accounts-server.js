/**
 * User settings schema
 *
 */
Accounts.validateNewUser((user) => {
 new SimpleSchema({
   _id: { type: String, regEx: SimpleSchema.RegEx.Id },
   username: {type: String, index: true, unique: true},
   emails: { type: Array },
   'emails.$': { type: Object },
   'emails.$.address': { type: String, regEx: SimpleSchema.RegEx.Email },
   'emails.$.verified': { type: Boolean },
   createdAt:{
       type: Date,
       autoValue: function(){
           if(this.isInsert || !this.isFromTrustedCode){
               return new Date()
           }
       },
       denyUpdate: true
   },
   services: { type: Object, blackbox: true }
 }).validate(user)

 // Return true to allow user creation to proceed
 return true
})

/**
 * Assign basic roles
 */
Meteor.users.after.insert((userId, document)=>{
  Roles.addUsersToRoles(document._id, 'user', Roles.GLOBAL_GROUP)
})

Meteor.methods({
  /**
   * Change username for current logged in user
   * @param {string} newUsername
   */
  accountChangeUsername:function(newUsername){
    check(newUsername, String)
    return Accounts.setUsername(Meteor.userId(), newUsername)
  },
  /**
   * Associate a new e-mail with the user
   * @param {string} newEmail
   */
  accountAddEmail:function(newEmail){
    check(newEmail, String)
    return Accounts.addEmail(Meteor.userId(), newEmail)
  },
  /**
   * Remove the given e-mail from the user
   * @param {string} email
   */
  accountRemoveEmail:function(email){
    check(email, String)
    return Accounts.removeEmail(Meteor.userId(), email)
  },
  /**
   * Sends a verification e-mail to the given e-mail
   * @param {string} email
   */
  accountVerifyEmailSend:function(email){
    check(email, String)
    return Accounts.sendVerificationEmail(Meteor.userId(), email)
  },
  /**
   * Send a reset password link to the given email.
   * @param {string} email
   */
  accountSendResetPassword:function(email){
    check(email, String)
    let user = Accounts.findUserByEmail(email)

    if(user !== null){
      return Accounts.sendResetPasswordEmail(user._id)
    } else {
      return false
    }
  }
})

/**
 * URLs for links send in emails
 */
Accounts.urls.resetPassword = (token) => {
  return Meteor.absoluteUrl('user/reset-password/$token={token}')
}

Accounts.urls.verifyEmail = function (token) {
   return Meteor.absoluteUrl('user/verify-email/$token={token}')
}

/**
 * Accounts e-mail templates
 * TODO
 */
Accounts.emailTemplates.siteName = "SITENAME"
Accounts.emailTemplates.from = "Webmaster <no-reply@example.com>"


Accounts.emailTemplates.enrollAccount.subject = function (user) {
   return "Welcome to Awesome Town, " + user.username
}
Accounts.emailTemplates.enrollAccount.text = function (user, url) {
  return "You have been selected to participate in building a better future!"
    + " To activate your account, simply click the link below:\n\n"
    + url;
}
Accounts.emailTemplates.resetPassword.subject = function (user) {}
Accounts.emailTemplates.resetPassword.html = function (user, url) {}

Accounts.emailTemplates.verifyEmail.subject = function (user) {
  return "SITENAME e-mail verification"
}
Accounts.emailTemplates.verifyEmail.html = function (user, url) {
  return
}
