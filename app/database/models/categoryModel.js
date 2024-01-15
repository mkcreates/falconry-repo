import mongoose from "mongoose"

let categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
},
{ timestamps: true })

let Category = mongoose.models['Category'] || mongoose.model("Category", categorySchema)

export default Category