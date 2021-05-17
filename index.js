import 'react-native-gesture-handler';
/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import restartOnError from './src/error/restartOnError';

restartOnError();

AppRegistry.registerComponent(appName, () => App);
