import { Box, Button, Flex, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Textarea, useDisclosure, useToast } from '@chakra-ui/react'
import axios from 'axios';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Experience from '../Experience';
import { setInfo } from '../../State/infoSlice';

const ExperienceModal = () => {
    const token = useSelector((state) => state.auth.token);
    const description = useSelector((state) => state.info.description)
    const education = useSelector((state) => state.info.education)
    const experience = useSelector((state) => state.info.experience)
    const skills = useSelector((state) => state.info.skills)

    const [addExperience, setAddExperience] = useState(experience);
    const [company, setCompany] = useState("")
    const [expFrom, setExpFrom] = useState(null)
    const [expTo, setExpTo] = useState(null)
    const [position, setPosition] = useState("")
    const [describe, setDescribe] = useState("")
    const [nextExperienceId, setNextExperienceId] = useState(experience.length + 1);

    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast();

    const dispatch = useDispatch();

    const handleSave = async () => {
        if (addExperience === "") {
            toast({
                title: "Empty field",
                status: "warning",
                duration: 2000,
                isClosable: true,
                position: "top"
            });
            return;
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Conetnt-type": "application/json"
                }
            };

            const { data } = await axios.put("https://tsb-backend-tole.onrender.com/info/update/experience", {
                experience: addExperience
            }, config);

            toast({
                title: data.msg,
                status: "success",
                duration: 2000,
                isClosable: true,
                position: "top"
            });

            dispatch(
                setInfo({
                    description: description,
                    skills: skills,
                    experience: data.experience.experience,
                    education: education
                })
            );

            onClose();
        } catch (err) {
            toast({
                title: err.response.data.error,
                status: "failure",
                duration: 2000,
                isClosable: true,
                position: "top"
            });
        }
    }

    const handleAddExperience = () => {
        if (company === "" || position === "" || describe === "") {
            return toast({
                title: "Empty fields",
                status: "error",
                duration: 2000,
                isClosable: true,
                position: "bottom-right"
            });
        }

        const yearRegex = /^\d{4}$/;

        if (yearRegex.test(expFrom)) {
            if (!yearRegex.test(expTo)) {
                return toast({
                    title: "Enter a valid year",
                    status: "error",
                    duration: 2000,
                    isClosable: true,
                    position: "top"
                });
            }
        } else {
            return toast({
                title: "Enter a valid year",
                status: "error",
                duration: 2000,
                isClosable: true,
                position: "top"
            });
        }

        const newExperience = {
            id: nextExperienceId,
            company,
            position,
            describe,
            expFrom,
            expTo
        };

        setAddExperience((prev) => [...prev, newExperience]);
        setCompany("")
        setExpFrom(null)
        setExpTo(null)
        setPosition("")
        setDescribe("")
        setNextExperienceId((prevId) => prevId + 1);
    }
    const handleDeleteExperience = (experienceId) => {
        setAddExperience((prev) => prev.filter((exp) => exp.id !== experienceId));
    };

    return (
        <>
            <Text ml='3'
                color='blue'
                _hover={{ color: 'black', cursor: 'pointer' }}
                onClick={onOpen}
            >
                edit
            </Text>

            <Modal size="xl" isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize="40px"
                        fontFamily="Work sans"
                        display="flex"
                        justifyContent="center"
                    >
                        Edit
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display="flex"
                        flexDirection="column"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Box w='100%'>
                            {
                                addExperience && addExperience.length > 0 ? addExperience.map((e, idx) => (
                                    <Experience
                                        key={e.id}
                                        from={e.expFrom}
                                        to={e.expTo}
                                        company={e.company}
                                        position={e.position}
                                        description={e.describe}
                                        handleFunction={() => handleDeleteExperience(e.id)}
                                        hover={{ cursor: 'pointer', bg: 'gray' }}
                                    />
                                ))
                                    :
                                    ''
                            }
                            <Input
                                value={company}
                                size={'sm'}
                                border='1px solid black'
                                placeholder='Company Name?'
                                onChange={(e) => setCompany(e.target.value)}
                            />
                            <Input
                                value={expFrom ? expFrom : ''}
                                size={'sm'}
                                border='1px solid black'
                                placeholder='From....'
                                onChange={(e) => setExpFrom(e.target.value)}
                            />
                            <Input
                                value={expTo ? expTo : ''}
                                size={'sm'}
                                border='1px solid black'
                                placeholder='To....'
                                onChange={(e) => setExpTo(e.target.value)}
                            />
                            <Input
                                value={position}
                                size={'sm'}
                                border='1px solid black'
                                placeholder='Position Name'
                                onChange={(e) => setPosition(e.target.value)}
                            />
                            <Input
                                value={describe}
                                size={'sm'} mb='2'
                                border='1px solid black'
                                placeholder='About position?'
                                onChange={(e) => setDescribe(e.target.value)}
                            />
                            <Flex w='100%' justify={{ base: 'center', lg: 'start' }}>
                                <Button
                                    bg='hsl(29.4deg 89.35% 66.86%)'
                                    border='1px solid black'
                                    size='sm' w='fit-content'
                                    color='black'
                                    onClick={handleAddExperience}
                                >
                                    Add Experience
                                </Button>
                            </Flex>
                        </Box>
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            colorScheme='green'
                            mr={3}
                            onClick={() => handleSave()}
                        >
                            Done
                        </Button>

                        <Button
                            colorScheme='red'
                            mr={3}
                            onClick={onClose}
                        >
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default ExperienceModal