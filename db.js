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
