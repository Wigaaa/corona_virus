import 'package:flutter/material.dart';

class WorldWideUI extends StatefulWidget {
  WorldWideUI({this.data});

  final data;

  @override
  _WorldWideUIState createState() => _WorldWideUIState();
}

class _WorldWideUIState extends State<WorldWideUI> {
  int totalCases;
  int totalDeaths;
  int totalRecovered;
  int totalActive;
  int totalCritical;
  int totalTests;
  int todayCases;
  int todayDeaths;
  int affectedCountries;
  var casesPerOneMillion;
  var deathsPerOneMillion;
  var testsPerOneMillion;

  void dataCollect() {
    totalCases = widget.data['cases'];
    totalDeaths = widget.data['deaths'];
    totalRecovered = widget.data['recovered'];
    totalActive = widget.data['active'];
    totalCritical = widget.data['critical'];
    totalTests = widget.data['tests'];
    todayCases = widget.data['todayCases'];
    todayDeaths = widget.data['todayDeaths'];
    casesPerOneMillion = widget.data['casesPerOneMillion'];
    deathsPerOneMillion = widget.data['deathsPerOneMillion'];
    testsPerOneMillion = widget.data['testsPerOneMillion'];
    affectedCountries = widget.data['affectedCountries'];
  }

  ListTile statListTile(String ownTitle, ownTrailing) {
    return ListTile(
      title: Text(
        ownTitle,
        style: TextStyle(
          fontSize: 16,
          color: Colors.white,
        ),
      ),
      trailing: Text('$ownTrailing',
          style: TextStyle(
            fontSize: 18,
            color: Colors.deepOrangeAccent,
          )
          ),
    );
  }

  Container _buildTitledContainer({Widget child, double height}) {
    return Container(
      padding: const EdgeInsets.all(16.0),
      width: double.infinity,
      height: height,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20.0),
        color: Colors.grey.shade900,
      ),
      child: child,
    );
  }

  SliverPadding _buildStatTotal(BuildContext context,String header) {
    return SliverPadding(
      padding: const EdgeInsets.all(16.0),
      sliver: SliverToBoxAdapter(
        child: _buildTitledContainer(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              Text(
                header,
                style: TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 28.0,
                    color: Colors.tealAccent),
              ),
              statListTile('Total Cases', totalCases),
              statListTile('Total Deaths', totalDeaths),
              statListTile('Total Recovered', totalRecovered),
              statListTile('Total Active', totalActive),
              statListTile('Total Critical', totalCritical),
              statListTile('Total Tests', totalTests),
              statListTile('Affected Countries', affectedCountries),
            ],
          ),
        ),
      ),
    );
  }

  SliverPadding _buildStatToday(BuildContext context,String header) {
    return SliverPadding(
      padding: const EdgeInsets.all(16.0),
      sliver: SliverToBoxAdapter(
        child: _buildTitledContainer(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              Text(
                header,
                style: TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 28.0,
                    color: Colors.tealAccent),
              ),
              statListTile('Today Cases', todayCases),
              statListTile('Today Deaths', todayDeaths),

            ],
          ),
        ),
      ),
    );
  }

  SliverPadding _buildStatPerMillion(BuildContext context,String header) {
    return SliverPadding(
      padding: const EdgeInsets.all(16.0),
      sliver: SliverToBoxAdapter(
        child: _buildTitledContainer(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              Text(
                header,
                style: TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 28.0,
                    color: Colors.tealAccent),
              ),
              statListTile('Cases per Million', casesPerOneMillion),
              statListTile('Deaths per Million', deathsPerOneMillion),
              statListTile('Tests per Million', testsPerOneMillion),

            ],
          ),
        ),
      ),
    );
  }

  @override
  void initState() {
    super.initState();
    dataCollect();
  }

  @override
  Widget build(BuildContext context) {
    return CustomScrollView(slivers: <Widget>[
      _buildStatTotal(context,'Statistics'),
      _buildStatToday(context,'Today Stat.'),
      _buildStatPerMillion(context,'Per Million'),
    ]);
  }
}
