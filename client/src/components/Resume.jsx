import { Badge, Box, Button, Flex, Image, Input, Stack, Text, Textarea, useToast } from '@chakra-ui/react'
import { EmailIcon, PhoneIcon } from '@chakra-ui/icons'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setLogout } from '../State/authSlice'
import { removeInfo, setInfo } from '../State/infoSlice'
import SkillBadge from './SkillBadge'
import Education from './Education'
import Experience from './Experience'
import axios from 'axios'

import EducationModal from './edit/EducationModal'
import DescriptionModal from './edit/DecriptionModal'
import ExperienceModal from './edit/ExperienceModal'
import SkillsModal from './edit/SkillsModal'

const Resume = ({ user, token, setFetchAgain, fetchAgain }) => {
    const [edit, setEdit] = useState(false);
    const [addDesciption, setAddDesciption] = useState("");
    const [loading, setLoading] = useState(false);

    const [addSkill, setAddSkill] = useState([]);
    const initialSkill = ["Add", "some", "skills", "by", "typing", "and", "pressing", "Enter"]
    const [skill, setSkill] = useState("");
    const [nextSkillId, setNextSkillId] = useState(1);

    const [addEducation, setAddEducation] = useState([]);
    const [institute, setInstitute] = useState("")
    const [eduFrom, setEduFrom] = useState(null)
    const [eduTo, setEduTo] = useState(null)
    const [degree, setDegree] = useState("")
    const [nextEducationId, setNextEducationId] = useState(1);

    const [addExperience, setAddExperience] = useState([]);
    const [company, setCompany] = useState("")
    const [expFrom, setExpFrom] = useState(null)
    const [expTo, setExpTo] = useState(null)
    const [position, setPosition] = useState("")
    const [describe, setDescribe] = useState("")
    const [nextExperienceId, setNextExperienceId] = useState(1);

    const dispatch = useDispatch();
    const toast = useToast();

    const description = useSelector((state) => state.info.description)
    const education = useSelector((state) => state.info.education)
    const experience = useSelector((state) => state.info.experience)
    const skills = useSelector((state) => state.info.skills)

    const handleSave = async () => {
        setLoading(true);
        if (addDesciption === "" || addSkill.length === 0 || addEducation.length === 0 || addExperience.length === 0) {
            setLoading(false);
            toast({
                title: "Enter all the fields",
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

            const { data } = await axios.post("https://tsb-backend-tole.onrender.com/info", {
                description: addDesciption,
                skills: addSkill,
                education: addEducation,
                experience: addExperience
            }, config);

            toast({
                title: "Info saved.",
                status: "success",
                duration: 2000,
                isClosable: true,
                position: "top"
            });

            dispatch(
                setInfo({
                    description: data.info.description,
                    skills: data.info.skills,
                    experience: data.info.experience,
                    education: data.info.education
                })
            );

            setLoading(false);
            setAddDesciption("");
            setAddSkill([]);
            setAddEducation([]);
            setAddExperience([]);
            setNextEducationId(1);
            setNextExperienceId(1);
        } catch (err) {
            setLoading(false);
            toast({
                title: err.response.data.error,
                status: "failure",
                duration: 2000,
                isClosable: true,
                position: "top"
            });
        }
    }

    const handleLogout = async () => {
        await axios.get("https://tsb-backend-tole.onrender.com/auth/logout");

        dispatch(
            setLogout()
        )
        dispatch(
            removeInfo()
        )
        setFetchAgain(!fetchAgain)
        toast({
            title: "Logout!",
            status: "success",
            duration: 2000,
            isClosable: true,
            position: "top"
        });
    }

    const handleAddEducation = () => {
        if (!education || !degree) {
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

    const handleAddExperience = () => {
        if (!company || !position || !describe) {
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

    const handleReset = async () => {
        setEdit(false);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            const { data } = await axios.post("https://tsb-backend-tole.onrender.com/info/reset", {}, config);
            console.log(data);

            toast({
                title: data.msg,
                status: "success",
                duration: 2000,
                isClosable: true,
                position: "top"
            });

            dispatch(removeInfo())
        } catch (error) {
            toast({
                title: error.response.data.err,
                status: "error",
                duration: 2000,
                isClosable: true,
                position: "top"
            });
        }
    }

    return (
        <Flex
            bg='hsl(29.4deg 89.35% 66.86%)'
            flexDir={{ base: 'column', lg: 'row' }}
            overflowY={'scroll'}
        >
            <Flex
                w={{ base: '100%', lg: '32%' }}
                h={{ base: 'fit-content', lg: '100vh' }}
                justify='center'
                bg='hsl(147deg 33.33% 65.18%)'
                borderRight={'2px solid black'}
                flexDir={{ base: 'row', lg: 'column' }}
            >
                <Stack spacing={{ base: 4, lg: 0 }}
                    w='100%' h='100%' display={'flex'}
                    flexDirection={'column'}
                    justifyContent={'space-around'}
                    alignItems='center' p='8'
                >
                    <Box>
                        <Image
                            borderRadius="full"
                            mx='auto'
                            my='auto'
                            boxSize={{ base: '180px', lg: "250px" }}
                            src={user.pic}
                            name={user.email}
                            border={'2px solid black'}
                        />

                        <Text
                            mt='1'
                            fontWeight={'bold'}
                            fontSize={'5xl'}
                            fontFamily={'sans-serif'}
                            align={'center'}
                        >
                            {user.firstName} {user.lastName}
                        </Text>
                    </Box>

                    <Flex
                        w={{ base: '100%', sm: '70%', lg: '100%' }}
                        flexDir={'column'}
                    >
                        <Flex
                            p='3' mb='3'
                            borderRadius={'full'}
                            bg='hsl(29.4deg 89.35% 66.86%)'
                            border={'2px solid black'}
                        >
                            <EmailIcon boxSize={5} my='auto' ml='2' mr='3' />
                            <Text>{user.email}</Text>
                        </Flex>

                        <Flex
                            p='3'
                            borderRadius={'full'}
                            bg='hsl(29.4deg 89.35% 66.86%)'
                            border={'2px solid black'}
                        >
                            <PhoneIcon boxSize={5} my='auto' ml='2' mr='3' />
                            {
                                user.phone ?
                                    <>
                                        <Text>{user.phone}</Text>
                                    </>
                                    :
                                    <Text>phone no.</Text>
                            }
                        </Flex>
                    </Flex>

                    <Button
                        w='fit-content'
                        colorScheme='gray'
                        boxShadow={'4px 4px black'}
                        _hover={{ bg: 'black', color: 'white' }}
                        _focus={{ transform: 'translateX(4px)', boxShadow: '1px 2px 0px 0px #000', color: 'black' }}
                        mx='auto'
                        onClick={() => handleLogout()}
                    >
                        Logout
                    </Button>

                    {
                        (description === null && skills.length === 0 && education.length === 0 && experience.length === 0)
                            ?
                            <Button
                                isLoading={loading}
                                w='fit-content'
                                bg='#706e69' color='white'
                                boxShadow={'4px 4px black'}
                                _hover={{ bg: 'hsl(29.4deg 2.7% 32.81%)', color: 'lightgreen' }}
                                _focus={{ transform: 'translateX(4px)', boxShadow: '1px 2px 0px 0px #000', color: 'black' }}
                                mx='auto'
                                onClick={() => handleSave()}
                            >
                                Save
                            </Button>
                            :
                            <Flex>
                                <Button ml='3'
                                    w='fit-content'
                                    bg='red' color='white'
                                    boxShadow={'4px 4px black'}
                                    _hover={{ bg: 'hsl(29.4deg 2.7% 32.81%)', color: 'red' }}
                                    _focus={{ transform: 'translateX(4px)', boxShadow: '1px 2px 0px 0px #000', color: 'black' }}
                                    onClick={handleReset}
                                >
                                    Reset
                                </Button>
                                <Button ml='3'
                                    w='fit-content'
                                    bg='green' color='white'
                                    boxShadow={'4px 4px black'}
                                    _hover={{ bg: 'hsl(29.4deg 2.7% 32.81%)', color: 'lightgreen' }}
                                    _focus={{ transform: 'translateX(4px)', boxShadow: '1px 2px 0px 0px #000', color: 'black' }}
                                    onClick={() => setEdit(!edit)}
                                >
                                    {!edit ? 'Edit' : 'Done'}
                                </Button>
                            </Flex>
                    }
                </Stack>
            </Flex>

            <Flex
                w={{ base: '100%', lg: '72%' }}
                bg='#fff7e7'
                borderRight={'2px solid black'}
                flexDir={{ base: 'column', lg: 'row' }}
            >
                <Flex w={{ base: '100%', lg: '50%' }} h='100%' flexDir={'column'} justify={''}>
                    <Flex id='decription'
                        w='90%' mx='auto' mt={{ base: '20', lg: '10' }}
                        flexDir='column' mb={'20%'}
                        h='35%'
                    >
                        <Flex>
                            <Text
                                w='35%'
                                p='2' mb='10' align={'center'}
                                borderRadius={'full'}
                                fontSize={'lg'} mx={{ base: 'auto', lg: '0' }}
                                fontWeight={'semibold'}
                                bg='hsl(147deg 33.33% 65.18%)'
                                border={'2px solid black'}
                            >
                                Description
                            </Text>
                            {edit ? <DescriptionModal /> : ''}
                        </Flex>

                        <Text align={'justify'} p='3'>
                            {description ?
                                description
                                :
                                <Textarea
                                    placeholder='Add your description....'
                                    onChange={(e) => setAddDesciption(e.target.value)}
                                    value={addDesciption}
                                    sx={{
                                        height: '120px'
                                    }}
                                    border='1px solid black'
                                />
                            }
                        </Text>
                    </Flex>

                    <Flex id='education'
                        w='90%' mx='auto'
                        flexDir='column'
                    >
                        <Flex>
                            <Text
                                w='35%'
                                p='2' mb='10' align={'center'}
                                borderRadius={'full'}
                                fontSize={'lg'} mx={{ base: 'auto', lg: '0' }}
                                fontWeight={'semibold'}
                                bg='hsl(147deg 33.33% 65.18%)'
                                border={'2px solid black'}
                            >
                                Education
                            </Text>
                            {edit ? <EducationModal /> : ''}
                        </Flex>

                        <Box w='100%' p='3'>
                            {
                                education && education.length > 0 ?
                                    education.map((e, idx) => (
                                        <Education
                                            key={e.id}
                                            from={e.eduFrom}
                                            to={e.eduTo}
                                            institute={e.institute}
                                            degree={e.degree}
                                        />
                                    )) :
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
                            }
                        </Box>
                    </Flex>
                </Flex>

                <Flex w={{ base: '100%', lg: '50%' }} flexDir={'column'} justify={''}>
                    <Flex id='skills'
                        w='90%' mx='auto' mt={{ base: '20', lg: '10' }}
                        flexDir='column' mb='20%'
                        h='35%'
                    >
                        <Flex>
                            <Text
                                w='35%'
                                p='2' mb='10' align={'center'}
                                borderRadius={'full'}
                                fontSize={'lg'} mx={{ base: 'auto', lg: '0' }}
                                fontWeight={'semibold'}
                                bg='hsl(147deg 33.33% 65.18%)'
                                border={'2px solid black'}
                            >
                                Skills
                            </Text>
                            {edit ? <SkillsModal /> : ''}
                        </Flex>

                        <Flex justify={'center'} wrap={'wrap'} w={{ base: '100%', lg: '85%' }} p='3'>
                            {
                                skills && skills.length > 0 ?
                                    skills.map((s) => (
                                        <SkillBadge
                                            key={s.id}
                                            skill={s.skill}
                                        />
                                    ))
                                    :
                                    <Box w='100%'>
                                        {
                                            addSkill && addSkill.length > 0 ? addSkill.map((s) => (
                                                <SkillBadge
                                                    key={s.id}
                                                    skill={s.skill}
                                                    handleFunction={() => deleteSkill(s.id)}
                                                />
                                            ))
                                                :
                                                initialSkill.map((s, idx) => (
                                                    <SkillBadge
                                                        key={idx}
                                                        skill={s}
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
                            }
                        </Flex>
                    </Flex>

                    <Flex
                        w='90%' mx='auto'
                        flexDir='column' mb={{ base: '5', lg: '0' }}
                    >
                        <Flex>
                            <Text
                                w='35%'
                                p='2' mb='10' align={'center'}
                                borderRadius={'full'}
                                fontSize={'lg'} mx={{ base: 'auto', lg: '0' }}
                                fontWeight={'semibold'}
                                bg='hsl(147deg 33.33% 65.18%)'
                                border={'2px solid black'}
                            >
                                Experience
                            </Text>
                            {edit ? <ExperienceModal /> : ''}
                        </Flex>

                        <Box w='100%' p='3'>
                            {
                                experience && experience.length > 0 ?
                                    experience.map((e, idx) => (
                                        <Experience
                                            key={e.id}
                                            from={e.expFrom}
                                            to={e.expTo}
                                            company={e.company}
                                            position={e.position}
                                            description={e.describe}
                                        />
                                    )) :
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
                            }
                        </Box>
                    </Flex>
                </Flex>
            </Flex>

            <Box w='3%'></Box>
        </Flex>
    )
}

export default Resume