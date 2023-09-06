import { StatusBar } from 'react-native'
import { NativeBaseProvider } from 'native-base'
import { THEME } from './src/theme'

import { useEffect, useState } from 'react'

import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto'

import { Routes } from '@routes/index'
import { Loading } from '@components/Loading'
import { Notification } from '@components/Notification'

import { AuthContextProvider } from '@contexts/AuthContext'

import OneSignal, {
  NotificationReceivedEvent,
  OSNotification,
} from 'react-native-onesignal'
import { REACT_APP_ONE_SIGNAL_APP_ID } from '@env'

OneSignal.setAppId(String(REACT_APP_ONE_SIGNAL_APP_ID))

OneSignal.promptForPushNotificationsWithUserResponse()

export default function App() {
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold })

  const [notification, setNotification] = useState<OSNotification>()

  useEffect(() => {
    const unsubscribe = OneSignal.setNotificationWillShowInForegroundHandler(
      (notificationRecivedEvent: NotificationReceivedEvent) => {
        const response = notificationRecivedEvent.getNotification()

        setNotification(response)
      },
    )

    return () => unsubscribe
  }, [])

  return (
    <NativeBaseProvider theme={THEME}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <AuthContextProvider>
        {fontsLoaded ? <Routes /> : <Loading />}
      </AuthContextProvider>

      {notification?.title && (
        <Notification
          title={notification.title}
          onClose={() => setNotification(undefined)}
        />
      )}
    </NativeBaseProvider>
  )
}
