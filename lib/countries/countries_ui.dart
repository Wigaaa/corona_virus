import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flag/flag.dart';
import 'merged_countries.dart';

class CountriesUI extends StatefulWidget {
  CountriesUI({this.data});

  final data;

  @override
  _CountriesUIState createState() => _CountriesUIState();
}

class _CountriesUIState extends State<CountriesUI> {
  List<int> indexes = [];
  List<MergedDataCountries> _mergedData = [];
  String sortingType = 'A to Z';
  int noOfCountries = 212;

  InputDecoration kTextFieldStyle = InputDecoration(
    contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
    border: OutlineInputBorder(),
    suffixStyle: TextStyle(color: Colors.green, fontSize: 16),
  );

  TextEditingController _searchQueryController = TextEditingController();
  String searchQuery = '';

  void keyboardDismiss() {
    FocusScopeNode currentFocus = FocusScope.of(context);
    if (!currentFocus.hasPrimaryFocus) {
      currentFocus.unfocus();
    }
  }

  Widget _buildSearchField() {
    return Padding(
      padding: const EdgeInsets.only(left: 16, top: 8, right: 16),
      child: TextFormField(
        showCursor: false,
        onChanged: (query) => updateSearchQuery(query),
        cursorColor: Colors.deepOrangeAccent,
        style: TextStyle(color: Colors.white),
        controller: _searchQueryController,
        decoration: kTextFieldStyle.copyWith(
          icon: Icon(
            Icons.search,
            color: Colors.deepOrangeAccent,
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(30),
            borderSide: BorderSide(color: Colors.deepOrangeAccent),
          ),
          labelText: 'Search',
          suffixIcon: IconButton(
            icon: Icon(
              Icons.clear,
              color: Colors.deepOrangeAccent,
            ),
            onPressed: () {
              setState(() {
                keyboardDismiss();
                WidgetsBinding.instance.addPostFrameCallback((_) {
                  _searchQueryController.clear();
                });
                indexes = [];
                for (var i = 0; i < noOfCountries; ++i) {
                  indexes.add(i);
                }

                });
            },
          ),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(15),
          ),
          labelStyle: TextStyle(
            color: Colors.deepOrangeAccent,
          ),
        ),
      ),
    );
  }

  void updateSearchQuery(String newQuery) {
    setState(() {
      print('start');
      searchQuery = newQuery;
      indexes = [];
      print(indexes);
      for (var i = 0; i < noOfCountries; ++i) {
        if (_mergedData[i]
            .country
            .trim()
            .toLowerCase()
            .contains(newQuery.trim().toLowerCase())) {
          indexes.add(i);
        }
      }
      print('here');
      print('search is $indexes');
      print('search is $searchQuery');
    });
  }

  void dataProcess() {
    for (var i = 0; i < noOfCountries; ++i) {
      _mergedData.add(
        MergedDataCountries(
            country: widget.data[i]['country'],
            flagIso2: widget.data[i]['countryInfo']['iso2'],
            flagUrl: widget.data[i]['countryInfo']['flag'],
            cases: widget.data[i]['cases'],
            deaths: widget.data[i]['deaths'],
            recovered: widget.data[i]['recovered'],
            active: widget.data[i]['active'],
            critical: widget.data[i]['critical'],
            tests: widget.data[i]['tests'],
            todayCases: widget.data[i]['todayCases'],
            todayDeaths: widget.data[i]['todayDeaths'],
            casesPerOneMillion: widget.data[i]['casesPerOneMillion'],
            deathsPerOneMillion: widget.data[i]['deathsPerOneMillion'],
            testsPerOneMillion: widget.data[i]['testsPerOneMillion'],
            index: i),
      );
      indexes.add(i);
    }


  }

  SliverPadding _buildHeader() {
    return SliverPadding(
      padding: const EdgeInsets.all(0.0),
      sliver: SliverToBoxAdapter(
        child: Container(
          width: double.infinity,
          height: 130,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.only(
              bottomLeft: Radius.circular(0),
              bottomRight: Radius.circular(30),
            ),
            color: Colors.grey.shade900,
          ),
          child: Column(
            children: <Widget>[
              Padding(
                padding: const EdgeInsets.all(0.0),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: <Widget>[
                    Padding(
                      padding: const EdgeInsets.only(left: 16.0),
                      child: Text(
                        'Sorted by:',
                        style: TextStyle(color: Colors.white, fontSize: 15),
                      ),
                    ),
                    Text(
                      sortingType,
                      style: TextStyle(
                          color: Colors.deepOrangeAccent,
                          fontSize: 15,
                          fontWeight: FontWeight.bold),
                    ),
                    IconButton(
                        icon: Icon(
                          Icons.menu,
                          color: Colors.deepOrangeAccent,
                        ),
                        onPressed: () {
                          _sortingBottomSheet();
                        }),
                  ],
                ),
              ),
              _buildSearchField(),
            ],
          ),
        ),
      ),
    );
  }

  void _sortingBottomSheet() {
    indexes = [];
    for (var i = 0; i < noOfCountries; ++i) {
      indexes.add(i);
    }
    showModalBottomSheet(
        context: context,
        builder: (builder) {
          return Container(
            color: Colors.grey.shade800,
            height: 400,
            child: SingleChildScrollView(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                mainAxisAlignment: MainAxisAlignment.end,
                children: <Widget>[
                  Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Text(
                      'Sort By: ',
                      style: TextStyle(fontSize: 20, color: Colors.white),
                    ),
                  ),
                  RaisedButton(
                      child: Text('A to Z'),
                      onPressed: () {
                        Navigator.pop(context);
                        setState(() {
                          keyboardDismiss();
                          sortingType = 'A to Z';
                          _mergedData.sort((a, b) {
                            return a.index.compareTo(b.index);
                          });
                        });
                      }),
                  RaisedButton(
                      child: Text('Total Cases'),
                      onPressed: () {
                        setState(() {
                          sortingType = 'Total Cases';
                          _mergedData.sort((a, b) {
                            return b.cases.compareTo(a.cases);
                          });
                        });
                        Navigator.pop(context);
                      }),
                  RaisedButton(
                      child: Text('Total Deaths'),
                      onPressed: () {
                        setState(() {
                          sortingType = 'Total Deaths';
                          _mergedData.sort((a, b) {
                            return b.deaths.compareTo(a.deaths);
                          });
                        });
                        Navigator.pop(context);
                      }),
                  RaisedButton(
                      child: Text('Total Recovered'),
                      onPressed: () {
                        setState(() {
                          sortingType = 'Total Recovered';
                          _mergedData.sort((a, b) {
                            return b.recovered.compareTo(a.recovered);
                          });
                        });
                        Navigator.pop(context);
                      }),
                  RaisedButton(
                      child: Text('Total Active'),
                      onPressed: () {
                        setState(() {
                          sortingType = 'Total Active';
                          _mergedData.sort((a, b) {
                            return b.active.compareTo(a.active);
                          });
                        });
                        Navigator.pop(context);
                      }),
                  RaisedButton(
                      child: Text('Total Tested'),
                      onPressed: () {
                        setState(() {
                          sortingType = 'Total Tested';
                          _mergedData.sort((a, b) {
                            return b.tests.compareTo(a.tests);
                          });
                        });
                        Navigator.pop(context);
                      }),
                  RaisedButton(
                      child: Text('Today Cases'),
                      onPressed: () {
                        setState(() {
                          sortingType = 'Today Cases';
                          _mergedData.sort((a, b) {
                            return b.todayCases.compareTo(a.todayCases);
                          });
                        });
                        Navigator.pop(context);
                      }),
                  RaisedButton(
                      child: Text('Today Deaths'),
                      onPressed: () {
                        setState(() {
                          sortingType = 'Today Deaths';
                          _mergedData.sort((a, b) {
                            return b.todayDeaths.compareTo(a.todayDeaths);
                          });
                        });
                        Navigator.pop(context);
                      }),
                ],
              ),
            ),
            padding: EdgeInsets.all(20),
          );
        });
  }

  ListTile _customListTile(String ownTitle, dynamic value) {
    return ListTile(
      title: Text(
        ownTitle,
        style: TextStyle(color: Colors.white, fontSize: 16),
      ),
      trailing: Text(
        '$value',
        style: TextStyle(color: Colors.deepOrangeAccent, fontSize: 16),
      ),
    );
  }

  SliverPadding _buildExpansionTile(BuildContext context, int counter) {
    return SliverPadding(
      padding: const EdgeInsets.all(4.0),
      sliver: SliverToBoxAdapter(
        child: Container(
          padding: EdgeInsets.symmetric(horizontal: 4),
          margin: EdgeInsets.symmetric(horizontal: 16, vertical: 4),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(10),
            color: Colors.black12,
          ),
          child: ExpansionTile(
            title: Text(
              '${_mergedData[counter].country}',
              style: TextStyle(color: Colors.white),
            ),
            children: <Widget>[
              Flags.getFullFlag(
                  _mergedData[counter].flagIso2 ?? 'eg', 100, 200),
              SizedBox(
                height: 20,
              ),
              _customListTile('Today Cases', _mergedData[counter].todayCases),
              _customListTile('Today Deaths', _mergedData[counter].todayDeaths),
              _customListTile('Total Cases', _mergedData[counter].cases),
              _customListTile('Total Deaths', _mergedData[counter].deaths),
              _customListTile(
                  'Total Recovered', _mergedData[counter].recovered),
              _customListTile('Active', _mergedData[counter].active),
              _customListTile('Critical', _mergedData[counter].critical),
              _customListTile('Total Tested', _mergedData[counter].tests),
              _customListTile('cases Per One Million',
                  _mergedData[counter].casesPerOneMillion),
              _customListTile('deaths Per One Million',
                  _mergedData[counter].deathsPerOneMillion),
              _customListTile('tests Per One Million',
                  _mergedData[counter].testsPerOneMillion),
            ],
          ),
        ),
      ),
    );
  }

  @override
  void initState() {
    super.initState();
    dataProcess();
  }

  @override
  Widget build(BuildContext context) {
    return CustomScrollView(slivers: <Widget>[
      _buildHeader(),
      for (var i in indexes) _buildExpansionTile(context, i),
    ]);
  }
}
