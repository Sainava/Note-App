const express=require("express");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");

const app=express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/noteDB");

const noteSchema = new mongoose.Schema({
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters long"],
      maxlength: [100, "Title must be at most 100 characters long"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId, // Link to User collection
      ref: 'User',
    },
    creationDate: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
    lastUpdate: {
      type: Date,
      default: Date.now,
    },
    tags: {
      type: [String],
      default: [],
    },
    collaborators: {
      type: [mongoose.Schema.Types.ObjectId], // References to other users
      ref: 'User',
      default: [],
    },
  });

  const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    notes: [
      {
        type: mongoose.Schema.Types.ObjectId, // Reference to Note collection
        ref: 'Note',
      },
    ],
  });

//For enabling full text search
noteSchema.index({ title: 'text', content: 'text' });

const User=new mongoose.model('User',userSchema);

const Note=new mongoose.model('Note',noteSchema);


app.get("/",function(req,res){
    res.render("signup");
});


app.post("/signup",function(req,res){
    const newUser=new User({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password
    })
    newUser.save()
    .then(function(){
        res.render("home",{notes:notes,searchQuery:"",isSearch:false});
    })
    .catch(function(err){
        console.log(err);
    })
});

app.get("/login",function(req,res){
    res.render("login");
});

app.post("/login",function(req,res){
    User.findOne({name:req.body.name,password:req.body.password}).
    then((foundUser)=>{
        if(!foundUser){
            res.render("failure");
        }else{
            res.redirect("home");
        }
    })
    .catch((err)=>{
        console.log(err);
    })
});


app.post("/failure",function(req,res){
    res.redirect("/");
});


app.get("/home",function(req,res){
    Note.find({})
    .then((notes)=>{
        res.render("home",{notes:notes,searchQuery:"",isSearch:false});
    })
});

app.post("/home",function(req,res){
    const newNote=new Note({
        title:req.body.title,
        content:req.body.content,
        tags:req.body.tags,
    });
    newNote.save()
    .then(function(){
        res.redirect("home");
    })
});


app.get("/create",function(req,res){
    res.render("create",{searchQuery:""});
})

app.get("/:postName",function(req,res){
    const requestedTitle=req.params.postName;
    Note.findOne({title:requestedTitle})
    .then(function(note){
        res.render("post",{note:note,searchQuery:""});
    })
    .catch(function(err){
        console.log(err);
    })
});

app.post('/search', function (req, res) {
    const query = req.body.search || "";
  
    // Check if the query looks like a valid ObjectId
    if (mongoose.Types.ObjectId.isValid(query)) {
      Note.findById(query)
        .then((note) => {
          if (note) {
            // If a note with the given ID is found, render post.ejs
            return res.render('post', { note: note, searchQuery: query ,isSearch:true});
          } else {
            // If no note with the given ID is found, proceed with text search
            return Note.find({ $text: { $search: query } });
          }
        })
        .then((notes) => {
          if (Array.isArray(notes) && notes.length > 0) {
            // If notes are found in the text search, render the home page
            res.render('home', { notes: notes, searchQuery: query ,isSearch:true});
          } else if (Array.isArray(notes)) {
            // If no notes are found in the text search
            res.render("searchFailure");
          }
        })
        .catch((err) => {
          console.log(err);
          res.render("searchFailure");
        });
    } else {
      // If the query is not a valid ObjectId, perform a text search
      Note.find({ $text: { $search: query } })
        .then((notes) => {
          if (notes.length > 0) {
            res.render('home', { notes: notes, searchQuery: query ,isSearch:true});
          } else {
            res.render("searchFailure");
          }
        })
        .catch((err) => {
          console.log(err);
          res.render("searchFailure");
        });
    }
  });
  

app.post("/delete/:noteID",function(req,res){
    const noteID=req.params.noteID;
    Note.findByIdAndDelete(noteID)
    .then(()=>{
        res.redirect("/home");
    })
    .catch((err)=>{
        console.log(err);
        res.redirect("/home");
    })
})

app.get("/edit/:noteId",function(req,res){
    const noteId=req.params.noteId;
    Note.findById(noteId)
    .then((note)=>{
        if(!note){
            res.redirect("/home");
        }else{
        res.render("edit",{note:note,searchQuery:""});
        }
    })
    .catch((err)=>{
        console.log(err);
     })
})

app.post("/edit/:noteID", (req, res) => {
    const noteID = req.params.noteID;

    // Updated fields
    const updatedNote = {
        title: req.body.title,
        content: req.body.content,
        tags: req.body.tags.split(",").map((tag) => tag.trim()), // Convert tags to an array
        lastUpdate: Date.now() // Update the lastUpdate timestamp
    };

    Note.findByIdAndUpdate(noteID, updatedNote, { new: true })
        .then(() => {
            console.log(`Note with ID ${noteID} updated successfully.`);
            res.redirect("/home");
        })
        .catch((err) => {
            console.error(err);
            res.redirect("/home");
        });
});


app.listen(3000, function(){
    console.log("Server started on port 3000");
});



