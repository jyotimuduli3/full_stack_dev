//require installed node packages
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const request = require("request");
const { url } = require("inspector");
const { urlencoded } = require("body-parser");

//create new express app
const app = express();

//enable express to access static files in folder called "Public"
app.use(express.static("public"));

//enable express to parse URL-encoded body i.e. info from HTML form
app.use(bodyParser.urlencoded({ extended: true }));

//GET request
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
})
//post 
app.post("/", function (req, res) {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;
    var data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME:lastName
                }
            }
        ]
    }
    //this is the json data which we are ready
    //to send to mailchimp
    const jsonData = JSON.stringify(data);
    
    
    const url = "https://us17.api.mailchimp.com/3.0/lists/fc702164c7"
    const options = {
        method: "POST",
        auth:"jyotiranjan514:6e13c568481280c69b330498907446de-us17"
    }
    
    
    const request = https.request(url, options, function (response) {
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }
        response.on("data", function (data) {
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();

})

// route to make the button on failure page work
app.post("/failure", function (req, res) {
    res.redirect("/");
    // this mean redirect to home route
})

//use express app to listen on 3000 and log when it's working
// if we want to deploy it then we need to replace 3000 with process.env.PORT
//else if we want to run it at both plcae then we can write as follows
app.listen(process.env.PORT||3000, function () {
    console.log("server is running at port 3000");
})




//my api key mailchimp
//6e13c568481280c69b330498907446de-us17
//audience id or list id
// fc702164c7