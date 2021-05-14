import React, {
  useEffect,
  useRef,
  useState,
  useContext,
  useCallback,
  ReactNode,
} from 'react';
import { Animated, View } from 'react-native';
import { useStyle } from '../lib/styles';
import { Swipeable } from 'react-native-gesture-handler';
import lang from '../lib/lang';
import { ColorSchemeContext } from '../App';

const {
  de: { swipeable },
} = lang;

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
          {willActivate ? swipeable.switchColorMode : swipeable.pullFurther}
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
export function withSwipeable(
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
