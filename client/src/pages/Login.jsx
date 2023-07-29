import React, { useEffect, useState } from 'react'
import { Button, Divider, Flex, FormControl, Input, InputGroup, InputRightElement, Text, useToast } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { FaLinkedin, FaInstagram, FaTwitter } from "react-icons/fa";
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setLogin } from '../State/authSlice';

const Login = () => {
    const [showP, setShowP] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const handleClick1 = () => setShowP(!showP)

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const toast = useToast();
    const token = useSelector((state) => state.auth.token)

    useEffect(() => {
        if (token) {
            navigate('/profile');
        }
    }, [])

    const handleTwitter = async () => {
        window.open("/auth/twitter", "_self")
    }
    const handleLinkedin = async () => {
        window.open("/auth/linkedin", "_self")
    }

    const handleLogin = async () => {
        setLoading(true)
        try {
            const config = {
                headers: {
                    "Content-type": "application/json"
                }
            };
            const { data } = await axios.post("http://localhost:4545/auth/login", { email, password }, config);

            toast({
                title: data.msg,
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
            setEmail("");
            setPassword("");
            navigate("/profile");
        } catch (err) {
            toast({
                title: err.response.data.error,
                status: "error",
                duration: 4000,
                isClosable: true,
                position: "top"
            });
            setLoading(false);
            setEmail("");
            setPassword("");
            return;
        }
    }

    return (
        <Flex
            w='100%'
            h='100vh'
            justify='center'
            align='center'
            // bg='#7b4397'
            bg='hsl(147deg 33.33% 65.18%)'
        >
            <Flex
                w={{ base: '90%', sm: '75%', md: '60%', lg: '38%' }}
                h='fit-content' px={{ base: '5', sm: '10', md: '10' }} py='10'
                flexDir={'column'}
                justify={'space-between'}
                borderRadius={'lg'}
                bg='white'
                boxShadow="25px 25px 8px #2a794d"
            >
                <Flex flexDir={'column'}>
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
                            onClick={handleLinkedin}
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
                    </Flex>

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

                <Flex justify={'center'} align='center' mt='5'>
                    <Divider w='30%' mr='5' borderColor='gray.700' />
                    <Text fontWeight={'semibold'}>OR</Text>
                    <Divider w='30%' ml='5' borderColor='gray.700' />
                </Flex>

                <Flex mt='5' flexDir={'column'} align={'center'} justify={'center'} w='100%'>
                    <FormControl id="email-login" isRequired mb='6'>
                        <Input
                            p={{ base: '3', sm: '6' }}
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            boxShadow={'2px 2px black'}
                            border={'1px solid black'}
                        />
                    </FormControl>

                    <FormControl id="password-login" w={'100%'} isRequired>
                        <InputGroup>
                            <Input
                                p={{ base: '3', sm: '6' }}
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
                </Flex>

                <Flex mt='5' justify='space-between' align={'center'} flexDir={{ base: 'column', md: 'row' }}>
                    <Text as='b' color='blue' ml='2'
                        _hover={{ cursor: 'pointer' }}
                        onClick={() => navigate('/')}
                    >
                        Create an account
                    </Text>
                    <Button
                        // bg='#7b4397'
                        bg='#31a163'
                        color='white'
                        mt={{ base: '6', md: '0' }}
                        boxShadow={'4px 4px black'}
                        _hover={{ bg: '#178449' }}
                        _focus={{ transform: 'translateX(4px)', boxShadow: '1px 2px 0px 0px #000', color: 'black' }}
                        onClick={() => handleLogin()}
                        isLoading={loading}
                    >
                        Log in
                    </Button>
                </Flex>
            </Flex>
        </Flex >
    )
}

export default Login