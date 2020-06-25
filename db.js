const spicedPg = require("spiced-pg");

let db;
if (process.env.DATABASE_URL) {
    // this will run if petition is running on heroku
    db = spicedPg(process.env.DATABASE_URL);
} else {
    // this will run if petition is running on localhost
    db = spicedPg("postgres:postgres:password@localhost:5432/socialnetwork");
}

module.exports.addUsersInput = (first, last, email, hash) => {
    return db.query(
        `INSERT INTO users (first, last, email, password) VALUES ($1, $2, $3, $4) RETURNING id, first`,
        [first, last, email, hash]
    );
};

module.exports.getUsersInfo = (id) => {
    return db.query(`SELECT * FROM users WHERE id = $1`, [id]);
};

module.exports.getUsersPw = (email) => {
    return db.query(`SELECT id, password FROM users WHERE email=$1`, [email]);
};

module.exports.getUsersEmail = (email) => {
    return db.query(`SELECT first, last, email FROM users WHERE email=$1`, [
        email,
    ]);
};

module.exports.addSecretCode = (email, code) => {
    return db.query(
        `INSERT INTO reset_codes (email, code) VALUES ($1, $2) RETURNING *`,
        [email, code]
    );
};

module.exports.getSecretCode = (email) => {
    return db.query(
        `SELECT code 
        FROM reset_codes  
        WHERE email=$1 
        AND CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes'
        ORDER BY created_at DESC
        LIMIT 3 `,
        [email]
    );
};

module.exports.updatePassword = (email, hashedPw) => {
    return db.query(
        `UPDATE users 
        SET password = $2
        WHERE email = $1`,
        [email, hashedPw]
    );
};

exports.addImage = (id, url) => {
    return db.query(
        `UPDATE users
        SET url = $2
        WHERE id = $1 
        RETURNING *`,
        [id, url]
    );
};
