import scrapeIt from "scrape-it";
import _ from 'underscore';

export default function untappdBeerLookup(beerName) {
  const untappdLink = "https://untappd.com/search?q="+beerName;
  let untappdData = {};
  console.log('Processing Untappd data');
  
  let a = scrapeIt(untappdLink, {
    beerLink: {
      selector: ".results-container > .beer-item a",
      attr: 'href',
    },
  });
  
  let b = a.then(page => {
    return scrapeIt("https://untappd.com"+page.beerLink, {
      title: '.b_info .name h1',
      score: {
        selector: ".rating .num",
        convert: x => {
          return x.replace('(','').replace(')','');
        }
      },
      imgURL: {
          selector: '.beer-page >.main >.b_info .top .basic .label img',
          attr: "src"
      },
      votes: '.raters',
    });
  });
  
  return Promise.all([a,b]).then ( result => {
    return result[1];
  })
}