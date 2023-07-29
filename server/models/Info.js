import mongoose from "mongoose";

const EducationSchema = new mongoose.Schema({
    institute: { 
        type: String, 
        required: true 
    },
    degree: { 
        type: String, 
        required: true 
    },
    eduFrom: { 
        type: Number, 
        required: true 
    },
    eduTo: { 
        type: Number, 
        required: true 
    }
});

const ExperienceSchema = new mongoose.Schema({
    company: { 
        type: String, 
        required: true 
    },
    position: { 
        type: String, 
        required: true 
    },
    describe: {
        type: String, 
        required: true 
    },
    expFrom: { 
        type: Number, 
        required: true 
    },
    expTo: { 
        type: Number, 
        required: true 
    }
});

const InfoSchema = new mongoose.Schema({
    userId: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    skills: [
        {
            type: String,
            required: true
        }
    ],
    education: [EducationSchema],
    experience: [ExperienceSchema],
})

const Info = mongoose.model('Info', InfoSchema);

export default Info;