const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended : true}));

//public directory to store static files
app.use(express.static("public"));

//connecting to mongoDB database
mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser: true})

//schema of collection
const articleSchema = {
    title: String,
    content: String
}
//collection of articles
const Article = mongoose.model("Article", articleSchema);

//GET route
// app.get("/articles", function(req,res){
//     Article.find(function(err, foundArticles){
//         if(!err){
//             res.send(foundArticles);
//         }else{
//             res.send(err);
//         }
//     })
// });

// app.post("/articles",function(req,res){
//     const newArticle = new Article({
//         title: req.body.title,
//         content: req.body.content
//     })
//     newArticle.save(function(err){
//         if(!err){
//             res.send("Successfully added a new article.");
//         }else{
//             res.send(err);
//         }
//     });
// })

// app.delete("/articles", function(req,res){
//     Article.deleteMany(function(err){
//         if(!err){
//             res.send("Successfully deleted all the articles");
//         }else{
//             res.send(err);
//         }
//     })
// })

// app.route("/articles").get().post().delete() chained route handlers
app.route("/articles").get(function(req,res){
    Article.find(function(err, foundArticles){
                if(!err){
                    res.send(foundArticles);
                }else{
                    res.send(err);
                }
    })
})
.post(function(req,res){
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    })
    newArticle.save(function(err){
        if(!err){
            res.send("Successfully added a new article.");
        }else{
            res.send(err);
        }
    });
})
.delete(function(req,res){
    Article.deleteMany(function(err){
        if(!err){
            res.send("Successfully deleted all the articles");
        }else{
            res.send(err);
        }
    })
})

//-------Routes for specific articles--------
//:params
// Route path: /users/:userId/books/:bookId
// Request URL: http://localhost:3000/users/34/books/8989
// req.params: { "userId": "34", "bookId": "8989" }
app.route("/articles/:articleTitle")
.get(function(req,res){
    Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
        if(foundArticle){
            res.send(foundArticle);
        }else{
            res.send("No articles was found");
        }
    })
})
.put(function(req,res){
    Article.updateOne({title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        function(err){
            if(!err){
                res.send("Successfully updated the article!")
            }else{
                res.send(err);
            }
    })
})
.patch(function(req,res){
    Article.updateOne({title: req.params.articleTitle},
        {$set: req.body},
        function(err){
            if(!err){
                res.send("Successfully updated the article!")
            }else{
                res.send(err);
            }
    })
})
.delete(function(req,res){
    Article.deleteOne({title:req.params.articleTitle},
        function(err){
        if(!err){
            res.send("Successfully deleted the article");
        }else{
            res.send(err);
        }
    })
})



app.listen(3001 , function () {
    console.log("Started our server on port 3001");
});