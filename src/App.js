import 'react-native-gesture-handler';
import React, { createContext, useState } from 'react';
import { Appearance, StatusBar } from 'react-native';
import { QueryClient, QueryClientProvider } from 'react-query';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AnimatedTabBarNavigator } from 'react-native-animated-nav-tab-bar';
import MainPage from './components/MainPage';
import { useStyle } from './lib/styles';
import HistoryScreen from './components/HistoryScreen';
import { HomeIcon, CalendarIcon } from './components/icons';

const queryClient = new QueryClient();

export const ColorSchemeContext = createContext('light');

const Tab = createBottomTabNavigator();

const Tabs = AnimatedTabBarNavigator();

export default function App() {
  const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());
  const [isDark, colors] = useStyle(colorScheme);

  console.log(colors.bg);

  Appearance.addChangeListener(e => {
    setColorScheme(e.colorScheme);
  });

  const toggleColorScheme = () => {
    setColorScheme(c => (c === 'light' ? 'dark' : 'light'));
  };

  return (
    <ColorSchemeContext.Provider value={{ colorScheme, toggleColorScheme }}>
      <QueryClientProvider client={queryClient}>
        <StatusBar
          barStyle={isDark() ? 'light-content' : 'dark-content'}
          backgroundColor={colors.bg}
        />
        <NavigationContainer>
          <Tabs.Navigator
            tabBarOptions={{
              activeBackgroundColor: colors.primary500,
              activeTintColor: '#E5E7EB',
              inactiveTintColor: colors.text,
            }}
            appearance={{
              dotSize: 'small',
              tabBarBackground: colors.tabBar,
              whenInactiveShow: 'label-only',
              shadow: false,
            }}>
            <Tabs.Screen
              name="Home"
              component={MainPage}
              options={{
                tabBarIcon: ({ focused, color, size }) => (
                  <HomeIcon
                    fill={focused ? color : colors.text3}
                    height={size ? size : 24}
                    width={size ? size : 24}
                  />
                ),
              }}
            />
            <Tabs.Screen
              name="History"
              component={HistoryScreen}
              options={{
                tabBarIcon: ({ focused, color, size }) => (
                  <CalendarIcon
                    fill={focused ? color : colors.text3}
                    height={size ? size : 24}
                    width={size ? size : 24}
                  />
                ),
              }}
            />
          </Tabs.Navigator>
        </NavigationContainer>
      </QueryClientProvider>
    </ColorSchemeContext.Provider>
  );
}
