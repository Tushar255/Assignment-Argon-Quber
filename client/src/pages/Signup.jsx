import React, { useEffect, useState } from 'react'
import { Button, Divider, Flex, FormControl, FormLabel, Input, InputGroup, InputRightElement, Text, useToast } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { FaLinkedin, FaInstagram, FaTwitter } from "react-icons/fa";
import axios from 'axios'
import { setLogin } from '../State/authSlice';

const Signup = () => {
    const [showP, setShowP] = useState(false)
    const [showCP, setShowCP] = useState(false)
    const [firstName, setFirstname] = useState('')
    const [lastName, setLastname] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState()
    const [password, setPassword] = useState('')
    const [cPassword, setCPassword] = useState()
    const [loading, setLoading] = useState(false)
    const [pic, setPic] = useState()

    const postDetails = (pics) => {
        setLoading(true);
        if (pics === undefined) {
            toast({
                title: "Please select an Image!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            return;
        }

        if (pics.type === "image/jpg" || pics.type === "image/jpeg" || pics.type === "image/png") {
            const data = new FormData();
            data.append("file", pics);
            data.append("upload_preset", "chat-app");
            data.append("cloud_name", "dghjrpqap");
            fetch("https://api.cloudinary.com/v1_1/dghjrpqap/image/upload", {
                method: "post",
                body: data
            }).then((res) => res.json())
                .then(data => {
                    setPic(data.url.toString());
                    setLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                    setLoading(false);
                });
        } else {
            toast({
                title: "Please select an Image!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            setLoading(false)
            return;
        }
    }

    const handleClick1 = () => setShowP(!showP)
    const handleClick2 = () => setShowCP(!showCP)

    const toast = useToast();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const token = useSelector((state) => state.auth.token)

    useEffect(() => {
        if (token) {
            navigate('/profile');
        }
    }, [])

    const handleRegister = async () => {
        setLoading(true);

        if (password !== cPassword) {
            toast({
                title: "Password doesn't match",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            setLoading(false)
            return;
        }

        try {
            const config = {
                headers: {
                    "Content-type": "application/json"
                }
            };
            const { data } = await axios.post("http://localhost:4545/auth", { firstName, lastName, email, password, phone, pic }, config);

            toast({
                title: "Registered!",
                status: "success",
                duration: 2000,
                isClosable: true,
                position: "top"
            });

            dispatch(
                setLogin({
                    user: data.user,
                    token: data.token
                })
            );
            setLoading(false);
            navigate("/profile");
        } catch (err) {
            console.log(err);
            setLoading(false);
            toast({
                title: err.response.data.error,
                status: "error",
                duration: 4000,
                isClosable: true,
                position: "top"
            });
            return;
        }
    }

    const handleTwitter = async () => {
        window.open("http://localhost:4545/auth/twitter", "_self")
    }
    const handleLinkedin = async () => {
        window.open("http://localhost:4545/auth/linkedin", "_self")
    }

    return (
        <Flex
            w='100%'
            h='100vh'
            justify='center'
            align='center'
            bg='hsl(147deg 33.33% 65.18%)'
        >
            <Flex
                w={{ base: '90%', sm: '75%', md: '60%', lg: '38%' }}
                h={'fit-content'} px={{ base: '5', sm: '10', md: '10' }} py='10'
                flexDir={'column'}
                justify={'space-between'}
                borderRadius={'lg'}
                bg='white'
                boxShadow="25px 25px 8px #2a794d"
            >
                <Flex flexDir={'column'} align={'center'} justify={'center'} w='100%'>
                    <Flex justify={"space-between"} w="100%">
                        <FormControl id="first_name" w="48%" isRequired mb='6'>
                            <Input
                                p={{ base: '3', md: '6' }}
                                autoComplete="off"
                                placeholder="First Name"
                                value={firstName}
                                onChange={(e) => setFirstname(e.target.value)}
                                boxShadow={'2px 2px black'}
                                border={'1px solid black'}
                            />
                        </FormControl>
                        <FormControl id="last_name" w="48%" isRequired mb='6'>
                            <Input
                                p={{ base: '3', md: '6' }}
                                autoComplete="off"
                                placeholder="Last Name"
                                value={lastName}
                                onChange={(e) => setLastname(e.target.value)}
                                boxShadow={'2px 2px black'}
                                border={'1px solid black'}
                            />
                        </FormControl>
                    </Flex>

                    <FormControl id="email-login" isRequired mb='6'>
                        <Input
                            p={{ base: '3', md: '6' }}
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            boxShadow={'2px 2px black'}
                            border={'1px solid black'}
                        />
                    </FormControl>

                    <FormControl id="password-login" w={{ base: '100%' }} isRequired mb='6'>
                        <InputGroup>
                            <Input
                                p={{ base: '3', md: '6' }}
                                type={showP ? 'text' : 'password'}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                boxShadow={'2px 2px black'}
                                border={'1px solid black'}
                            />
                            <InputRightElement width='4.5rem' mt={{ base: '0', sm: '1' }}>
                                <Button h='1.75rem' size='xs' onClick={handleClick1}>
                                    {showP ? 'Hide' : 'Show'}
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                    </FormControl>

                    <FormControl id="confirmPassword" w={{ base: '100%' }} isRequired mb='6'>
                        <InputGroup>
                            <Input
                                p={{ base: '3', md: '6' }}
                                type={showCP ? 'text' : 'password'}
                                placeholder="Confirm Password"
                                value={cPassword}
                                onChange={(e) => setCPassword(e.target.value)}
                                boxShadow={'2px 2px black'}
                                border={'1px solid black'}
                            />
                            <InputRightElement width='4.5rem' mt={{ base: '0', sm: '1' }}>
                                <Button h='1.75rem' size='xs' onClick={handleClick2}>
                                    {showCP ? 'Hide' : 'Show'}
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                    </FormControl>

                    <FormControl id="phone" isRequired mb='6'>
                        <Input
                            p={{ base: '3', md: '6' }}
                            placeholder="Phone no."
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            boxShadow={'2px 2px black'}
                            border={'1px solid black'}
                        />
                    </FormControl>

                    <FormControl id="pic"
                        boxShadow={'2px 2px black'}
                        border={'1px solid black'}
                        p={{ base: '0', md: '1' }}
                        borderRadius={'lg'}
                    >
                        <Input
                            type="file"
                            placeholder='Upload your Picture'
                            accept="image/*"
                            p={1.5}
                            border={'none'}
                            onChange={(e) => postDetails(e.target.files[0])}
                        />
                    </FormControl>
                </Flex>

                <Flex mt='5' justify='space-between' align={'center'} flexDir={{ base: 'column', md: 'row' }}>
                    <Flex>
                        <Text w='90%'>Already have an account?
                        </Text>
                        <Text as='b' color='blue' ml='1' mr={{ base: '0', md: '8' }}
                            _hover={{ cursor: 'pointer' }}
                            onClick={() => navigate('/login')}
                        >
                            Login
                        </Text>
                    </Flex>
                    <Button bg='#31a163'
                        color='white' isLoading={loading}
                        mt={{ base: '6', md: '0' }}
                        boxShadow={'4px 4px black'}
                        _hover={{ bg: '#178449' }}
                        _focus={{ transform: 'translateX(4px)', boxShadow: '1px 2px 0px 0px #000', }}
                        onClick={() => handleRegister()}
                    >
                        Register
                    </Button>
                </Flex>

                <Flex justify={'center'} align='center' mt='5'>
                    <Divider w='30%' mr='5' borderColor='gray.700' />
                    <Text fontWeight={'semibold'}>OR</Text>
                    <Divider w='30%' ml='5' borderColor='gray.700' />
                </Flex>

                <Flex flexDir={'column'} mt='5'>
                    <Flex justify={'space-between'}>
                        <Flex
                            h='100%'
                            w='48%'
                            p='1'
                            borderRadius={'md'}
                            border='1px solid black'
                            align={'center'}
                            justify={'center'}
                            _hover={{ cursor: 'pointer' }}
                            onClick={() => handleLinkedin()}
                        >
                            <FaLinkedin color="blue" />
                            <Text as='b' ml='2'>LinkedIn</Text>
                        </Flex>

                        <Flex
                            h='100%'
                            w='48%'
                            p='1'
                            borderRadius={'md'}
                            border='1px solid black'
                            align={'center'}
                            justify={'center'}
                            _hover={{ cursor: 'pointer' }}
                            onClick={() => handleTwitter()}
                        >
                            <FaTwitter color="blue" />
                            <Text as='b' ml='2'>Twitter</Text>
                        </Flex>
                    </Flex >

                    <Flex
                        h='100%'
                        w='48%'
                        p='1'
                        mt='2'
                        borderRadius={'md'}
                        border='1px solid black'
                        align={'center'}
                        justify={'center'}
                        mx='auto'
                        _hover={{ cursor: 'pointer' }}
                    >
                        <FaInstagram color="#e91e63" />
                        <Text as='b' ml='2'>Instagram</Text>
                    </Flex>
                </Flex>
            </Flex >
        </Flex >
    )
}

export default Signup