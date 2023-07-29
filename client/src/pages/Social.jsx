import React, { useEffect, useState } from 'react'
import { setLogin } from '../State/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '@chakra-ui/react';

const Social = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const toast = useToast()
    const token = useSelector((state) => state.auth.token)
    const user = useSelector((state) => state.auth.user)

    const getUserInfoBySocialLogin = () => {
        fetch("/auth/login/success", {
            method: "GET",
            credentials: "include",

            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": true
            },
        }).then(response => {
            if (response.status === 200) return response.json();
            throw new Error("authentication failed!")
        }).then(async (resObj) => {
            console.log(resObj.user);
            const userData = resObj.user
            const config = {
                headers: {
                    "Content-type": "application/json"
                }
            };
            const { data } = await axios.post("/auth/social-login", { userData }, config)

            toast({
                title: data.msg,
                status: "success",
                duration: 2000,
                isClosable: true,
                position: "top"
            });

            dispatch(
                setLogin({
                    user: data.userData,
                    token: data.token
                })
            );
        }).catch(err => {
            console.log(err);
        })
    }

    useEffect(() => {
        getUserInfoBySocialLogin();
        if (token && user) {
            navigate('/profile');
        }
    })

    return (
        <div>Please wait...</div>
    )
}

export default Social