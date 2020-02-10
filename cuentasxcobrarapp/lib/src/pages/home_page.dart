import 'package:cuentasxcobrarapp/src/widgets/menu_widget.dart';
import 'package:flutter/material.dart';

class HomePage extends StatelessWidget {
  static final String routeName = 'home';
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Cuentas por cobrar'),
        backgroundColor: Color.fromRGBO(0, 1, 70, 1),
      ),
      drawer: MenuPage(),
      body:Row(
        mainAxisAlignment: MainAxisAlignment.center,
       children: <Widget>[
          Column(
            mainAxisAlignment:MainAxisAlignment.center,
            children: <Widget>[
              Center(
                child: Text('Bievenido a tus cuentas', 
                style: TextStyle( fontSize: 25),)
              )
              
            ],
          ),
       ], 
      )
      
    );
  }
}