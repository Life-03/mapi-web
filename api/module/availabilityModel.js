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
    collection: 'availabilities',
  }
);

export default function getAvailabilityModel(connection) {
  return connection.models.Availability || connection.model('Availability', availabilitySchema);
}
