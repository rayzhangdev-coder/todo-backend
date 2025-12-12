//when i run this code it's equivalent to running 
//node index.js in terminal
//that's how it works because Node.js is the one that's running the stuff

//i also did npm install mongoose and dotenv

require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
// const bodyParser = require("body-parser"); REPLACED WITH express.json()
const cors = require('cors'); //I NEED THIS TO CONNECT BACKEND W/ FRONTEND
const mongoose = require('mongoose');

//Middlewares
//app.use is basically if a path was used -> run function
//if no path provided, then always runs
app.use(cors());
app.use("/todos", express.json()); //Built in body parser (replacement for Bodyparser)

//process is the current Node.js runtime (which means the process that is running my code)
mongoose.connect(process.env.MONGO_URI) //env is a variable in the process
.then(() => console.log("Connected to MongoDB Atlas!"))
.catch((err) => console.log("Failed to connect to MongoDB: ", err));

// Schema is like a "Blueprint"
// This tells Mongo what a "Todo" looks like.
const todoSchema = mongoose.Schema({
    task: {type: String, required: true}, //type has to be String, if it can't be converted, it will throw error. 
    //required: true means that this field MUST be provided when creating a new todo
    completed: {type: Boolean, default: false}, //type has to be Boolean, if it can't be converted, it will throw error
    //default: false means that if this field is not provided, then it defaults to false
    sessionId: { type: String, required: true }
});

//model name is 'Todo'       HERE
const Todo = mongoose.model('Todo', todoSchema); //collection name defaults to 'todos'

//GET
app.get("/todos", async (req, res) => {
    try{
        // *** NEW ***
        // We get the sessionId from the query string (e.g., /todos?sessionId=A1B2)
        // or the request body. Frontend usually sends GET data as query params.
        const sessionId = req.query.sessionId || req.body.sessionId;

        // *** NEW ***
        // Security Check: If they didn't send a session ID, we can't give them a list!
        // We return an empty list or an error. Here we return empty to be safe.
        if (!sessionId) {
            return res.json([]);
        }

        // *** NEW ***
        // Filter: We ONLY fetch todos that match this specific sessionId.
        // User A will never see User B's todos because User B has a different ID.
        const todos = await Todo.find({ sessionId: sessionId });
        const formattedTodos = todos.map(t => ({
        id: t._id,
        task: t.task,
        completed: t.completed
        }));
        res.json(formattedTodos);
    }catch(err){
        res.status(500).send( {error: err.message} );
    }

    //query
    //const completed = req.query.completed;
    // if(completed === "true" || completed === "false"){
    //     if(completed === "true"){
    //         const completedTodos = todos.filter(todo => todo.completed === true);
    //         res.json(completedTodos);
    //     }else{
    //         const incompleteTodos = todos.filter(todo => todo.completed === false);
    //         res.json(incompleteTodos);
    //     }
    // }else{
    //     res.json(todos);
    //     //equivalent to res.send(JSON.stringify(todos))
    // }
});
//        route,          route handler     (from what i understand)
// app.get("/todos/:id", (req, res) => {
//     //    ^path  ^path param(used to locate specific thing)
//     const todo = todos.find((todo) => todo.id === req.params.id);
//     if(todo){
//         res.json(todo);
//     }else{
//         res.status(404).send("id not found");
//     }
// });
//query param(used to filter out something)

// POST
app.post("/todos", async (req, res) => {
    try{
        const body = req.body; //doable b/c of express.json() bodyParser! middleware
    
        const taskValid = body.task && body.task.trim() !== ""; //null task .trim() will never be called because && operator will already evaluate it as false
    
        if(!taskValid){
            return res.status(400).json({
                error: "task content is required"
            })
        }

        // *** NEW ***
        // We check if the frontend sent the Session ID.
        if (!body.sessionId) {
            return res.status(400).json({ error: "sessionId is required" });
        }
    
        const newTodo = await Todo.create({
            task: body.task,
            completed: body.complete,
            // *** NEW ***
            // We save the session ID with the task so we know who owns it.
            sessionId: body.sessionId
        })
        //we don't directly send newTodo b/c that also has other stuff like  __v: 0,       // version key (used internally by Mongoose)
  // plus lots of Mongoose metadata and methods
        //and also in mongoose it's ._id so i would have to change "id" in my frontend too
        res.status(201).json({
            id: newTodo._id,
            task: newTodo.task,
            completed: newTodo.completed
        });
    }catch(err){
        res.status(500).send({error: err.message})
    }
});
     
// PUT
app.put("/todos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { task, completed, sessionId } = req.body; 

        // ... (validation checks) ...

        const updatedTodo = await Todo.findOneAndUpdate(
            { _id: id, sessionId: sessionId }, 
            { task, completed }, 
            { new: true } 
        );

        if (!updatedTodo) {
            // FIX: Add 'return' here too!
            return res.status(404).send("id not found");
        }
        
        res.json({
            id: updatedTodo._id,
            task: updatedTodo.task,
            completed: updatedTodo.completed
        });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
})

//DELETE
app.delete("/todos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        
        // FIX 1: Safely check req.body using optional chaining (?) 
        // or check if it exists first.
        const sessionId = req.query.sessionId || (req.body && req.body.sessionId);

        if (!sessionId) {
            return res.status(400).json({ error: "sessionId is required to delete" });
        }

        const deletedTodo = await Todo.findOneAndDelete({ _id: id, sessionId: sessionId });

        if (!deletedTodo) {
            // FIX 2: Add 'return' here! 
            // Without this, the code continues and tries to send res.status(204) below.
            return res.status(404).send("id not found");
        }

        res.status(204).send();
    } catch (err) {
        // This is likely where your current error is being caught
        console.log(err); // Good to log this so you can see it in your terminal
        res.status(500).send({ error: err.message });
    }
});

//starts the port
//reason it has to be at end is because if you start the port and the other
//middlewares and route handlers is not set up yet and you already received a
//request then u could get errors
app.listen(port, () => console.log("App is listening in PORT: " + port));




