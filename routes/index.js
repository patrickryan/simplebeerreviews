var express = require('express');
var router = express.Router();
var scrapeIt = require("scrape-it");
import _ from 'underscore';

import rateBeerLookup from '../services/rateBeerLookup';
import beerAdvocateLookup from '../services/beerAdvocateLookup';
import untappdBeerLookup from '../services/untappdBeerLookup';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Beer Reviews' });
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
    let rb =  _.extend(values[2], { outOf: "100" });
    
    let unScore = (un.score/5) * 100;
    let avg = Number(ba.baScore) + Number(rb.score) + Number(unScore);
    // 95-100 = world-class
    // 90-94 = outstanding
    // 85-89 = very good
    // 80-84 = good
    // 70-79 = okay
    // 60-69 = poor
    // < 60 = awful​

    let beerData = {
      query: beerName,
      avgScore: Math.round(avg / 3),
      reviews: [
        { site: 'BeerAdvocate', data: ba}, 
        { site: 'Untappd', data: un },
        { site: 'RateBeer', data: rb }
      ]
    };
    
    console.log(beerData)
    res.render('review', beerData);
  });
  // Promise.all([rateBeerData, beerAdvocateData, untappdData]).then(values => { 
  //   console.log(values); // [3, 1337, "foo"] 
  // });

  
  // let allReviews = {
  //   reviews: [
  //     { site: 'BeerAdvocate', data: beerAdvocateData},
  //     { site: 'Untappd', data: untappdData},
  //     { site: 'RateBeer', data: rateBeerData}
  //   ]
  // };
  
  // res.render('review', allReviews);
  
  //RATEBEER.COM
  // var rateBeerLink = "https://www.ratebeer.com/findbeer.asp?beername="+beerNameParameterized;
  // let rateBeerData = {};
  // console.log('Processing Rate Beer data');
  // scrapeIt(rateBeerLink, {
  //   beerLink: {
  //     selector: "table > tr a",
  //     attr: 'href',
  //   }
  // 
  // }).then(page => {
  //     // console.log(page.beerLink);
  //     // res.send(page)
  //     // console.log("https://www.ratebeer.com/"+page.beerLink)
  //     scrapeIt("https://www.ratebeer.com/"+page.beerLink, {
  //       title: ".user-header h1",
  //       desc: ".header h2",
  //       value: ".ratingValue",
  //       avatar: {
  //           selector: "#beerImg"
  //         , attr: "src"
  //       }
  //     }).then(page => {
  //         rateBeerData = page;
  //         console.log("Found Rate Beer Data:")
  //         console.log(_.extend(rateBeerData, {outOf: '100'}));
  // 
  //         // console.log(page.value);
  //         // res.send(page)
  //     });
  // });
  // 
  // //BEERADVOCATE.COM
  // const baLink = "https://www.beeradvocate.com/search/?q="+beerNameParameterized+"&qt=beer";
  // let beerAdvocateData = {};
  // console.log('Processing BA data');
  // scrapeIt(baLink, {
  //   beerLink: {
  //     selector: "#ba-content ul li a",
  //     attr: 'href',
  //   }
  // 
  // }).then(page => {
  //     // console.log(page.beerLink);
  //     // res.send(page)
  //     // console.log("https://www.beeradvocate.com"+page.beerLink)
  //     scrapeIt("https://www.beeradvocate.com"+page.beerLink, {
  //       title: '.titleBar h1',
  //       baScore: ".ba-score",
  //       broScore: ".ba-bro_score",
  //       imgURL: {
  //           selector: "#ba-content img"
  //         , attr: "href"
  //       }
  //     }).then(page => {
  //         // console.log(page.title);
  //         // console.log(page.baScore);
  //         // console.log(page.broScore);
  //         // console.log(page.imgURL)
  //         beerAdvocateData = _.extend(page, {outOf: '100'});
  //         console.log("Found BA Data:")
  //         console.log(_.extend(beerAdvocateData, {outOf: '100'}));
  //         // res.send(page)
  //     });
  // });
  // 
  // var untappdLink = "https://untappd.com/search?q="+beerNameParameterized;
  // let untappdData = {};
  // console.log('Processing Untappd data');
  // scrapeIt(untappdLink, {
  //   beerLink: {
  //     selector: ".results-container > .beer-item a",
  //     attr: 'href',
  //   },
  //   // score: '.results-container > .beer-item .rating .num',
  //   
  // 
  // }).then(page => {
  //     // console.log('score is '+page.score)
  //     // console.log(page.beerLink);
  //     // res.send(page)
  //     // console.log("https://untappd.com"+page.beerLink)
  //     scrapeIt("https://untappd.com"+page.beerLink, {
  //       title: '.b_info .name h1',
  //       score: {
  //         selector: ".rating .num",
  //         convert: x => { 
  //           return x.replace('(','').replace(')','');
  //         }
  //       },
  //       imgURL: {
  //           selector: ".b_info img"
  //         , attr: "href"
  //       }
  //     }).then(page => {
  //         // console.log(page.title);
  //         // console.log(page.score);
  //         // console.log(page.imgURL)
  //         console.log("Found Untappd Data:")
  //         untappdData = _.extend(page, {outOf: '5'});
  //         console.log(untappdData)
  //         
  //         let all = { reviews: [{ site: 'BeerAdvocate', data: beerAdvocateData}, { site: 'Untappd', data: untappdData}, {site: 'RateBeer', data: rateBeerData}]}
  //         // res.send(all)
  //         // console.log(all)
  //         res.render('review', all);
  //     });
  // });
})

module.exports = router;
