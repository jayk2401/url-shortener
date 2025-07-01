const { Pool } = require('pg');

// Connection config
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'postgres',
    port: 5432,
});

module.exports = pool;  // export the pool instance


// Example query
// pool.query('SELECT NOW()', (err, res) => {
//     if (err) {
//         console.error('Error executing query', err.stack);
//     } else {
//         console.log('DB Time:', res.rows[0]);
//     }

//     pool.end();
// });