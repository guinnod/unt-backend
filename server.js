require("dotenv").config();
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const authRoute = require("./routes/auth");
const cookieSession = require("cookie-session");
const passportStrategy = require("./passport");
const app = express();
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://nurbol:aibar2004@cluster0.el3rswm.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
	cookieSession({
		name: "session",
		keys: ["cyberwolve"],
		maxAge: 24 * 60 * 60 * 100,
	})
);

app.use(passport.initialize());
app.use(passport.session());

app.use(cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
}));

function randomNums() {
    var arr = [];
    while (arr.length < 7) {
        var r = Math.floor(Math.random() * 26) + 1;
        if (arr.indexOf(r) === -1) arr.push(r);
    }
    return arr;
}


app.get("/todos", (req, res) => {
    client.connect(function (err, db) {
        if (err) throw err;
        var dbo = db.db("Cluster0");
        dbo.collection("itest").find({}).toArray(function (error, result) {
            if (error) throw error;
            var nons = randomNums();
            var variant = [];
            for (let index = 0; variant.length!=20; index++) {
                if (!nons.includes(index)) {
                    var temp = result[0].info[index].value;
                    let y = Math.floor(Math.random() * (temp.length));
                    variant.push(temp[y]);
                }
            }
            res.status(200).json(variant);
        });
    });
});

app.use("/auth", authRoute);

const port = process.env.PORT || 8081;
app.listen(port, () => console.log(`Listenting on port ${port}...`));
