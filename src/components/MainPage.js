import { useNetInfo } from '@react-native-community/netinfo';
import React, { useContext, useEffect, useState } from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import { ColorSchemeContext } from '../App';
import { useLocation } from '../lib/locationService';
import { useCovidData } from '../lib/rki-app';
import { useStyle } from '../lib/styles';
import RkiData from './RkiData';

const MainPage = () => {
  const [
    getLocation,
    county,
    _,
    inGermany,
    setCanLoadAgain,
    loading,
  ] = useLocation();
  const [options, countyData] = useCovidData(county || 'Ansbach', inGermany);
  const [isDark, colors, fontFamily, styles] = useStyle(
    useContext(ColorSchemeContext).colorScheme,
  );

  console.log('county', county);

  // console.log('countyData: ', countyData);

  // console.log('hi from mainpage', county);

  const netInfo = useNetInfo();

  useEffect(() => {
    if (netInfo.isInternetReachable) {
      (async () => {
        await getLocation();
      })();
    }
  }, [getLocation, netInfo, options.isFetching]);

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

  if (inGermany) {
    return (
      <RkiData
        {...{
          data: countyData[currentView],
          canSwitch: countyData.length > 1,
          ...options,
        }}
        toggleView={toggleView}
        setCanLoadAgain={setCanLoadAgain}
        countyLocation={county}
        locationLoading={loading}
      />
    );
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={inGermany}
          onRefresh={async () => {
            setCanLoadAgain(true);
            await getLocation();
          }}
        />
      }
      contentContainerStyle={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.bg,
        color: colors.text2,
      }}>
      <Text style={[styles.text, { fontSize: 30, paddingHorizontal: 20 }]}>
        Make sure you're connected to the internet and you're currently in
        Germany
      </Text>
    </ScrollView>
  );
};

export default MainPage;
