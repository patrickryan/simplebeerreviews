var express = require('express');
var router = express.Router();
var scrapeIt = require("scrape-it");
var _ = require('underscore');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Beer Reviews' });
});

router.post('/api/beer_lookup', function (req, res) {
  let beerName = req.body.beerName;
  
  if (!beerName)
    return;
    
  let beerNameParameterized = beerName.toLowerCase().replace(/[^a-z0-9]+/g,'+').replace(/(^-|-$)/g,'');
  // console.log(link)
  
  // RATEBEER.COM
  // var rateBeerLink = "https://www.ratebeer.com/findbeer.asp?beername="+beerNameParameterized;
  // let rateBeerData = {};
  // scrapeIt(rateBeerLink, {
  //   beerLink: {
  //     selector: "table > tr a",
  //     attr: 'href',
  //   }
  // 
  // }).then(page => {
  //     // console.log(page.beerLink);
  //     // res.send(page)
  //     console.log("https://www.ratebeer.com/"+page.beerLink)
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
  //         console.log(_.extend(rateBeerData, {outOf: '100'}));
  // 
  //         // console.log(page.value);
  //         // res.send(page)
  //     });
  // });
  // 
  // BEERADVOCATE.COM
  var baLink = "https://www.beeradvocate.com/search/?q="+beerNameParameterized+"&qt=beer";
  let baData = {}
  scrapeIt(baLink, {
    beerLink: {
      selector: "#ba-content ul li a",
      attr: 'href',
    }
  
  }).then(page => {
      // console.log(page.beerLink);
      // res.send(page)
      // console.log("https://www.beeradvocate.com"+page.beerLink)
      scrapeIt("https://www.beeradvocate.com"+page.beerLink, {
        title: '.titleBar h1',
        baScore: ".ba-score",
        broScore: ".ba-bro_score",
        imgURL: {
            selector: "#ba-content img"
          , attr: "href"
        }
      }).then(page => {
          console.log(page.title);
          console.log(page.baScore);
          console.log(page.broScore);
          // console.log(page.imgURL)
          baData = _.extend(page, {outOf: '100'});
          // console.log(_.extend(baData, {outOf: '100'}));
          // res.send(page)
      });
  });
  
  var untappdLink = "https://untappd.com/search?q="+beerNameParameterized;
  let untappdData = {};
  scrapeIt(untappdLink, {
    beerLink: {
      selector: ".results-container > .beer-item a",
      attr: 'href',
    },
    // score: '.results-container > .beer-item .rating .num',
    
  
  }).then(page => {
      // console.log('score is '+page.score)
      // console.log(page.beerLink);
      // res.send(page)
      // console.log("https://untappd.com"+page.beerLink)
      scrapeIt("https://untappd.com"+page.beerLink, {
        title: '.b_info .name h1',
        score: {
          selector: ".rating .num",
          convert: x => { 
            return x.replace('(','').replace(')','');
          }
        },
        imgURL: {
            selector: ".b_info img"
          , attr: "href"
        }
      }).then(baData).then(page => {
          // console.log(page.title);
          // console.log(page.score);
          // console.log(page.imgURL)
          untappdData = _.extend(page, {outOf: '5'});
          
          let all = { reviews: [{ site: 'BeerAdvocate', data: baData}, { site: 'Untappd', data: untappdData}]}
          // res.send(all)
          console.log(all)
          res.render('review', all);
      });
  });
})

// app.post('/api/beer_lookup', function (req, res) {
//   debugger;
//   res.send('POST request to the homepage')
// })
module.exports = router;
