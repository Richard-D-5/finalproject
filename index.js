const express = require("express");
const app = express();
const db = require("./db");
const cookieSession = require("cookie-session");
const { hash, compare } = require("./bc");
const compression = require("compression");
const csurf = require("csurf");
const cryptoRandomString = require("crypto-random-string");
const { sendEmail } = require("./ses");

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

///// ROUTTES /////

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
