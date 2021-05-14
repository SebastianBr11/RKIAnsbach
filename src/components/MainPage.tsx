import { useNetInfo } from '@react-native-community/netinfo';
import React, { useContext, useState } from 'react';
import { RefreshControl, ScrollView, Text } from 'react-native';
import { ColorSchemeContext, CovidDataContext } from '../App';
import { useStyle } from '../lib/styles';
import RkiData from './RkiData';

const MainPage = () => {
  const netInfo = useNetInfo();
  const { options, countyData, location } = useContext(CovidDataContext);
  const { colors, styles } = useStyle(
    useContext(ColorSchemeContext).colorScheme,
  );

  const [currentView, setCurrentView] = useState(0);

  const toggleView = () => {
    console.log('switching from', currentView);
    if (currentView === countyData.length - 1) {
      console.log('current', currentView);
      setCurrentView(0);
    } else {
      console.log('upping the number');
      setCurrentView(v => v + 1);
    }
  };

  if (location.inGermany) {
    return (
      <RkiData
        {...{
          data: countyData[currentView],
          canSwitch: countyData.length > 1,
          ...options,
        }}
        toggleView={toggleView}
        setCanLoadAgain={location.setCanLoadAgain}
        countyLocation={location.county}
        locationLoading={location.loading}
      />
    );
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={location.inGermany}
          onRefresh={async () => {
            location.setCanLoadAgain(true);
            await location.getLocation(netInfo.isInternetReachable || false);
          }}
        />
      }
      contentContainerStyle={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.bg,
      }}>
      <Text style={[styles.text, { fontSize: 30, paddingHorizontal: 20 }]}>
        Make sure you're connected to the internet and you're currently in
        Germany, then try again
      </Text>
    </ScrollView>
  );
};

export default MainPage;
