const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
// const port = 3000;
app.use(cors());

app.use(bodyParser.json()); // before our routes definition

const welcomeMessage = {
  id: 0,
  from: "Bart",
  text: "Welcome to CYF chat system!",
  timeSent: new Date()
};
// const newMessage = {
//   id: 1,
//   from: "Hadiyah",
//   text: "Node is noodlicious!"
// }

//This array is our "data store".
//We will start with one message in the array.
//Note: messages will be lost when Glitch restarts our server.
let messages = [welcomeMessage];

app.get("/", function (request, response) {
  response.sendFile(__dirname + "/index.html");
});
// GET ALL MESSAGES
app.get("/messages", function (request, response) {
  response.json({ messages });
});
//CREATE A NEW MESSAGE
/*app.post("/messages", function (request, response) {
  const newMessage = request.body;
  if (
    typeof newMessage.text == "string" &&
    newMessage.text.length > 0 &&
    typeof newMessage.from == "string" &&
    newMessage.from.length > 0
  ) {
    const id = messages.length;
    newMessage.id = id;
    messages.push(newMessage);
    response.json({ success: true });
  } else {
    response.status(400).send("Please enter your name and add a proper message");
  }
});*/

//======= CREATE A NEW MESSAGE // POST ===========
app.post("/messages", function (request, response) {
  const newMessage = request.body;

  //VALIDATE REQUIRED VALUES
  if (!newMessage.from || !newMessage.text) {
    return response.status(400).json({ error: "from and text are required" });
  }
  //CHECK THT THE MESSAGE DOES NOT ALREADY EXIST
  // const isNotNewMessage = messages.filter((message)=> message.id == newMessage.id)
  //  if (isNotNewMessage) {
  //    return response.status(400).json({ error: "Message has already been posted" });
  //  }

   const id = messages.length;
   newMessage.id = id;
   newMessage.timeSent = new Date();
   messages.push(newMessage);
   response.json({ success: true });
});

//UPDATE MESSAGE
app.put("/messages/update/:id", function(request, response) {
  const msgId = request.params.id;
  const {from, text} = request.body;
  
  if (!text || !from) {
    return response.status(404).json({"error":"fields cannot be empty!"})
  }
 const messageFound = messages.find((message)=>message.id == msgId);
 if (!messageFound) {
   return response.status(404).json({ error: "Id does not exist!" });
 } 

  messages = messages.map((message) => {
    if (message.id== msgId) {
      message.from = from;
      message.text = text;
    }
    return message;
  })
  response.json(messages)
})


//RETRIEVE ONLY MESSAGES WHOSE TEXT CONTAINS A GIVEN SUBSTRING 
app.get("/messages/search", function(request, response) {
  let searchValue = request.query.text;
  console.log(request)
  console.log(searchValue);
  const searchResult = messages.filter((message) =>
    message.text.toLowerCase().includes(searchValue.toLowerCase())
  );
  response.json(searchResult);
  // response.send("text searched is: " + searchValue);
})

//RETRIEVE ONLY THE MOST RECENT 10 MESSAGES
app.get("/messages/latest", function(request, response) {
  const latestMessages = messages.reverse().slice(0, 10);
  response.json(latestMessages);
})

//READ ONE MESSAGE SPECIFIED BY ID
app.get("/messages/:messageId", function (request, response) {
  const messageId = request.params.messageId;
  const getMessage = messages.find((message) => message.id == messageId);
  response.json(getMessage);
});
//DELETE A MESSAGE SPECIFIED BY ID
app.delete("/messages/:id", function (request, response) {
  const { id } = request.params;
  messages = messages.filter((message) => message.id != id);
  response.json(messages);
});

const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});

