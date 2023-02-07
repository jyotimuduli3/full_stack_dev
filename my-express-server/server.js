const express = require("express");
const app = express();
app.get("/", function (req, res) {
    // console.log(request);
    // response.send("hello world");
    res.send("<h1> hello world</h1>");
});
app.get("/contact", function (req, res) {
    res.send("contatc me at 87639310253");
});
app.get("/about", function (req, res) {
    res.send("hey! this is jyotiranjan");
});
app.get("/hobbies", function (req, res) {
    res.send("<ul><li>dog training</li><li>travelling</li><li>bike riding</li></ul>");
});
app.listen(3000, function () {
    console.log("server started at port 3000");
});