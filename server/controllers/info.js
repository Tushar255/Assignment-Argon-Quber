import Info from "../models/Info.js";

export const createNewUserInfo = async (req, res) => {
    try {
        const userId = req.user.id;
        const { description, skills, education, experience } = req.body;

        if (skills.length == 0 || !description || education.length == 0 || experience.length == 0) {
            res.status(400).json({ error: 'Please provide all the fields.' })
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
        res.status(200).json(userInfo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const resetInfo = async (req, res) => {
    const userId = req.user.id;

    try {
        await Info.deleteOne({ userId: userId });
        res.status(200).json({ msg: 'Reset successfully' });
    } catch (error) {
        res.status(500).json({ err: error.message });
    }
}

export const updateDescription = async (req, res) => {
    const userId = req.user.id;
    const { description } = req.body;


    try {
        if (!description && description === "") {
            res.status(400)
            throw new Error("Empty Description")
        }
        const update = await Info.findOneAndUpdate(
            { userId: userId },
            {
                description
            },
            {
                new: true
            }
        )
        res.status(200).json({ description: update, msg: 'updated' })
    } catch (error) {
        res.status(500).json({ err: error.message })
    }
}

export const updateSkills = async (req, res) => {
    const userId = req.user.id;
    const { skills } = req.body;

    try {
        if (!skills && skills.length === 0) {
            res.status(400)
            throw new Error("Empty Skills")
        }
        const update = await Info.findOneAndUpdate(
            { userId: userId },
            {
                skills
            },
            {
                new: true
            }
        )
        res.status(200).json({ skills: update, msg: 'updated' })
    } catch (error) {
        res.status(500).json({ err: error.message })
    }
}

export const updateEducation = async (req, res) => {
    const userId = req.user.id;
    const { education } = req.body;

    try {
        if (!education && education.length === 0) {
            res.status(400)
            throw new Error("Empty Education")
        }
        const update = await Info.findOneAndUpdate(
            { userId: userId },
            {
                education
            },
            {
                new: true
            }
        )
        res.status(200).json({ education: update, msg: 'updated' })
    } catch (error) {
        res.status(500).json({ err: error.message })
    }
}

export const updateExperience = async (req, res) => {
    const userId = req.user.id;
    const { experience } = req.body;

    try {
        if (!experience && experience.length === 0) {
            res.status(400)
            throw new Error("Empty experience")
        }
        const update = await Info.findOneAndUpdate(
            { userId: userId },
            {
                experience
            },
            {
                new: true
            }
        )
        res.status(200).json({ experience: update, ms: 'updated' })
    } catch (error) {
        res.status(500).json({ err: error.message })
    }
}