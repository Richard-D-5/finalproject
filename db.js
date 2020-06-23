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
