import mongoose from 'mongoose'
mongoose.set('strictQuery', true);

const mongoConnect = (app) => {
    const PORT = process.env.PORT || 4545;

    mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => {
        app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
    }).catch((error) => {
        console.log(`${error} didn't connect`);
    })
}

export default mongoConnect;