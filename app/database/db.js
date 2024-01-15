import mongoose from "mongoose"

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB)
    } catch (error) {
        console.log('Error connecting to server', error)
    }
}

const closeDB = async () => {
    try {
        await mongoose.connection.close()
    } catch (error) {
        console.log('Error closing server', error)
    }
}

export default connectDB
export { closeDB }