# accounts-server

Basic schema and methods for accounts.

## How to use

You import the package with all its parts on your server as follows:

```javascript
import { accountsConfig, accountsMethods } from 'meteor/storyteller:accounts-server';
```

You then call the functions at the appropriate places.

### Settings

`accountsConfig` establishes the schema for the user collection, security (can only change it from the server), sending validation e-mail after registration and adding the user to the basid user group (`user`).

#### Roles

This package uses `alanning:roles` and automatically adds newly registered users to the `user` group.

### Methods

Once you initialize methods from this package by calling the `accountsMethods();` on your server, you can call any of the following methods from the server via `Meteor.call();`.

**NOTE:** Many of these methods require that you set your emails. Check out the [Meteor Guide](https://guide.meteor.com/accounts.html#email-flows) for how to do that together with setting up the entire flow around it.

#### `accounts.username`

**Params:**
* newUsername {string}

Change username for current logged in user.

#### `accounts.email.add`

**Params:**
* newEmail {string}

Accepts a new e-mail address to be added to the currently logged in user account.

#### `accounts.email.remove`

**Params:**
* newEmail {string}

Removes the given e-mail address from the currently logged in user account.

#### `accounts.email.verify.send`

**Params:**
* email {string}

Sends verification e-mail to the given e-mail address.

#### `accounts.password.reset.email.send`

**Params:**
* email {string}

Sends reset password e-mail to the given e-mail address.
