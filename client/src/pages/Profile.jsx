import React, { useEffect, useState } from 'react'
import Resume from '../components/Resume'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { setInfo } from '../State/infoSlice';

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

        const { data } = await axios.get("https://backend-argon-quber.onrender.com/info/info", config);

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