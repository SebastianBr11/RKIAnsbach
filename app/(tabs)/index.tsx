import lang from '@/src/lib/lang'
import { useStyle } from '@/src/lib/styles'
import { ScrollView, Text, View } from 'react-native'

const {
  de: { homeScreen },
} = lang

export default function Index() {
  const { colors, styles } = useStyle()
  return (
    <ScrollView
      contentContainerStyle={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.bg,
      }}>
      <Text style={[styles.text, { fontSize: 30, paddingHorizontal: 20 }]}>
        {homeScreen.default}
      </Text>
    </ScrollView>
  )
}
