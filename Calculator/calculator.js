const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));
app.get("/", function (req, res) {
    res.sendFile(__dirname+"/index.html");
});
app.post("/", function (req, res) {
    var num1 = Number(req.body.num1);
    var num2 = Number(req.body.num2);
    var result = num1 + num2;

    res.send("The result of calculation is "+result);
});
app.get("/bmiCalculator",function (req, res) {
    res.sendFile(__dirname + "/bmiCalculator.html");
});
app.post("/bmiCalculator", function (req, res) {
    var num1 = parseFloat(req.body.n1);
    var num2 = parseFloat(req.body.n2);
    var bmi = num1 / (num2 * num2);
    res.send("Your BMI is " + bmi);
})
app.listen(3000, function () {
    console.log("Server started at 3000");
});