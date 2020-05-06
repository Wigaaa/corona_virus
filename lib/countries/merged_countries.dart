class MergedDataCountries {
  String country;
  String flagIso2;
  String flagUrl;
  int cases;
  int deaths;
  int recovered;
  int active;
  int critical;
  int tests;
  int todayCases;
  int todayDeaths;
  int index;
  var casesPerOneMillion;
  var deathsPerOneMillion;
  var testsPerOneMillion;

  MergedDataCountries({
    this.todayCases,
    this.cases,
    this.testsPerOneMillion,
    this.deathsPerOneMillion,
    this.casesPerOneMillion,
    this.tests,
    this.critical,
    this.active,
    this.recovered,
    this.deaths,
    this.todayDeaths,
    this.flagIso2,
    this.country,
    this.flagUrl,
    this.index,
  });
}
