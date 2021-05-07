import React, { useState, useContext } from 'react';
import { View, Button, Platform, Text } from 'react-native';
import { de } from 'date-fns/locale';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { useStyle } from '../lib/styles';
import { ColorSchemeContext } from '../App';
import { Switch } from 'react-native-gesture-handler';

const HistoryScreen = () => {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const { colorScheme, toggleColorScheme } = useContext(ColorSchemeContext);
  const { isDark, colors, fontFamily, styles } = useStyle(colorScheme);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showMode = () => {
    setShow(true);
  };

  const showDatepicker = () => {
    showMode();
  };

  return (
    <View
      style={[
        {
          alignItems: 'center',
          justifyContent: 'space-around',
          padding: 30,
          flex: 1,
        },
        styles.container,
      ]}>
      <View style={{ alignItems: 'center' }}>
        <Text style={[styles.text, { fontSize: 13 }]}>Dark Mode: </Text>
        <Switch
          style={styles.switch}
          trackColor={{ false: colors.text, true: colors.text }}
          thumbColor="#EF4444"
          value={isDark()}
          onValueChange={toggleColorScheme}
        />
      </View>
      <Button onPress={showDatepicker} title="Show date picker!" />
      <Text>selected date {format(date, 'dd MM yyyy', { locale: de })}</Text>

      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          display="default"
          onChange={onChange}
          maximumDate={new Date()}
        />
      )}
    </View>
  );
};

export default HistoryScreen;
