import React, { createContext, useState } from 'react';
import { Appearance, StatusBar } from 'react-native';
import { QueryClient, QueryClientProvider } from 'react-query';
import MainPage from './components/MainPage';
import { useStyle } from './lib/styles';

const queryClient = new QueryClient();

export const ColorSchemeContext = createContext('light');

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

        <MainPage />
      </QueryClientProvider>
    </ColorSchemeContext.Provider>
  );
}
