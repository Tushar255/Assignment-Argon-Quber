import { Button, FormControl, FormLabel, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Textarea, useDisclosure, useToast } from '@chakra-ui/react'
import axios from 'axios';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setInfo } from '../../State/infoSlice';

const DescriptionModal = () => {
    const token = useSelector((state) => state.auth.token)
    const description = useSelector((state) => state.info.description)
    const education = useSelector((state) => state.info.education)
    const experience = useSelector((state) => state.info.experience)
    const skills = useSelector((state) => state.info.skills)

    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast();
    const [addDesciption, setAddDesciption] = useState(description);
    const dispatch = useDispatch();

    const handleSave = async () => {
        if (addDesciption === "") {
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

            const { data } = await axios.put("http://localhost:4545/info/update/description", {
                description: addDesciption
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
                    description: data.description.description,
                    skills: skills,
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
                        Edit description
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display="flex"
                        flexDirection="column"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <FormControl id="comment" isRequired>
                            <Textarea
                                placeholder='Add your description....'
                                onChange={(e) => setAddDesciption(e.target.value)}
                                value={addDesciption}
                                sx={{
                                    height: '120px'
                                }}
                                border='1px solid black'
                            />
                        </FormControl>
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

export default DescriptionModal