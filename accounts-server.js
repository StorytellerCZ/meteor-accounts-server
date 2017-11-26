import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import SimpleSchema from 'simpl-schema';
import { Roles } from 'meteor/alanning:roles';
import { check } from 'meteor/check';

/**
 * User settings schema
 *
 */
export function accountsConfig() {
  Accounts.validateNewUser((user) => {
    new SimpleSchema({
      _id: { type: String, regEx: SimpleSchema.RegEx.Id },
      username: { type: String, index: true, unique: true },
      emails: { type: Array },
      'emails.$': { type: Object },
      'emails.$.address': { type: String, regEx: SimpleSchema.RegEx.Email },
      'emails.$.verified': { type: Boolean },
      profile: { type: Object, blackbox: true },
      createdAt: {
        type: Date,
        autoValue() {
          if (this.isInsert || !this.isFromTrustedCode) {
            return new Date();
          }
        },
        denyUpdate: true,
      },
      services: { type: Object, blackbox: true },
    }).validate(user);

    // Return true to allow user creation to proceed
    return true;
  });

  /**
   * Assign basic role
   */
  Meteor.users.after.insert((userId, document) => {
    Roles.addUsersToRoles(document._id, 'user', Roles.GLOBAL_GROUP);
    // send verification e-mail
    try {
      Accounts.sendVerificationEmail(document._id);
    } catch (error) {
      throw new Meteor.Error(error);
    }
  });

  // deny updates via non-trusted (client) code
  Meteor.users.deny({
    update() { return true; },
    remove() { return true; },
  });
}
/**
 * ################################################################################################
 * Methods
 */
export function accountsMethods() {
  Meteor.methods({
    /**
     * Change username for current logged in user
     * @param {string} newUsername
     */
    'accounts.username'(newUsername) {
      check(newUsername, String);
      return Accounts.setUsername(this.userId, newUsername);
    },
    /**
     * Associate a new e-mail with the user
     * @param {string} newEmail
     */
    'accounts.email.add'(newEmail) {
      check(newEmail, String);
      return Accounts.addEmail(this.userId, newEmail);
    },
    /**
     * Remove the given e-mail from the user
     * @param {string} email
     */
    'accounts.email.remove'(email) {
      check(email, String);
      // double check that there will be an e-mail left if we remove
      const user = Meteor.users.find({ 'emails.address': email }).fetch();
      if (user[0].emails.length < 2) {
        throw new Meteor.Error('last-email', 'You can\'t delete your last e-mail.');
      } else {
        return Accounts.removeEmail(this.userId, email);
      }
    },
    /**
     * Sends a verification e-mail to the given e-mail
     * @param {string} email
     */
    'accounts.email.verify.send'(email) {
      check(email, String);
      return Meteor.defer(() => {
        return Accounts.sendVerificationEmail(this.userId, email);
      });
    },
    /**
     * Send a reset password link to the given email.
     * @param {string} email
     */
    'accounts.password.reset.email.send'(email) {
      check(email, String);
      let user = Accounts.findUserByEmail(email);

      user = user._id;

      check(user, String);

      if (user !== null) {
        return Meteor.defer(() => {
          return Accounts.sendResetPasswordEmail(user, email);
        });
      } else {
        return false;
      }
    },
  });
}
