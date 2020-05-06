import 'package:coronavirus/general_ui.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'dart:convert' as convert;
import 'package:http/http.dart' as http;
import 'package:flutter_spinkit/flutter_spinkit.dart';
import 'package:connectivity/connectivity.dart';
import 'dart:io';

class LoadingPage extends StatefulWidget {
  static const String id = 'loading_page';

  @override
  _LoadingPageState createState() => _LoadingPageState();
}

class _LoadingPageState extends State<LoadingPage> {
  var jsonWorldWide;
  var jsonCountries;
  var jsonContinents;

  bool connected = true;
  bool loading = false;
  bool isFirstTime = true;
  String countriesUrl = 'https://corona.lmao.ninja/v2/countries';
  String worldWideUrl = 'https://corona.lmao.ninja/v2/all';
  String continentsUrl = 'https://corona.lmao.ninja/v2/continents?yesterday=false';

OutlineButton _customButton(String title,IconData ownIcon){
  return OutlineButton.icon(
    icon: Icon(ownIcon),
    label: Text(title,style: TextStyle(fontSize: 18),),
    borderSide: BorderSide(color: Colors.red),
    disabledBorderColor: Colors.grey,
    disabledTextColor: Colors.grey,
    textColor: Colors.white,
    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
    padding: EdgeInsets.symmetric(horizontal: 25, vertical: 10),
    onPressed: (){
      setState(() {
        connectivityCheck();
      });
    },
  );
}


  Future<void> worldWideApi() async {
    try {
      http.Response response = await http.get(worldWideUrl);
      if (response.statusCode == 200) {
        jsonWorldWide = convert.jsonDecode(response.body);
        //print('$jsonWorldWide');
      } else {
        print('Request failed with status: ${response.statusCode}.');
      }
    } catch (e) {
      print(e);
    }
  }

  Future<void> countriesApi() async {
    try {
      http.Response response = await http.get(countriesUrl);
      if (response.statusCode == 200) {
        jsonCountries = convert.jsonDecode(response.body);
      } else {
        print('Request failed with status: ${response.statusCode}.');
      }
    } catch (e) {
      print(e);
    }
  }

  Future<void> continentsApi() async {
    try {
      http.Response response = await http.get(continentsUrl);
      if (response.statusCode == 200) {
        jsonContinents = convert.jsonDecode(response.body);
      } else {
        print('Request failed with status: ${response.statusCode}.');
      }
    } catch (e) {
      print(e);
    }
  }

  Future<void> startApi() async {
    setState(() {
      loading = true;
    });
    await worldWideApi();
    await countriesApi();
    await continentsApi();

    loading = false;
    if (jsonWorldWide == null || jsonCountries == null || jsonContinents == null) {
      print('no connection');
    } else {
      Navigator.push(context, MaterialPageRoute(builder: (context) {
        return GeneralUI(
          worldWideData: jsonWorldWide,
          countriesData: jsonCountries,
          continentsData: jsonContinents,
        );
      }));
    }
  }



  Future<void> connectivityCheck() async {
    setState(() {
      connected = false;
    });
    var connectivityResult = await (Connectivity().checkConnectivity());
    if (connectivityResult == ConnectivityResult.mobile ||
        connectivityResult == ConnectivityResult.wifi) {
      try {
        final result = await InternetAddress.lookup('google.com');
        if (result.isNotEmpty && result[0].rawAddress.isNotEmpty) {
          connected = true;
          startApi();
          print('connected');
        }
      } on SocketException catch (_) {
        connected = false;
        print('connected but no internet');
        _errorBottomSheet();
      }
    } else {
      connected = false;
      print('not connected');
      _errorBottomSheet();
    }
  }

  void _errorBottomSheet() {
    showModalBottomSheet(
        context: context,
        builder: (builder) {
          return Container(
            color: Colors.grey.shade900,
            height: 100,
            child: Center(
                child: Text(
              'no internet',
              style: TextStyle(color: Colors.white),
            )),
            padding: EdgeInsets.all(20),
          );
        });
  }

  @override
  void initState() {
    super.initState();
    connectivityCheck();
    //countriesApi();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      //backgroundColor: Colors.black,
      body: Stack(
        alignment: AlignmentDirectional.bottomEnd,
        children: <Widget>[
          Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: <Widget>[
              Expanded(
                flex: 1,
                child: Container(
                  width: double.infinity,
                  decoration: BoxDecoration(
                    image: DecorationImage(
                        image: AssetImage(
                          'images/markus.jpg',
                        ),
                        fit: BoxFit.cover),
                  ),
                  child: Center(),
                ),
              ),
              Expanded(
                flex: 1,
                child: Container(
                  decoration: BoxDecoration(
                    color: Colors.black,
                  ),
                ),
              ),
            ],
          ),
          Column(
            children: <Widget>[
              Expanded(
                flex: 4,
                child: Container(
                  color: Colors.transparent,
                  width: double.infinity,
                ),
              ),
              Expanded(
                flex: 6,
                child: Container(
                  width: double.infinity,
                  height: 450,
                  decoration: BoxDecoration(
                      boxShadow: [
                        BoxShadow(
                            color: Colors.red,
                            blurRadius: 40,
                            offset: Offset(10, 10))
                      ],
                      color: Color(0xff130f0f),
                      borderRadius: BorderRadius.only(
                          topLeft: Radius.circular(40),
                          topRight: Radius.circular(40))),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: <Widget>[
                      Text(
                        'CoronaVirus'.toUpperCase(),
                        style: TextStyle(
                            fontSize: 40,
                            color: Colors.red,
                            fontWeight: FontWeight.bold),
                      ),
                      Text(
                        'Covid-19'.toUpperCase(),
                        style: TextStyle(
                            fontSize: 30,
                            color: Colors.white,
                            fontWeight: FontWeight.bold),
                      ),
                      connected
                          ? loading
                              ? SpinKitFoldingCube(
                                  itemBuilder:
                                      (BuildContext context, int index) {
                                    return DecoratedBox(
                                      decoration: BoxDecoration(
                                        color: index.isEven
                                            ? Colors.red
                                            : Colors.white,
                                      ),
                                    );
                                  },
                                )
                              : _customButton('Reload Again', Icons.loop)
                          : _customButton('Retry Again', Icons.signal_wifi_off)
                            ,
                    ],
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
