import React, { useState, useContext, useMemo } from 'react';
import { View, Button, Platform, Text } from 'react-native';
import { de } from 'date-fns/locale';
import DateTimePicker, { Event } from '@react-native-community/datetimepicker';
import { format, isSameDay } from 'date-fns';
import { useStyle } from '../lib/styles';
import { ColorSchemeContext, CovidDataContext } from '../App';
import { useHistoryData } from '../lib/rki-app';
import { getDateYesterday } from '../lib/util';
import RkiDataLoader from './RkiDataLoader';

const HistoryScreen = () => {
  const [date, setDate] = useState(getDateYesterday());
  const [show, setShow] = useState(false);

  const { colorScheme } = useContext(ColorSchemeContext);
  const { countyData } = useContext(CovidDataContext);
  const { styles } = useStyle(colorScheme);

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

  return (
    <View
      style={[
        styles.container,
        {
          alignItems: 'center',
          justifyContent: 'space-around',
          padding: 30,
          flex: 1,
        },
      ]}>
      <Button onPress={showDatepicker} title="Show date picker!" />
      <Text>selected date {format(date, 'dd MM yyyy', { locale: de })}</Text>

      {options.isLoading ? (
        <RkiDataLoader />
      ) : (
        <View>
          {agsList.map(ags => (
            <Text key={ags}>
              {historyData[ags]?.name}{' '}
              {
                historyData[ags]?.history.find(f => isSameDay(f.date, date))
                  ?.incidence
              }
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
    </View>
  );
};

export default HistoryScreen;
