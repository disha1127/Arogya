import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
  connectionString: process.env.DATABASE_URL, // Use the environment variable
});

client.connect()
  .then(() => {
    console.log('Connected to the database successfully!');
    return client.end();
  })
  .catch((err) => {
    console.error('Database connection error:', err.stack);
  });