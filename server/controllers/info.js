import Info from "../models/Info.js";

export const createNewUserInfo = async (req, res) => {
    try {
        const userId = req.user.id;
        const { description, skills, education, experience } = req.body;

        if (skills.length == 0 || !description || education.length == 0 || experience.length == 0) {
            res.status(400).json({error: 'Please provide all the fields.'})
        }

        const info = await Info.create({
            userId,
            description,
            skills,
            education,
            experience
        });

        res.status(201).json({ msg: 'Info created successfully.', info: info });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getUserInfo = async (req, res) => {
    const userId = req.user.id;

    try {
        const userInfo = await Info.findOne({ userId: userId });
        res.status(200).json( userInfo );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}