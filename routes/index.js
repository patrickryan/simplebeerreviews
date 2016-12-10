var express = require('express');
var router = express.Router();
var scrapeIt = require("scrape-it");
import _ from 'underscore';

import rateBeerLookup from '../services/rateBeerLookup';
import beerAdvocateLookup from '../services/beerAdvocateLookup';
import untappdBeerLookup from '../services/untappdBeerLookup';
import scoreHumanized from '../services/scoreHumanized';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Beer Review Aggregator' });
});

router.post('/api/beer_lookup', function (req, res) {
  let beerName = req.body.beerName;
  
  if (!beerName)
    return;
    
  let beerNameParameterized = beerName.toLowerCase().replace(/[^a-z0-9]+/g,'+').replace(/(^-|-$)/g,'');
  
  const rateBeerData = rateBeerLookup(beerNameParameterized);
  const beerAdvocateData = beerAdvocateLookup(beerNameParameterized);
  const untappdData = untappdBeerLookup(beerNameParameterized);
  
  Promise.all([untappdData, beerAdvocateData, rateBeerData]).then(values => {
    let un = _.extend(values[0], {outOf: "5"});
    let ba = _.extend(values[1], {outOf: '100'});
    let rb = _.extend(values[2], { outOf: "100" });
    
    let unScore = (un.score/5) * 100;
    // let avg = Number(ba.baScore) + Number(rb.score) + Number(unScore);
    let avgs = [Number(ba.baScore), Number(ba.broScore), Number(rb.score),Number(unScore)];
    
    let allRealAvgs = avgs.filter(function( element ) {
      return (element !== undefined && element !== 0 && isNaN(element) != true);
    });
    
    let sum = 0
    _.each(allRealAvgs, function (num) {
      sum +=num
    })
    
    let finalScore;
    if (allRealAvgs.length == 0) {
      finalScore = null;
    } else {
      finalScore = Math.round(sum / allRealAvgs.length);
    }
    

    let beerData = {
      query: beerName,
      avgScore: finalScore,
      humanizedScore: scoreHumanized(finalScore),
      reviews: [
        { site: 'BeerAdvocate', data: ba}, 
        { site: 'Untappd', data: un },
        { site: 'RateBeer', data: rb }
      ]
    };
    
    res.render('review', beerData);
  });
  
})

module.exports = router;
