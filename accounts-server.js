import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import SimpleSchema from 'simpl-schema';
import { Roles } from 'meteor/alanning:roles';
import { check } from 'meteor/check';

const getDataForService = (options, services) => {
  if (services.facebook) return parseFacebookData(services.facebook);
  if (services.github) return parseGithubData(options, services.github);
  if (services.google) return parseGoogleData(services.google);
  return null;
};

/**
 * User settings schema
 *
 */
export function accountsConfig() {
  const userSchema = new SimpleSchema({
    username: {
      type: String,
      // For accounts-password, either emails or username is required, but not both. It is OK to make this
      // optional here because the accounts-password package does its own validation.
      optional: true
    },
    emails: {
      type: Array,
      // For accounts-password, either emails or username is required, but not both. It is OK to make this
      // optional here because the accounts-password package does its own validation.
      optional: true
    },
    'emails.$': {
      type: Object
    },
    'emails.$.address': {
      type: String,
      regEx: SimpleSchema.RegEx.Email
    },
    'emails.$.verified': {
      type: Boolean
    },
    createdAt: {
      type: Date
    },
    profile: {
      type: Object,
      optional: true,
      blackbox: true
    },
    services: {
      type: Object,
      optional: true,
      blackbox: true
    },
    roles: {
      type: Object,
      optional: true,
      blackbox: true
    },
    'roles.$': {
      type: String
    },
    // In order to avoid an 'Exception in setInterval callback' from Meteor
    heartbeat: {
      type: Date,
      optional: true
    }
  });

  Meteor.users.attachSchema(userSchema);

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
    update() {
      return true;
    },
    remove() {
      return true;
    }
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
      if (Package['socialize:user-profile']) {
        Package['socialize:user-profile'].ProfilesCollection.update(
          { _id: this.userId },
          { $set: { username: newUsername } }
        );
      }
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
        throw new Meteor.Error('last-email', "You can't delete your last e-mail.");
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
    }
  });
}
