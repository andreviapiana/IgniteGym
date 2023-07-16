import { Group } from '@components/Group'
import { HomeHeader } from '@components/HomeHeader'
import { HStack, Heading, VStack, Text } from 'native-base'
import { useState } from 'react'
import { FlatList } from 'react-native'

export function Home() {
  const [groupSelected, setGroupSelected] = useState('Costa')

  const [groups, setGroups] = useState(['Costas', 'Bíceps', 'Tríceps', 'Ombro'])

  return (
    <VStack flex={1}>
      <HomeHeader />

      <FlatList
        data={groups}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <Group
            name={item}
            isActive={groupSelected === item}
            onPress={() => setGroupSelected(item)}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        _contentContainerStyle={{ px: 8 }}
        my={10}
        maxH={10}
      />

      <VStack px={8}>
        <HStack justifyContent="space-between" mb={5}>
          <Heading color="gray.200" fontSize="md">
            Exercícios
          </Heading>

          <Text color="gray.200" fontSize="sm">
            4
          </Text>
        </HStack>
      </VStack>
    </VStack>
  )
}
