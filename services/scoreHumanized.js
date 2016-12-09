// Uses BA scoring
// 95-100 = world-class
// 90-94 = outstanding
// 85-89 = very good
// 80-84 = good
// 70-79 = okay
// 60-69 = poor
// < 60 = awful​

export default function scoreHumanized(score) {
  
  if (score >= 95 && score <= 100) {
    return "World Class";
  }
  
  if (score >= 90 && score <= 94) {
    return "Outstanding";
  }
  
  if (score >= 85 && score <= 89) {
    return "Very Good";
  }
  
  if (score >= 80 && score <= 84) {
    return "Good";
  }
  
  if (score >= 70 && score <= 79) {
    return "Okay";
  }
  
  if (score >= 60 && score <= 69) {
    return "Poor";
  }
  
  if (score < 60 ) {
    return "Awful";
  }
  
}