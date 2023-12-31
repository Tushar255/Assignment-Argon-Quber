import { Box, Flex, Text } from '@chakra-ui/react'
import React from 'react'

const Experience = ({ from, to, company, position, description, handleFunction, hover }) => {
    return (
        <Flex w='100%' mb='5' onClick={handleFunction} _hover={hover}>
            <Box w='25%'>
                <Text as='b'>{from} - {to}</Text>
                <Text>{company}</Text>
            </Box>

            <Flex
                flexDir={'column'}
                ml='10'
            >
                <Text as='b'>{position}</Text>
                <Text>{description}</Text>
            </Flex>
        </Flex>
    )
}

export default Experience