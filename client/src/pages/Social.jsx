import React, { useEffect } from 'react'
import { setLogin } from '../State/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Flex, Text, useToast } from '@chakra-ui/react';

const Social = () => {
    const serializedUser = useParams();
    const userData = JSON.parse(decodeURIComponent(serializedUser));
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const toast = useToast()
    const token = useSelector((state) => state.auth.token)
    const user = useSelector((state) => state.auth.user)

    const getUserInfoBySocialLogin = async () => {
        const config = {
            headers: {
                "Content-type": "application/json"
            }
        };

        const { data } = await axios.post("https://tsb-backend-tole.onrender.com/auth/social-login", { user: userData }, config)

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
    }
    // const getUserInfoBySocialLogin = () => {
    //     fetch("https://tsb-backend-tole.onrender.com/auth/login/success", {
    //         method: "GET",
    //         credentials: "include",

    //         headers: {
    //             Accept: "application/json",
    //             "Content-Type": "application/json",
    //             "Access-Control-Allow-Credentials": true
    //         },
    //     }).then(response => {
    //         console.log(response);
    //         if (response.status === 200) return response.json();
    //         navigate('/');
    //         toast({
    //             title: 'Authentication failed!',
    //             status: "error",
    //             duration: 2000,
    //             isClosable: true,
    //             position: "top"
    //         });
    //     }).then(async (resObj) => {
    //         const user = resObj.user;
    //         console.log(user);

    //         const config = {
    //             headers: {
    //                 "Content-type": "application/json"
    //             }
    //         };

    //         const { data } = await axios.post("https://tsb-backend-tole.onrender.com/auth/social-login", { user }, config)

    //         toast({
    //             title: data.msg,
    //             status: "success",
    //             duration: 2000,
    //             isClosable: true,
    //             position: "top"
    //         });

    //         dispatch(
    //             setLogin({
    //                 user: data.user,
    //                 token: data.token
    //             })
    //         );
    //     }).catch(err => {
    //         console.log(err);
    //     })
    // }

    useEffect(() => {
        getUserInfoBySocialLogin();
    }, [])
    useEffect(() => {
        if (token) {
            navigate('/profile');
        }
    })

    return (
        <Flex
            justify={'center'}
            align={'center'}
            h='100vh'
        >
            <Text fontSize={'4xl'} fontWeight={'semibold'}>
                Please wait...
            </Text>
        </Flex>
    )
}

export default Social