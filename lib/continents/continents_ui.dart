import 'package:flutter/material.dart';
import 'merged_continents.dart';
import 'package:pie_chart/pie_chart.dart';

class ContinentsUI extends StatefulWidget {
  ContinentsUI({this.data});

  final data;

  @override
  _ContinentsUIState createState() => _ContinentsUIState();
}

class _ContinentsUIState extends State<ContinentsUI> {
  List<MergedDataContinents> _mergedData = [];
  String sortingType = 'A to Z';
  int noOfContinents = 6;
  List<int> indexes = [];
  int radioValue = 0;
  bool chooseChart = false;
  Map<String, double> dataMapCases = Map();
  Map<String, double> dataMapRecovered = Map();
  Map<String, double> dataMapDeaths = Map();
  Map<String, double> dataMapTodayCases = Map();
  Map<String, double> dataMapTodayDeaths = Map();

  List<Color> colorList = [
    Colors.red,
    Colors.green,
    Colors.blue,
    Colors.yellow,
    Colors.purple,
    Colors.brown,
  ];

  void dataProcess() {
    for (var i = 0; i < noOfContinents; ++i) {
      _mergedData.add(
        MergedDataContinents(
            continent: widget.data[i]['continent'],
            cases: widget.data[i]['cases'],
            deaths: widget.data[i]['deaths'],
            active: widget.data[i]['active'],
            recovered: widget.data[i]['recovered'],
            critical: widget.data[i]['critical'],
            todayCases: widget.data[i]['todayCases'],
            todayDeaths: widget.data[i]['todayDeaths'],
            index: i),
      );
      indexes.add(i);
      dataMapCases.putIfAbsent(widget.data[i]['continent'],
          () => double.parse(widget.data[i]['cases'].toString()));
      dataMapRecovered.putIfAbsent(widget.data[i]['continent'],
          () => double.parse(widget.data[i]['recovered'].toString()));
      dataMapDeaths.putIfAbsent(widget.data[i]['continent'],
          () => double.parse(widget.data[i]['deaths'].toString()));
      dataMapTodayCases.putIfAbsent(widget.data[i]['continent'],
          () => double.parse(widget.data[i]['todayCases'].toString()));
      dataMapTodayDeaths.putIfAbsent(widget.data[i]['continent'],
          () => double.parse(widget.data[i]['todayDeaths'].toString()));
    }
  }

  Container _buildTitledContainer({Widget child}) {
    return Container(
      padding: const EdgeInsets.all(16.0),
      width: double.infinity,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20.0),
        color: Colors.grey.shade900,
      ),
      child: child,
    );
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
          )),
    );
  }

  Column _buildStat(int counter) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        Text(
          _mergedData[counter].continent,
          style: TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 28.0,
              color: Colors.tealAccent),
        ),
        statListTile('Today Cases', _mergedData[counter].todayCases),
        statListTile('Today Deaths', _mergedData[counter].todayDeaths),
        statListTile('Cases', _mergedData[counter].cases),
        statListTile('Deaths', _mergedData[counter].deaths),
        statListTile('Recovered', _mergedData[counter].recovered),
        statListTile('Active', _mergedData[counter].active),
        statListTile('Critical', _mergedData[counter].critical),
      ],
    );
  }

  SliverPadding _buildContinents(BuildContext context) {
    return SliverPadding(
      padding: const EdgeInsets.all(16.0),
      sliver: SliverToBoxAdapter(
        child: Column(
          children: <Widget>[
            Padding(
              padding: const EdgeInsets.only(bottom: 16),
              child: _buildTitledContainer(
                child: _buildStat(0),
              ),
            ),
            Padding(
              padding: const EdgeInsets.only(bottom: 16),
              child: _buildTitledContainer(
                child: _buildStat(1),
              ),
            ),
            Padding(
              padding: const EdgeInsets.only(bottom: 16),
              child: _buildTitledContainer(
                child: _buildStat(2),
              ),
            ),
            Padding(
              padding: const EdgeInsets.only(bottom: 16),
              child: _buildTitledContainer(
                child: _buildStat(3),
              ),
            ),
            Padding(
              padding: const EdgeInsets.only(bottom: 16),
              child: _buildTitledContainer(
                child: _buildStat(4),
              ),
            ),
            Padding(
              padding: const EdgeInsets.only(bottom: 16),
              child: _buildTitledContainer(
                child: _buildStat(5),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Column _chart(Map data, String title) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        Text(
          title,
          style: TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 28.0,
              color: Colors.tealAccent),
        ),
        PieChart(
          dataMap: data,
          animationDuration: Duration(milliseconds: 2000),
          chartLegendSpacing: 32.0,
          chartRadius: MediaQuery.of(context).size.width / 2,
          showChartValuesInPercentage: true,
          showChartValues: true,
          showChartValuesOutside: false,
          chartValueBackgroundColor: Colors.grey[200],
          legendStyle: TextStyle(color: Colors.white, fontSize: 12),
          colorList: colorList,
          showLegends: true,
          legendPosition: LegendPosition.left,
          decimalPlaces: 1,
          showChartValueLabel: false,
          initialAngle: 0,
          chartValueStyle: defaultChartValueStyle.copyWith(
            color: Colors.blueGrey[900].withOpacity(0.9),
          ),
          chartType: ChartType.disc,
        ),
      ],
    );
  }

  SliverPadding _buildPieChart() {
    return SliverPadding(
      padding: const EdgeInsets.all(16.0),
      sliver: SliverToBoxAdapter(
        child: Column(
          children: <Widget>[
            Padding(
              padding: const EdgeInsets.only(bottom: 16),
              child: _buildTitledContainer(
                child: _chart(dataMapCases, 'Cases'),
              ),
            ),
            Padding(
              padding: const EdgeInsets.only(bottom: 16),
              child: _buildTitledContainer(
                child: _chart(dataMapRecovered, 'Recovered'),
              ),
            ),
            Padding(
              padding: const EdgeInsets.only(bottom: 16),
              child: _buildTitledContainer(
                child: _chart(dataMapDeaths, 'Deaths'),
              ),
            ),
            Padding(
              padding: const EdgeInsets.only(bottom: 16),
              child: _buildTitledContainer(
                child: _chart(dataMapTodayCases, 'Today Cases'),
              ),
            ),
            Padding(
              padding: const EdgeInsets.only(bottom: 16),
              child: _buildTitledContainer(
                child: _chart(dataMapTodayDeaths, 'Today Deaths'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  SliverPadding _buildRadioButton() {
    return SliverPadding(
      padding: const EdgeInsets.all(16.0),
      sliver: SliverToBoxAdapter(
        child: _buildTitledContainer(
          child: Row(
            children: <Widget>[
              Radio(
                activeColor: Colors.tealAccent,
                focusColor: Colors.white,
                value: 0,
                groupValue: radioValue,
                onChanged: (value) {
                  setState(() {
                    radioValue = value;
                    chooseChart = false;
                  });
                },
              ),
              Text(
                'Statistics',
                style: TextStyle(color: Colors.white, fontSize: 16),
              ),
              SizedBox(
                width: 16,
              ),
              Radio(
                activeColor: Colors.tealAccent,
                focusColor: Colors.white,
                value: 1,
                groupValue: radioValue,
                onChanged: (value) {
                  setState(() {
                    radioValue = value;
                    chooseChart = true;
                  });
                },
              ),
              Text(
                'Pie Chart',
                style: TextStyle(color: Colors.white, fontSize: 16),
              ),
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
      _buildRadioButton(),
      chooseChart ? _buildPieChart() : _buildContinents(context),
    ]);
  }
}
