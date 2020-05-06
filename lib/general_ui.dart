import 'package:coronavirus/charts/charts_ui.dart';
import 'package:coronavirus/utilities/my_info.dart';
import 'package:flutter/material.dart';
import 'worldwide/worldwide_ui.dart';
import 'countries/countries_ui.dart';
import 'continents/continents_ui.dart';

class GeneralUI extends StatelessWidget {
  GeneralUI({this.worldWideData, this.countriesData, this.continentsData});

  final worldWideData;
  final countriesData;
  final continentsData;

  final Color primaryColor = Colors.deepOrangeAccent;
  final Color secondaryColor = Colors.white;

  tabs(String name) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 2, vertical: 10),
      child: Text(
        name,
        style: TextStyle(fontSize: 15),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      initialIndex: 0,
      length: 4,
      child: Theme(
        data: ThemeData(
          //primaryColor: primaryColor,
          appBarTheme: AppBarTheme(
            textTheme: TextTheme(
              title: TextStyle(
                color: secondaryColor,
                fontSize: 25.0,
                fontWeight: FontWeight.bold,
              ),
            ),
            iconTheme: IconThemeData(color: secondaryColor),
            actionsIconTheme: IconThemeData(
              color: secondaryColor,
            ),
          ),
        ),
        child: Scaffold(
          backgroundColor: Colors.white24,
          appBar: AppBar(
            elevation: 0,
            backgroundColor: Colors.grey.shade900,
            centerTitle: true,
            title: Text('CoronaVirus'),
            //leading: Icon(Icons.),
            actions: <Widget>[
              IconButton(
                icon: Icon(Icons.more_vert),
                onPressed: () {
                  Navigator.push(context, MaterialPageRoute(builder: (context) {
                    return MyProfile();
                  }));
                },
              )
            ],
            bottom: TabBar(
              isScrollable: true,
              labelColor: primaryColor,
              indicatorColor: primaryColor,
              unselectedLabelColor: secondaryColor,
              tabs: <Widget>[
                tabs("World Wide"),
                tabs("Continents"),
                tabs("Countries"),
                tabs("Charts"),
              ],
            ),
          ),
          body: TabBarView(
            children: <Widget>[
              WorldWideUI(
                data: worldWideData,
              ),
              ContinentsUI(
                data: continentsData,
              ),
              CountriesUI(
                data: countriesData,
              ),
              History(),
            ],
          ),
        ),
      ),
    );
  }
}
