import { Box, Button, Flex, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Textarea, useDisclosure, useToast } from '@chakra-ui/react'
import axios from 'axios';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Education from '../Education';
import { setInfo } from '../../State/infoSlice';

const EducationModal = () => {
    const token = useSelector((state) => state.auth.token);
    const description = useSelector((state) => state.info.description)
    const education = useSelector((state) => state.info.education)
    const experience = useSelector((state) => state.info.experience)
    const skills = useSelector((state) => state.info.skills)

    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast();
    const [addEducation, setAddEducation] = useState(education);
    const [institute, setInstitute] = useState("")
    const [eduFrom, setEduFrom] = useState(null)
    const [eduTo, setEduTo] = useState(null)
    const [degree, setDegree] = useState("")
    const [nextEducationId, setNextEducationId] = useState(education.length + 1);

    const dispatch = useDispatch();

    const handleSave = async () => {
        if (addEducation.length === 0) {
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

            const { data } = await axios.put("https://tsb-backend-tole.onrender.com/info/update/education", {
                education: addEducation
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
                    experience: experience,
                    education: data.education.education
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

    const handleAddEducation = () => {
        if (institute === "" || degree === "") {
            return toast({
                title: "Empty fields",
                status: "error",
                duration: 2000,
                isClosable: true,
                position: "bottom"
            });
        }
        const yearRegex = /^\d{4}$/;

        if (yearRegex.test(eduFrom)) {
            if (!yearRegex.test(eduTo)) {
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

        const newEducation = {
            id: nextEducationId,
            institute,
            degree,
            eduFrom,
            eduTo,
        };

        setAddEducation((prev) => [...prev, newEducation]);
        setInstitute("")
        setEduFrom(null)
        setEduTo(null)
        setDegree("")
        setNextEducationId((prevId) => prevId + 1);
    }
    const handleDeleteEducation = (educationId) => {
        setAddEducation((prev) => prev.filter((edu) => edu.id !== educationId));
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
                                addEducation && addEducation.length > 0 ? addEducation.map((e) => (
                                    <Education
                                        key={e.id}
                                        from={e.eduFrom}
                                        to={e.eduTo}
                                        institute={e.institute}
                                        degree={e.degree}
                                        handleFunction={() => handleDeleteEducation(e.id)}
                                        hover={{ cursor: 'pointer', bg: 'gray' }}
                                    />
                                ))
                                    :
                                    ''
                            }
                            <Input
                                value={institute}
                                size={'sm'}
                                border='1px solid black'
                                placeholder='Institute Name'
                                onChange={(e) => setInstitute(e.target.value)}
                            />
                            <Input
                                value={eduFrom ? eduFrom : ''}
                                size={'sm'}
                                border='1px solid black'
                                placeholder='From....'
                                onChange={(e) => setEduFrom(e.target.value)}
                            />
                            <Input
                                value={eduTo ? eduTo : ''}
                                size={'sm'}
                                border='1px solid black'
                                placeholder='To....'
                                onChange={(e) => setEduTo(e.target.value)}
                            />
                            <Input
                                value={degree}
                                size={'sm'} mb='2'
                                border='1px solid black'
                                placeholder='Degree?'
                                onChange={(e) => setDegree(e.target.value)}
                            />
                            <Flex w='100%' justify={{ base: 'center', lg: 'start' }}>
                                <Button
                                    bg='hsl(29.4deg 89.35% 66.86%)'
                                    border='1px solid black'
                                    size='sm' w='fit-content'
                                    color='black'
                                    onClick={handleAddEducation}
                                >
                                    Add Education
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

export default EducationModal