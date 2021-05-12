import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';
import BootSplash from 'react-native-bootsplash';
const bootSplashLogo = require('../assets/bootsplash_logo.png');

interface AnimatedBootSplashProps {
  children: ({
    completeBootSplash,
  }: {
    completeBootSplash: () => void;
  }) => ReactNode;
}

const AnimatedBootSplash = ({ children }: AnimatedBootSplashProps) => {
  const [bootSplashIsVisible, setBootSplashIsVisible] = useState(true);
  const [bootSplashLogoIsLoaded, setBootSplashLogoIsLoaded] = useState(false);
  const opacity = useRef(new Animated.Value(1));
  const translateY = useRef(new Animated.Value(0));

  const init = async () => {
    await BootSplash.hide();

    Animated.stagger(250, [
      Animated.spring(translateY.current, {
        useNativeDriver: true,
        toValue: -50,
      }),
      Animated.spring(translateY.current, {
        useNativeDriver: true,
        toValue: Dimensions.get('window').height,
      }),
    ]).start();

    Animated.timing(opacity.current, {
      useNativeDriver: true,
      toValue: 0,
      duration: 150,
      delay: 350,
    }).start(() => {
      setBootSplashIsVisible(false);
    });
  };

  const completeBootSplash = () => setBootSplashLogoIsLoaded(true);

  useEffect(() => {
    bootSplashLogoIsLoaded && init();
  }, [bootSplashLogoIsLoaded]);

  return (
    <View style={styles.container}>
      {children({ completeBootSplash })}

      {bootSplashIsVisible && (
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            styles.bootsplash,
            { opacity: opacity.current },
          ]}>
          <Animated.Image
            source={bootSplashLogo}
            fadeDuration={0}
            style={[
              styles.logo,
              { transform: [{ translateY: translateY.current }] },
            ]}
          />
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: 24,
    fontWeight: '700',
    margin: 20,
    lineHeight: 30,
    color: '#333',
    textAlign: 'center',
  },
  bootsplash: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    height: 100,
    width: 100,
  },
});

export default AnimatedBootSplash;
