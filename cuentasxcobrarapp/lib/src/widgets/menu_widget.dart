import 'package:cuentasxcobrarapp/src/pages/ahorros_page.dart';
import 'package:cuentasxcobrarapp/src/pages/home_page.dart';
import 'package:cuentasxcobrarapp/src/pages/personas_page.dart';
import 'package:flutter/material.dart';

class MenuPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final textStyle = TextStyle(fontSize: 20, );
 
    return Drawer(
      child:ListView(
          padding: EdgeInsets.zero,
          children: <Widget>[
            DrawerHeader(
              child: Container(),
              decoration:BoxDecoration(
                image: DecorationImage(
                  image: AssetImage('assets/headermenu3.jpg'),
                  fit: BoxFit.cover
                )
              ),
            ),    
            ListTile(
              leading: Icon(Icons.home),
              title: Text('Inicio', style: textStyle,),              
              onTap: () => Navigator.pushReplacementNamed(context, HomePage.routeName),
            ), 
            ListTile(
              leading: Icon(Icons.people),
              title: Text('Personas', style: textStyle,),
              onTap: () => Navigator.pushReplacementNamed(context, PersonasPage.routeName),
            ),
            ListTile(
              leading: Icon(Icons.account_balance_wallet),
              title: Text('Cuentas x cobrar', style: textStyle,),
              onTap: (){},
            ),
            ListTile(
            leading: Icon(Icons.account_balance_wallet),
            title: Text('Ahorros', style: textStyle,),
            subtitle: Text('Control de ahorros'),
            onTap: () => Navigator.pushReplacementNamed(context, AhorrosPage.routeName),
          ),
          ],
        )
    );
  
  }
}