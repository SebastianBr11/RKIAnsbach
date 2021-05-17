import { Alert } from 'react-native';
import RNRestart from 'react-native-restart';
import {
  JSExceptionHandler,
  setJSExceptionHandler,
  NativeExceptionHandler,
  setNativeExceptionHandler,
} from 'react-native-exception-handler';

const jsErrorHandler: JSExceptionHandler = (e, isFatal) => {
  if (isFatal) {
    Alert.alert(
      'Unerwarteter Fehler aufgetreten',
      `
        Error: ${isFatal ? 'Fatal:' : ''} ${e.name} ${e.message}
        Die App muss neugestartet werden.
        `,
      [
        {
          text: 'Neustarten',
          onPress: () => {
            RNRestart.Restart();
          },
        },
      ],
    );
  } else {
    console.log(e); // So that we can see it in the ADB logs in case of Android if needed
  }
};

const nativeErrorHandler: NativeExceptionHandler = _exceptionString => {};

export default () => {
  setNativeExceptionHandler(nativeErrorHandler, false);
  setJSExceptionHandler(jsErrorHandler);
};
