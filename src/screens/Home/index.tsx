import { Group } from '@components/Group'
import { HomeHeader } from '@components/HomeHeader'
import { HStack, VStack } from 'native-base'

export function Home() {
  return (
    <VStack flex={1}>
      <HomeHeader />
      <HStack>
        <Group name="Costa" />
        <Group name="Ombro" />
      </HStack>
    </VStack>
  )
}
