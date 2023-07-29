import React, { useEffect, useState } from 'react'
import Resume from '../components/Resume'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { setInfo } from '../State/infoSlice';
import { setLogin } from '../State/authSlice';

const Profile = () => {
    const token = useSelector((state) => state.auth.token)
    const user = useSelector((state) => state.auth.user)
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [fetchAgain, setFetchAgain] = useState(false)

    const getUserInfo = async () => {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
        console.log(token);
        console.log(user);

        const { data } = await axios.get("/info/info", config);

        console.log(data);

        dispatch(
            setInfo({
                description: data.description,
                skills: data.skills,
                experience: data.experience,
                education: data.education
            })
        )
    }

    useEffect(() => {
        if (!token && !user) {
            navigate('/');
        }

        console.log("Hello");
    }, [fetchAgain])

    useEffect(() => {
        getUserInfo();
    }, [])

    return (
        <div>
            {user && token && <Resume user={user} token={token} setFetchAgain={setFetchAgain} fetchAgain={fetchAgain} />}
        </div>
    )
}

export default Profile