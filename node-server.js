
const express = require('express'),
  raccoon = require('raccoon'),
  path = require('path'),
  starter = require('./sampleContent/starter.js'),
  app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/login', function(req, res){
  starter.buildLoginObject(req.query[':username'], function(object){
    res.send(object);
  });
});

app.get('/newRating', function(req, res){
  let replyObj = {};

  let raccoonFeeling = req.query.movie.like === 'liked' ? raccoon.liked : raccoon.disliked;

  raccoonFeeling(req.query[':userId'], req.query.movie.id).then(() => {
    raccoon.stat.recommendFor(req.query[':userId'], 15, function(recs){
      console.log('recs', recs);
      raccoon.stat.mostSimilarUsers(req.query[':userId'], function(simUsers){
        raccoon.stat.bestRatedWithScores(9, function(bestRated){
          replyObj = {
            recommendations: recs,
            similarUsers: simUsers,
            bestScores: bestRated
          };
          console.log('replyObj', replyObj);
          res.send(replyObj);
        });
      });
    });
  });
});

app.get('/movieLikes', function(req, res){
  let replyObj = {};
  raccoon.stat.likedBy(req.query[':movieId'], function(likes){
    raccoon.stat.dislikedBy(req.query[':movieId'], function(dislikes){
      replyObj = {
        likedBy: likes,
        dislikedBy: dislikes
      };
      res.send(replyObj);
    });
  });
});

app.listen(3000, function() {
  console.log('--- Mosaic up and running! ---');
});
