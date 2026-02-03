import mongoose from 'mongoose';

function requireUri(value, name) {
  if (!value) {
    throw new Error(`${name} is not set`);
  }
  return value;
}

const tripsUri = process.env.MONGODB_URI_TRIPS || process.env.MONGODB_URI;
const availabilityUri = process.env.MONGODB_URI_AVAIL || process.env.MONGODB_URI;

let tripsConnection;
let availabilityConnection;

try {
  const resolvedTripsUri = requireUri(tripsUri, 'MONGODB_URI_TRIPS (or MONGODB_URI)');
  tripsConnection = await mongoose.createConnection(resolvedTripsUri).asPromise();
  console.log('Trips DB connected to', tripsConnection.name);

  const resolvedAvailabilityUri = requireUri(
    availabilityUri,
    'MONGODB_URI_AVAIL (or MONGODB_URI)'
  );

  if (resolvedAvailabilityUri === resolvedTripsUri) {
    availabilityConnection = tripsConnection;
  } else {
    availabilityConnection = await mongoose.createConnection(resolvedAvailabilityUri).asPromise();
  }
  console.log('Availability DB connected to', availabilityConnection.name);
} catch (error) {
  console.log('err', error);
}

export { tripsConnection, availabilityConnection };
