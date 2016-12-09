import scrapeIt from "scrape-it";
import _ from 'underscore';

export default function beerAdvocateLookup(beerName) {
  const baLink = "https://www.beeradvocate.com/search/?q="+beerName+"&qt=beer";
  let beerAdv = {};
  console.log('Processing Beer Advocate data');
  
  let a = scrapeIt(baLink, {
    beerLink: {
      selector: "#ba-content ul li a",
      attr: 'href',
    }
  });
  
  let b = a.then(page => {    
    return scrapeIt("https://www.beeradvocate.com"+page.beerLink, {
      title: '.titleBar h1',
      baScore: ".ba-score",
      broScore: ".ba-bro_score",
      imgURL: {
          selector: "#ba-content img"
        , attr: "src"
      },
      votes: '.ba-reviews',
    });
  });
  
  return Promise.all([a,b]).then ( result => {
    // console.log(result)
    return result[1];
  })
}