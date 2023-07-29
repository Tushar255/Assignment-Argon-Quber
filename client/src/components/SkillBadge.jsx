import { Badge } from '@chakra-ui/react'
import React from 'react'

const SkillBadge = ({ skill }) => {
    return (
        <Badge
            px={2}
            py={1}
            borderRadius="lg"
            m={1}
            mb={2}
            variant="solid"
            fontSize={{ base: '10', sm: '11', md: '12' }}
            bg='hsl(29.4deg 89.35% 66.86%)'
            color='black'
            cursor="pointer"
            border={'1px solid black'}
        >
            {skill}
        </Badge>
    )
}

export default SkillBadge