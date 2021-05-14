import DateTimePicker, { Event } from '@react-native-community/datetimepicker';
import { format, isSameDay } from 'date-fns';
import { de } from 'date-fns/locale';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Platform, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ColorSchemeContext, CovidDataContext } from '../App';
import { useHistoryData } from '../lib/rki-app';
import { fontFamily, useStyle } from '../lib/styles';
import { getDateYesterday } from '../lib/util';
import RkiDataLoader from '../components/RkiDataLoader';

const HistoryScreen = () => {
  const [date, setDate] = useState(getDateYesterday());
  const [show, setShow] = useState(false);

  const { colorScheme } = useContext(ColorSchemeContext);
  const { countyData } = useContext(CovidDataContext);
  const { styles, colors, isDark } = useStyle(colorScheme);

  const agsList = useMemo(() => countyData.map(f => f.ags) || [], [countyData]);
  const populationList = useMemo(() => countyData.map(f => f.population), [
    countyData,
  ]);

  const { historyData, options } = useHistoryData(agsList, populationList);

  const onChange = (_event: Event, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showDatepicker = () => {
    setShow(true);
  };

  useEffect(() => {
    setShow(true);
  }, []);

  return (
    <View
      style={[
        styles.container,
        {
          alignItems: 'stretch',
          justifyContent: 'space-evenly',
          padding: 30,
          flex: 1,
        },
      ]}>
      <Text style={[styles.boldText, { fontSize: 50 }]}>
        {format(date, 'dd.MM.yyyy', { locale: de })}
      </Text>

      {options.isLoading ? (
        <RkiDataLoader />
      ) : (
        <View
          style={{
            backgroundColor: colors.tabBar,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 9,
            },
            shadowOpacity: 0.23,
            shadowRadius: 15,
            elevation: isDark() ? 0 : 15,
            paddingVertical: 30,
            paddingHorizontal: 30,
            // borderColor: colors.tabBar,
            // borderWidth: 3,
            borderRadius: 5,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {agsList.map((ags, i) => (
            <Text
              style={[
                styles.dateText,
                {
                  fontSize: 20,
                  color: colors.text4,
                  marginTop: i === 0 ? 0 : 30,
                  fontFamily: fontFamily.light,
                },
              ]}
              key={ags}>
              {historyData[ags]?.name}{' '}
              <Text
                style={{
                  fontFamily: fontFamily.medium,
                  color: colors.primary500,
                  fontSize: 24,
                  flex: 1,
                  alignItems: 'center',
                }}>
                {historyData[ags]?.history
                  .find(f => isSameDay(f.date, date))
                  ?.incidence?.toFixed(2) || '--'}
              </Text>
            </Text>
          ))}
        </View>
      )}
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          display="default"
          onChange={onChange}
          minimumDate={new Date(2020, 2, 20)}
          maximumDate={getDateYesterday()}
        />
      )}
      <TouchableOpacity style={[styles.button]} onPress={showDatepicker}>
        <Text style={[styles.buttonText, { textAlign: 'center' }]}>
          Show Date Picker!
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default HistoryScreen;
