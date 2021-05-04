import { NativeModules } from 'react-native';
const { ColorThemeModule } = NativeModules;
interface ColorThemeInterface {
  setTheme(color: String, light: boolean): void;
}
console.log(ColorThemeModule);
export default ColorThemeModule as ColorThemeInterface;
