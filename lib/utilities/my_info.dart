import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';

class MyProfile extends StatelessWidget {
  static const String id = 'my_profile';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: Colors.white10,
        body: SafeArea(
          child: ListView(
            children: <Widget>[
              Stack(
                children: <Widget>[
                  Container(
                    decoration: BoxDecoration(
                        gradient: LinearGradient(
                            colors: [Colors.redAccent,Colors.indigoAccent])),
                    width: double.infinity,
                    height: 310,
                    //color: Theme.of(context).scaffoldBackgroundColor,
                  ),
                  Positioned(
                    top: 10,
                    left: 10,
                    child: IconButton(
                        icon: Icon(
                          Icons.arrow_back,
                          color: Colors.white,
                        ),
                        onPressed: () {
                          Navigator.pop(context);
                        }),
                  ),
                  Column(
                    children: <Widget>[
                      Container(
                        height: 100,
                        margin: EdgeInsets.only(top: 30),
                        child: CircleAvatar(
                          radius: 50,
                          backgroundImage: AssetImage('images/photo.jpg'),
                        ),
                      ),
                      Padding(
                        padding: EdgeInsets.all(4),
                      ),
                      Text(
                        "Wagdy Mohamed",
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 25,
                          fontFamily: 'Pacifico',
                        ),
                        textAlign: TextAlign.center,
                      ),
                      Padding(
                        padding: EdgeInsets.all(4),
                      ),
                      Text(
                        "Electrical Engineer",
                        style: TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.w400,
                          fontSize: 16,
                          fontFamily: 'Pacifico',
                        ),
                        textAlign: TextAlign.center,
                      ),
                      Container(
                        margin: EdgeInsets.only(top: 25),
                        padding: EdgeInsets.all(10),
                        child: Card(
                          child: Container(
                            color: Colors.black38,
                            alignment: Alignment.topLeft,
                            padding: EdgeInsets.all(15),
                            child: Column(
                              children: <Widget>[
                                Container(
                                  alignment: Alignment.topLeft,
                                  child: Text(
                                    "Information",
                                    style: TextStyle(
                                      color: Colors.white,
                                      fontWeight: FontWeight.w500,
                                      fontSize: 16,
                                    ),
                                    textAlign: TextAlign.left,
                                  ),
                                ),
                                Divider(
                                  color: Colors.white70,
                                ),
                                Container(
                                    child: Column(
                                      children: <Widget>[
                                        ListTile(
                                          leading: Icon(Icons.work),
                                          title: Text("work"),
                                          subtitle: Text(
                                              "ETO at Maridive & Oil Services"),
                                        ),
                                        ListTile(
                                          leading: Icon(FontAwesomeIcons.mailBulk),
                                          title: Text("Email"),
                                          subtitle: Text("wigaaa@gmail.com"),
                                        ),
                                        ListTile(
                                          leading: Icon(Icons.phone),
                                          title: Text("Phone"),
                                          subtitle: Text("01067686499"),
                                        ),
                                        ListTile(
                                          leading:
                                          FaIcon(FontAwesomeIcons.facebook),
                                          title: Text("facebook"),
                                          subtitle: Text("Wagdy Mohamed"),
                                        ),
                                        ListTile(
                                          leading:
                                          FaIcon(FontAwesomeIcons.whatsapp),
                                          title: Text("whatsApp"),
                                          subtitle: Text("01067686499"),
                                        ),
                                        ListTile(
                                          leading: Icon(Icons.apps),
                                          title: Text("About App"),
                                          subtitle: Text('The Application is designed for CoronaVirus data based on WHO'),
                                        ),
                                      ],
                                    ))
                              ],
                            ),
                          ),
                        ),
                      ),
                      // UserInfo()
                    ],
                  )
                ],
              ),
            ],
          ),
        ));
  }
}
