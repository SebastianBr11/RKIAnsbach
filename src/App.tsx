import React, {
  createContext,
  useEffect,
  useRef,
  useState,
  useContext,
  useCallback,
  ReactNode,
} from 'react';
import {
  Animated,
  Appearance,
  ColorSchemeName,
  LogBox,
  StatusBar,
  View,
} from 'react-native';
import {
  QueryClient,
  QueryClientProvider,
  QueryObserverResult,
  RefetchOptions,
} from 'react-query';
import { NavigationContainer } from '@react-navigation/native';
import {
  AnimatedTabBarNavigator,
  DotSize,
  TabElementDisplayOptions,
} from 'react-native-animated-nav-tab-bar';
import MainPage from './components/MainPage';
import { useStyle } from './lib/styles';
import HistoryScreen from './components/HistoryScreen';
import { HomeIcon, CalendarIcon } from './components/icons';
import ColorThemeModule from './modules/ColorThemeModule';
import { Swipeable } from 'react-native-gesture-handler';
import AnimatedBootSplash from './components/AnimatedBootSplash';
import { CovidCountyData, CovidData } from './types/CovidData.d';
import { useCovidData } from './lib/rki-app';
import { useLocation } from './lib/locationService';
import { useNetInfo } from '@react-native-community/netinfo';

LogBox.ignoreLogs(['Setting a timer']);

const queryClient = new QueryClient();

export interface AppContextInterface {
  colorScheme: ColorSchemeName;
  toggleColorScheme: () => void;
}

export const ColorSchemeContext = createContext<AppContextInterface>({
  colorScheme: 'light',
  toggleColorScheme: () => {},
});

export interface ICovidDataContext {
  countyData: CovidCountyData[];
  setCountyData: React.Dispatch<React.SetStateAction<CovidCountyData[]>>;
  options: {
    isSuccess: boolean;
    error: Error | null;
    isError: boolean;
    isLoading: boolean;
    isFetching: boolean;
    refetch: (
      options?: RefetchOptions | undefined,
    ) => Promise<QueryObserverResult<CovidData, Error>>;
    status: 'idle' | 'error' | 'loading' | 'success';
  };
  location: {
    getLocation: (hasInternet: boolean) => Promise<void>;
    county: string | null;
    inGermany: boolean;
    setCanLoadAgain: React.Dispatch<React.SetStateAction<boolean>>;
    loading: boolean;
  };
}

export const CovidDataContext = createContext<ICovidDataContext>(
  {} as ICovidDataContext,
);

export const CovidDataContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const {
    getLocation,
    county,
    inGermany,
    setCanLoadAgain,
    loading,
  } = useLocation();
  const covidData = useCovidData(county || 'Ansbach', inGermany);
  const [countyData, setCountyData] = useState<CovidCountyData[]>([]);
  const netInfo = useNetInfo();

  useEffect(() => {
    if (netInfo.isInternetReachable) {
      (async () => {
        await getLocation(true);
      })();
    } else {
      (async () => await getLocation(false))();
    }
  }, [getLocation, netInfo, covidData.options.isFetching]);

  useEffect(() => {
    if (covidData.countyData.length === 0) {
      return;
    }

    if (covidData.countyData && covidData.newCounty) {
      setCountyData(covidData.countyData);
      covidData.setNewCounty(false);
    }
  }, [county, covidData, covidData.countyData, covidData.newCounty]);

  return (
    <CovidDataContext.Provider
      value={{
        countyData,
        setCountyData,
        options: covidData.options,
        location: { getLocation, county, inGermany, setCanLoadAgain, loading },
      }}>
      {children}
    </CovidDataContext.Provider>
  );
};

const Tabs = AnimatedTabBarNavigator();

interface SwipeableComponentProps {
  children: ReactNode;
}

