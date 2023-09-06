import { DefaultTheme, NavigationContainer } from '@react-navigation/native'
import { Box, useTheme } from 'native-base'

import { AuthRoutes } from './auth.routes'
import { AppRoutes } from './app.routes'

import { useAuth } from '@hooks/useAuth'
import { Loading } from '@components/Loading'
import { Notification } from '@components/Notification'

import OneSignal, {
  NotificationReceivedEvent,
  OSNotification,
} from 'react-native-onesignal'
import { useEffect, useState } from 'react'

const linking = {
  prefixes: ['IgniteGym://', 'com.rocketseat.ignitegym://'],
  config: {
    screens: {
      exercise: {
        path: 'exercise/:exerciseId',
        parse: {
          exerciseId: (exerciseId: string) => exerciseId,
        },
      },
    },
  },
}

export function Routes() {
  const [notification, setNotification] = useState<OSNotification>()

  const { colors } = useTheme()

  const theme = DefaultTheme
  theme.colors.background = colors.gray[700]

  useEffect(() => {
    const unsubscribe = OneSignal.setNotificationWillShowInForegroundHandler(
      (notificationRecivedEvent: NotificationReceivedEvent) => {
        const response = notificationRecivedEvent.getNotification()

        setNotification(response)
      },
    )

    return () => unsubscribe
  }, [])

  const { user, isLoadingUserStorageData } = useAuth()

  if (isLoadingUserStorageData) {
    return <Loading />
  }

  return (
    <Box flex={1} bg="gray.700">
      <NavigationContainer theme={theme} linking={linking}>
        {user.id ? <AppRoutes /> : <AuthRoutes />}

        {notification?.title && (
          <Notification
            data={notification}
            onClose={() => setNotification(undefined)}
          />
        )}
      </NavigationContainer>
    </Box>
  )
}
