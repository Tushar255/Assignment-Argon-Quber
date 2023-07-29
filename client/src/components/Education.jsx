import { Flex, Text } from '@chakra-ui/react'
import React from 'react'

const Education = ({ from, to, institute, degree }) => {
    return (
        <Flex w='100%' mb='5'>
            <Text as='b'>{from} - {to}</Text>

            <Flex
                flexDir={'column'}
                ml='10'
            >
                <Text as='b'>{institute}</Text>
                <Text>{degree}</Text>
            </Flex>
        </Flex>
    )
}

export default Education