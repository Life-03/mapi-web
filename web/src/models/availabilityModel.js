import mongoose from 'mongoose';

const availabilitySchema = new mongoose.Schema(
    {
        idRuta: String,
        idLugar: String,
        data: Array,
    },
    {
        timestamps: true,
        versionKey: false,

    }
);

export default mongoose.models.Availability || mongoose.model('availability', availabilitySchema);