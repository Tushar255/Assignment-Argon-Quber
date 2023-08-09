import { Box, Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Textarea, useDisclosure, useToast } from '@chakra-ui/react'
import axios from 'axios';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import SkillBadge from '../SkillBadge';
import { setInfo } from '../../State/infoSlice';

const SkillsModal = () => {
    const description = useSelector((state) => state.info.description)
    const education = useSelector((state) => state.info.education)
    const experience = useSelector((state) => state.info.experience)
    const skills = useSelector((state) => state.info.skills)

    const token = useSelector((state) => state.auth.token);

    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast();
    const [addSkill, setAddSkill] = useState(skills);
    const [skill, setSkill] = useState("");
    const [nextSkillId, setNextSkillId] = useState(skills.length + 1);

    const handleKeyPress = (event) => {
        if (event.key === 'Enter' && skill !== "") {
            const newSkill = {
                id: nextSkillId,
                skill
            };

            setAddSkill((prevSkills) => [...prevSkills, newSkill]);
            setSkill("");
            setNextSkillId((prev) => prev + 1);
        }
    };
    const deleteSkill = (sid) => {
        setAddSkill((prev) => prev.filter((s) => s.id !== sid));
    }

    const dispatch = useDispatch();

    const handleSave = async () => {
        if (addSkill === "") {
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

            const { data } = await axios.put("http://localhost:4545/info/update/skills", {
                skills: addSkill
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
                    skills: data.skills.skills,
                    experience: experience,
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
                        Edit Skills
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
                                addSkill.map((s) => (
                                    <SkillBadge
                                        key={s.id}
                                        skill={s.skill}
                                        handleFunction={() => deleteSkill(s.id)}
                                    />
                                ))
                            }
                            <Input
                                value={skill}
                                placeholder='Add your skills'
                                border='1px solid black'
                                onChange={(e) => setSkill(e.target.value)}
                                onKeyDown={handleKeyPress}
                            />
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

export default SkillsModal