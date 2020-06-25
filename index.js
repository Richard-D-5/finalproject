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

app.get("/user", (req, res) => {
    if (req.session.userId) {
        db.getUsersInfo(req.session.userId)
            .then((data) => {
                console.log("data in /user: ", data);
                res.json(data.rows[0]);
            })
            .catch((err) => {
                console.log("err in getUsersInfo: ", err);
            });
    } else {
        res.sendFile(__dirname + "/index.html");
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
