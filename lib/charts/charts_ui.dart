import 'package:flutter/material.dart';
import 'package:autocomplete_textfield/autocomplete_textfield.dart';
import 'history_countries_list.dart';
import 'package:http/http.dart' as http;
import 'dart:convert' as convert;
import 'package:charts_flutter/flutter.dart' as charts;

class ChartData {
  final int year;
  final int casesPerDay;

  ChartData(this.year, this.casesPerDay);

  // Returns Jan.1st of that year as date.
  DateTime get date => DateTime(this.year, 1, 1);
}

class History extends StatefulWidget {
  @override
  _HistoryState createState() => _HistoryState();
}

class _HistoryState extends State<History> {
  String currentText = "";
  String historyUrl = 'https://corona.lmao.ninja/v2/historical/';
  var jsonData;
  List<dynamic> cases = [0];
  List<dynamic> deaths = [0];
  List<dynamic> recovered = [0];
  List<dynamic> dates;
  bool loaded = false;

  List<ChartData> _cases1, _deaths1, _recovered1;

  GlobalKey<AutoCompleteTextFieldState<String>> key = new GlobalKey();

  Future<void> historyApi() async {
    setState(() {
      loaded = false;
    });
    try {
      http.Response response = await http.get('$historyUrl$currentText');
      if (response.statusCode == 200) {
        jsonData = convert.jsonDecode(response.body);
        cases = jsonData['timeline']['cases'].values.toList();
        deaths = jsonData['timeline']['deaths'].values.toList();
        recovered = jsonData['timeline']['recovered'].values.toList();
        dates = jsonData['timeline']['cases'].keys.toList();

        _cases1 = [
          for (int i = 0; i < cases.length; ++i) ChartData(i, cases[i]),
        ];

        _recovered1 = [
          for (int i = 0; i < recovered.length; ++i) ChartData(i, recovered[i]),
        ];

        _deaths1 = [
          for (int i = 0; i < deaths.length; ++i) ChartData(i, deaths[i]),
        ];

        setState(() {
          loaded = true;
        });
      } else {
        print('Request failed with status: ${response.statusCode}.');
      }
    } catch (e) {
      print(e);
    }
  }

  Container chartsForAll(String title, Function _color, List<ChartData> data) {
    return Container(
      margin: EdgeInsets.all(12),
      decoration: const BoxDecoration(
          borderRadius: BorderRadius.all(
            Radius.circular(18),
          ),
          color: Color(0xff232d37)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: <Widget>[
          Padding(
            padding: const EdgeInsets.only(left: 16, top: 16),
            child: Text(
              title,
              style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 25.0,
                  color: Colors.tealAccent),
            ),
          ),
          Padding(
            padding:
                const EdgeInsets.only(left: 12, right: 4, top: 12, bottom: 12),
            child: Container(
              height: 300,
              child: charts.TimeSeriesChart(
                /*seriesList=*/
                [
                  charts.Series<ChartData, DateTime>(
                    id: title,
                    colorFn: _color,
                    domainFn: (ChartData sales, _) => sales.date,
                    measureFn: (ChartData sales, _) => sales.casesPerDay,
                    data: data,
                  ),
                ],
                defaultInteractions: true,
                defaultRenderer: charts.LineRendererConfig(
                  includePoints: true,
                  includeArea: false,
                  stacked: true,
                ),
                animate: true,
                behaviors: [
                  charts.SeriesLegend(
                      position: charts.BehaviorPosition.bottom,
                      entryTextStyle: charts.TextStyleSpec(
                          color: charts.MaterialPalette.white)),
                  // Highlight X and Y value of selected point.
                  charts.LinePointHighlighter(
                    showHorizontalFollowLine:
                        charts.LinePointHighlighterFollowLineType.all,
                    showVerticalFollowLine:
                        charts.LinePointHighlighterFollowLineType.nearest,
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return CustomScrollView(slivers: <Widget>[
      SliverToBoxAdapter(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: SimpleAutoCompleteTextField(
            suggestionsAmount: 30,
            key: key,
            decoration: InputDecoration(
              contentPadding:
                  EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              suffixStyle: TextStyle(color: Colors.green, fontSize: 16),
              icon: Icon(
                Icons.search,
                color: Colors.deepOrangeAccent,
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(30),
                borderSide: BorderSide(color: Colors.deepOrangeAccent),
              ),
              labelText: 'Search Country',
              suffixIcon: IconButton(
                icon: Icon(
                  Icons.clear,
                  color: Colors.deepOrangeAccent,
                ),
                onPressed: () {},
              ),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(15),
              ),
              labelStyle: TextStyle(
                color: Colors.deepOrangeAccent,
              ),
            ),
            controller: TextEditingController(text: ''),
            suggestions: suggestions,
            //textChanged: (text) => currentText = text,
            clearOnSubmit: false,
            style: TextStyle(color: Colors.white),
            textSubmitted: (text) {
              if (text != "") {
                currentText = text;
                setState(() {
                  historyApi();
                });
              }
            },
          ),
        ),
      ),
      SliverToBoxAdapter(
        child: loaded
            ? Padding(
              padding: const EdgeInsets.only(left: 16,right: 16),
              child: Container(
          padding: const EdgeInsets.all(16.0),
          width: double.infinity,
          decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(20.0),
              color: Color(0xff232d37),
          ),
          child: Center(child: Text('Charts for Last 30 Days',style: TextStyle(fontSize: 25,color: Colors.deepOrangeAccent),)),
        ),
            )
            : Center(child: Text('')),
      ),
      SliverToBoxAdapter(
        child: loaded
            ? chartsForAll(
                'Cases',
                (_, __) => charts.MaterialPalette.yellow.shadeDefault,
                this._cases1)
            : Center(child: Text('')),
      ),
      SliverToBoxAdapter(
        child: loaded
            ? chartsForAll(
                'Recovered',
                (_, __) => charts.MaterialPalette.green.shadeDefault,
                this._recovered1)
            : Center(child: Text('')),
      ),
      SliverToBoxAdapter(
        child: loaded
            ? chartsForAll(
                'Deaths',
                (_, __) => charts.MaterialPalette.red.shadeDefault,
                this._deaths1)
            : Center(child: Text('')),
      ),
    ]);
  }
}


