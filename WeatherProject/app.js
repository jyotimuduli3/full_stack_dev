//jshint esversion:6
const { response } = require("express");
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});
app.post("/", function (req, res) {
    const query = req.body.cityName;
    const units = "metric";
    const appid = "42b381b1718619b1562703733f80683f";
    const url = "https://api.openweathermap.org/data/2.5/weather?q="+query+"&units="+units+"&appid="+appid;
    https.get(url, function (response) {
        console.log(response.statusCode);
        response.on("data", function (data) {
            // console.log(data);
            const weatherdata = JSON.parse(data);
            console.log(weatherdata);
            const temp = weatherdata.main.temp;
            console.log(temp);
            const temp_min = weatherdata.main.temp_min;
            console.log(temp_min);
            const weather_des = weatherdata.weather[0].description;
            console.log(weather_des);
            // const object = {
            //     name: "jyoti",
            //     Age: "24"
            // }
            // console.log(JSON.stringify(object));
            const icon = weatherdata.weather[0].icon;
            const icon_url = "http://openweathermap.org/img/wn/" + icon + "@2x.png"
            res.write("<h1> the weather is " + weather_des + " </h1>");
            res.write("<h1> the temp in "+query+" is " + temp + " degree celcius </h1>");
            res.write("<img src = " + icon_url + ">");
            res.send();
        })
    })
    
})
app.listen(3000, function () {
    console.log("server started at port 3000");
})