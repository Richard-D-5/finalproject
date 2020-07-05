const express = require("express");
const app = express();
const db = require("./db");
const cookieSession = require("cookie-session");
const { hash, compare } = require("./bc");
const compression = require("compression");
const csurf = require("csurf");
const cryptoRandomString = require("crypto-random-string");
const { sendEmail } = require("./ses");
const s3 = require("./s3");
const { s3Url } = require("./config.json");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

app.use(compression());

app.use(express.json());

app.use(express.static("public"));

app.use(
    cookieSession({
        secret: "I'm always happy",
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);

app.use(csurf());

app.use(function (req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/",
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

///// ROUTES /////

app.post("/register", (req, res) => {
    console.log("req.body: ", req.body);
    hash(req.body.password)
        .then((hashedPw) => {
            return db
                .addUsersInput(
                    req.body.first,
                    req.body.last,
                    req.body.email,
                    hashedPw
                )
                .then((results) => {
                    req.session.userId = results.rows[0].id;
                    res.json({ success: true });
                });
        })
        .catch((err) => {
            console.log("err in hash: ", err);
            res.json({ success: false });
        });
});

app.post("/login", (req, res) => {
    return db.getUsersPw(req.body.email).then((results) => {
        compare(req.body.password, results.rows[0].password)
            .then((match) => {
                console.log("req.body.password in login: ", req.body.password);
                console.log(
                    "rresults.rows[0].password in login: ",
                    results.rows[0].password
                );
                console.log("match: ", match);
                if (match == true) {
                    req.session.userId = results.rows[0].id;
                    res.json({ success: true });
                } else {
                    res.json({ success: false });
                }
            })
            .catch((err) => {
                console.log("err in post login", err);
                // res.json({ success: false });
            });
    });
});

app.post("/reset", (req, res) => {
    console.log("req.body in /reset: ", req.body);
    return db
        .getUsersEmail(req.body.email)
        .then((results) => {
            // console.log("results in /reset: ", results);
            if (results.rows[0].email) {
                const secretCode = cryptoRandomString({
                    length: 6,
                });
                console.log("sectretCode: ", secretCode);
                db.addSecretCode(results.rows[0].email, secretCode);

                const recipient = req.body.email;
                const message = `Hello, here is your code to update your ${secretCode} password`;
                const subject = `Reset Password`;
                sendEmail(recipient, message, subject);
            }
        })
        .then(() => {
            res.json({ success: true });
        })
        .catch((err) => {
            console.log("err in post reset", err);
            res.json({ success: false });
        });
});

app.post("/reset/verify", (req, res) => {
    console.log("req.body in post /reset/verify: ", req.body);
    db.getSecretCode(req.body.email)
        .then((data) => {
            console.log("data in getSecretCode: ", data);
            if (req.body.code === data.rows[0].code) {
                hash(req.body.password).then((hashedPw) => {
                    db.updatePassword(req.body.email, hashedPw)
                        .then(() => {
                            console.log("hashedPw: ", hashedPw);
                            console.log("password updated");
                            res.json({ success: true });
                        })
                        .catch((err) => {
                            console.log("err in post updatePassword: ", err);
                        });
                });
            }
        })
        .catch((err) => {
            console.log("err in getSecretCode: ", err);
        });
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    console.log("req.file: ", req.file);
    console.log("req.session.userId: ", req.session.userId);
    if (req.file) {
        db.addImage(req.session.userId, `${s3Url}${req.file.filename}`)
            .then(() => {
                res.json(`${s3Url}${req.file.filename}`);
            })
            .catch((err) => {
                console.log(err);
            });
    } else {
        res.json({ success: false });
    }
});

app.post("/save", (req, res) => {
    console.log("req.body in post /save: ", req.body);
    if (req.session.userId) {
        db.saveBio(req.session.userId, req.body.currentBio)
            .then((data) => {
                console.log("update bio!!");
                console.log("data in post /save: ", data);
                res.json(data.rows[0].bio);
                // res.json({ succes: true });
            })
            .catch((err) => {
                console.log("err in post /save: ", err);
            });
    } else {
        res.json({ success: false });
    }
});

app.get("/user", (req, res) => {
    if (req.session.userId) {
        db.getUsersInfo(req.session.userId)
            .then((data) => {
                // console.log("data in /user: ", data);
                res.json(data.rows[0]);
            })
            .catch((err) => {
                console.log("err in getUsersInfo: ", err);
            });
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.get("/user/:id.json", async (req, res) => {
    if (req.session.userId == req.params.id) {
        res.json({ self: true });
    } else {
        try {
            const data = await db.getUserById(req.params.id);
            res.json(data.rows[0]);
        } catch (err) {
            console.log(err);
            res.json({ error: "User does not exits." });
        }
    }
});

app.get("/users/:name", async (req, res) => {
    console.log("req.params: ", req.params);
    if (req.params.name == "+") {
        try {
            const data = await db.getRecentUsers();
            console.log("data in /users: ", data);
            res.json(data.rows);
        } catch (err) {
            console.log(err);
            res.json({ err: "User does not exits." });
        }
    } else {
        try {
            const data = await db.getMatchingUsers(req.params.name);
            console.log("data in /users getMatchingUsers: ", data);
            res.json(data.rows);
        } catch (err) {
            console.log(err);
            res.json({ err: "User does not exits." });
        }
    }
});

app.get("/friendship-status/:id", async (req, res) => {
    console.log("req.params.id in /friendship-status: ", req.params.id);
    // if (req.params.id) {
    try {
        const data = await db.getFriendshipStatus(
            req.params.id,
            req.session.userId
        );
        console.log("data in friendship-status GET: ", data);
        res.json(data.rows);
    } catch (err) {
        console.log(err);
    }
    // }
});

app.post("/make-friend-request/:id", async (req, res) => {
    console.log("req.body in /make-friend-request POST: ", req.body);
    console.log("req.params in /make-friend-request POST: ", req.params);
    try {
        const data = await db.makeFriendRequest(
            req.session.userId,
            req.params.id
        );
        console.log("data in /make-friend-request POST: ", data);
        res.json(data.rows);
    } catch (err) {
        console.log("err in /make-friend-request POST: ", err);
    }
});

app.post("/accept-friend-request/:id", async (req, res) => {
    console.log("req.body in accept friends: ", req.body);
    console.log("req.params in accept friends: ", req.params);
    try {
        const data = await db.acceptFriendRequest(
            req.session.userId,
            req.params.id
        );
        console.log("data in accept friends: ", data);
        res.json({ data: true });
    } catch (err) {
        console.log(err);
    }
});

app.post("/delete-friendship/:id", async (req, res) => {
    console.log("req.body in accept friends: ", req.body);
    console.log("req.params in accept friends: ", req.params);
    try {
        const data = await db.acceptFriendRequest(
            req.session.userId,
            req.params.id
        );
        console.log("data in accept friends: ", data);
        res.json({ data: true });
    } catch (err) {
        console.log(err);
    }
});

app.get("/welcome", (req, res) => {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.get("*", function (req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.listen(8080, function () {
    console.log("I'm listening.");
});
