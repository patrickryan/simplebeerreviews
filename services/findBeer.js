import _ from 'underscore';
import rateBeerLookup from '../services/rateBeerLookup';
import beerAdvocateLookup from '../services/beerAdvocateLookup';
import untappdBeerLookup from '../services/untappdBeerLookup';

extend default function findBeer(beerNameParameterized) {
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
  return beerData;
}