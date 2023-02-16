const express = require("express");
const bodyParser = require("body-parser");

const app = express();

//we need array else the nely added toDo will replace the old one
let toDos = [];

let work_items = [];

//this line must be used to post anything using req.body.
app.use(bodyParser.urlencoded({ extended: true }));


//to use css we must tell express
app.use(express.static("public"));


//this line must be under the declaration of app
app.set('view engine', 'ejs');

app.get("/", function (req, res) {
    // res.send("hello world");
    let today = new Date();
    //getDay() is a method which returns the day in number from 0-6 i.e sunday monday so on to saturday
    let currentDay = today.getDay();

    //this is an object containing day date month
    let options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };

    //this is a method that convert option to Thursday, 16 Feb format
    let day = today.toLocaleDateString("en-US", options);
    
    // if (currentDay === 6 || currentDay === 0) {
        
    //     //how to send html
    //     //by adding html tags
    //     //we can send multiple lines by using res.write();
    //     // res.write("<h1> yeah its a holiday</h1>");
    //     // res.write("<h2>today i will sleep whole day</h2>");


    //     day = "weekend";

    // } else {


    //     // res.write("<h1>ohh no i dont want to go to class</h1>");
    //     // res.write("<h2>how hectic it is bla bla</h2>");
    //     // res.send();

    //     day = "weekday";
    // }


    // // challange is to display the name of the day

    // switch (currentDay) {
    //     case 0:
    //         day = "Sunday";
    //         break;
    //     case 1:
    //         day = "Monday";
    //         break;
    //     case 2:
    //         day = "Tueday";
    //         break;
    //     case 3:
    //         day = "wednesday";
    //         break;
    //     case 4:
    //         day = "Thursday";
    //         break;
    //     case 5:
    //         day = "Friday";
    //         break;
    //     case 6:
    //         day = "Saturady";
    //         break;
    //     default:
    //         console.log("Error: the current day is equal to " + currentDay);
    //         break;
    // }



    //this res.render contain all the item template to be changed in .ejs file
    //here toDos is the array
    res.render("list",{wday:day, newItems:toDos});

})


app.post("/", function (req, res) {
    
    //this causes a problem of scope so need to declare var toDO outside
    //since the above statement again caused a problem
    //we defined an array
    let toDo = req.body.newItem;

    if (req.body.list === "worklist") {
        work_items.push(toDo);
        res.redirect("/work");
    } else {
        toDos.push(toDo);
        // // this line redirect to home route
        // we r doing this bcoz if we will write res.render again here it will show error so
        // it is written one time inside app.get method
        res.redirect("/");
    }

   
})


app.get("/work", function (req, res) {
    res.render("list", { wday: "worklist", newItems: work_items });

})



app.get("/about", function (req, res) {
    res.render("about");
})

app.listen(3000, function () {
    console.log("server is started and listening at port 3000");
})