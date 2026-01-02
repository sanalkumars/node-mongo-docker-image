const express = require("express");
const mongose = require("mongoose")

const app = express();

const PORT = process.env.PORT || 8080;

app.use(express.json());

// connecting to mongodb
// now here we are connecting to the mongodb image / not any localhost one 
mongose.connect("mongodb://admin:password@mongodb:27017/usertestDB?authSource=admin", {
    useNewUrlParser: true,
    useUnifiedTopology: false  // Fixes deprecation warning
}).then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log("error occured during mongodb connect", err))

// userschema
const userSchema = new mongose.Schema({
    username: String,
    password: String
});

// user model
const User = mongose.model("User", userSchema);


app.get("/", (req, res) => {
    return res.json({
        message: "Hi this is from the dockerized nodejs server"
    });
});

app.post("/register", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: "Username and password required" });
    }
    try {
        const newUser = new User({ username, password }); // creating the user object
        await newUser.save(); // save the new user object to the DB
        return res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.log("error occured during user create",error)
       return res.status(500).json({ error: "Failed to save user" });
    }
})

app.get("/users",async(req, res)=>{
    try {
        
        const users = await  User.find() // return an array of users
        return res.status(201).json({
            users,
            message:"Users fetched successfully"
        })
    } catch (error) {
           console.log("error occured during users fetch",error)
       return res.status(500).json({ error: "Failed to fetch s" });
    }
})

app.listen(PORT, () => {
    console.log(`Server started running at ${PORT}`);
});