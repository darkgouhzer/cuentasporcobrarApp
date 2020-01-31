import 'package:flutter/material.dart';

class HomePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Cuentas por cobrar'),
      ),
      drawer: _crearMenu(),
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

  Drawer _crearMenu() {

    final textStyle = TextStyle(fontSize: 25, );
    
    return Drawer(
      child: SafeArea(
        child:Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Text('Inicio', style: textStyle,),
            Text('Personas', style: textStyle,),
            Text('Cuentas x cobrar', style: textStyle,)
          ],
        )
      ),
    );
  }
}