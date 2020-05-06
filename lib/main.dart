import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'utilities/api_data.dart';
void main() => runApp(MyApp());

class MyApp extends StatelessWidget {

  @override
  Widget build(BuildContext context) {

    SystemChrome.setPreferredOrientations([
      DeviceOrientation.portraitDown,
      DeviceOrientation.portraitUp,
    ]);

    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'CoronaVirus',
      theme: ThemeData.dark(),
      routes: {
        LoadingPage.id: (context) => LoadingPage(),
      },
      initialRoute: LoadingPage.id,
    );
  }
}