const SwipeableComponent = ({ children }: SwipeableComponentProps) => {
  const { colorScheme, toggleColorScheme } = useContext(ColorSchemeContext);
  const { styles, colors } = useStyle(colorScheme);

  const [willActivate, setWillActivate] = useState<Boolean>(false);
  const swipeableRef = useRef<Swipeable>(null);

  const renderLeftActions = (
    progress: Animated.AnimatedInterpolation,
    _dragX: Animated.AnimatedInterpolation,
  ) => {
    const trans = progress.interpolate({
      inputRange: [0, 0.5, 0.8, 0.85, 1],
      outputRange: [-200, -100, -50, -25, 0],
      extrapolate: 'clamp',
    });

    progress.addListener(val => {
      if (willActivate !== val.value >= 1) {
        setWillActivate(val.value >= 1);
      }
    });

    return (
      <Animated.View
        style={{
          backgroundColor: colors.loader.backgroundColor,
          transform: [{ translateX: trans }],
          width: 200,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20,
        }}>
        <Animated.Text
          style={{ color: colors.text3, fontSize: 20, textAlign: 'center' }}>
          {willActivate ? 'Switch Color Mode' : 'Pull further 👉'}
        </Animated.Text>
      </Animated.View>
    );
  };

  const onSwipeableWillOpen = () => {
    console.log('opened');
    toggleColorScheme();
    // setTimeout(() => swipeableRef.current?.close(), 0);
  };

  return (
    <Swipeable
      ref={swipeableRef}
      onSwipeableWillOpen={onSwipeableWillOpen}
      renderLeftActions={useCallback(renderLeftActions, [renderLeftActions])}
      leftThreshold={200}
      containerStyle={[
        styles.container,
        {
          alignItems: 'center',
          flex: 1,
        },
      ]}>
      {children}
    </Swipeable>
  );
};

function withSwipeable(
  Component: React.ElementType | React.ComponentType<any>,
) {
  return () => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
      setIsLoaded(true);

      return () => setIsLoaded(false);
    }, []);

    if (!isLoaded) return <View />;

    return (
      <SwipeableComponent>
        <Component />
      </SwipeableComponent>
    );
  };
}

export default function App() {
  const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());
  const { isDark, colors } = useStyle(colorScheme);

  Appearance.addChangeListener(e => {
    setColorScheme(e.colorScheme);
    ColorThemeModule.setTheme(
      e.colorScheme === 'light' ? '#ffffff' : '#222835',
      isDark(),
    );
  });

  const toggleColorScheme = () => {
    ColorThemeModule.setTheme(
      colorScheme === 'light' ? '#222835' : '#ffffff',
      isDark(),
    );
    setColorScheme(c => (c === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    console.log('colorscheme', colorScheme);
    return ColorThemeModule.setTheme(
      colorScheme === 'light' ? '#ffffff' : '#222835',
      isDark(),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ColorSchemeContext.Provider value={{ colorScheme, toggleColorScheme }}>
      <QueryClientProvider client={queryClient}>
        <StatusBar
          barStyle={isDark() ? 'light-content' : 'dark-content'}
          backgroundColor={colors.bg}
        />
        <CovidDataContextProvider>
          <AnimatedBootSplash>
            {({ completeBootSplash }) => (
              <NavigationContainer onReady={completeBootSplash}>
                <Tabs.Navigator
                  tabBarOptions={{
                    activeBackgroundColor: colors.text3,
                    activeTintColor: colors.tabBarText,
                    inactiveTintColor: colors.text,
                  }}
                  appearance={{
                    dotSize: DotSize.SMALL,
                    tabBarBackground: colors.tabBar,
                    whenInactiveShow: TabElementDisplayOptions.ICON_ONLY,
                  }}>
                  <Tabs.Screen
                    component={withSwipeable(MainPage)}
                    name="Home"
                    options={{
                      tabBarIcon: ({
                        focused,
                        color,
                        size,
                      }: {
                        focused: boolean;
                        color: string;
                        size: number;
                      }) => (
                        <HomeIcon
                          fill={focused ? color : colors.text3}
                          height={size ? size : 24}
                          width={size ? size : 24}
                        />
                      ),
                    }}
                  />
                  <Tabs.Screen
                    component={withSwipeable(HistoryScreen)}
                    name="History"
                    options={{
                      tabBarIcon: ({
                        focused,
                        color,
                        size,
                      }: {
                        focused: boolean;
                        color: string;
                        size: number;
                      }) => (
                        <CalendarIcon
                          fill={focused ? color : colors.text3}
                          height={size ? size : 24}
                          width={size ? size : 24}
                        />
                      ),
                    }}
                  />
                  {/* {() => (
                  <SwipeableComponent>
                  <HistoryScreen />
                  </SwipeableComponent>
                  )}
                </Tabs.Screen> */}
                </Tabs.Navigator>
              </NavigationContainer>
            )}
          </AnimatedBootSplash>
        </CovidDataContextProvider>
      </QueryClientProvider>
    </ColorSchemeContext.Provider>
  );
}
