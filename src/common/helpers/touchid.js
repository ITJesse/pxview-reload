import { NativeModules } from 'react-native';

const NativePasscodeAuth = NativeModules.PasscodeAuth;

export const PasscodeAuth = {
  isSupported() {
    return new Promise((resolve, reject) => {
      NativePasscodeAuth.isSupported(error => {
        if (error) {
          return reject(error.message);
        }
        return resolve(true);
      });
    });
  },
  authenticate(reason) {
    let authReason;
    // Set auth reason
    if (reason) {
      authReason = reason;
      // Set as empty string if no reason is passed
    } else {
      authReason = ' ';
    }
    return new Promise((resolve, reject) => {
      NativePasscodeAuth.authenticate(authReason, error => {
        // Return error if rejected
        if (error) {
          return reject(error.message);
        }
        return resolve(true);
      });
    });
  },
};

export default PasscodeAuth;
