import { Flex, Text } from '@chakra-ui/react'
import React from 'react'

const Education = ({ from, to, institute, degree, handleFunction, hover }) => {
    return (
        <Flex w='100%' mb='5'
            onClick={handleFunction} _hover={hover}
        >
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