import scrapeIt from "scrape-it";
import _ from 'underscore';

export default function beerAdvocateLookup(beerName) {
  const rateBeerLink = "https://www.ratebeer.com/findbeer.asp?beername="+beerName;
  let beerAdv = {};
  console.log('Processing Beer Advocate data');
  
  let a = scrapeIt(rateBeerLink, {
    beerLink: {
      selector: "table > tr a",
      attr: 'href',
    }
  });
  
  let b = a.then(page => {    
    return scrapeIt("https://www.ratebeer.com/"+page.beerLink, {
            title: ".user-header h1",
            desc: ".header h2",
            score: ".ratingValue",
            imgURL: {
                selector: "#beerImg"
              , attr: "src"
            },
            votes: "#_ratingCount8",
          })
  });
  
  return Promise.all([a,b]).then ( result => {
    return result[1];
  }).catch((error) => {
    return error;
  });
}