import 'package:cuentasxcobrarapp/src/bloc/provider.dart';
import 'package:cuentasxcobrarapp/src/pages/ahorros_page.dart';
import 'package:cuentasxcobrarapp/src/pages/home_page.dart';
import 'package:cuentasxcobrarapp/src/pages/personas_page.dart';
import 'package:flutter/material.dart';
 
void main() => runApp(MyApp());
 
class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Provider(
      child: MaterialApp(
            debugShowCheckedModeBanner: false,
            title: 'Material App',
            initialRoute: HomePage.routeName,
            routes: {
              HomePage.routeName      : (BuildContext context) => HomePage(),
              PersonasPage.routeName  : (BuildContext context) => PersonasPage(),
              AhorrosPage.routeName   : (BuildContext context) => AhorrosPage()
            },
          )
    );
   
  }
}