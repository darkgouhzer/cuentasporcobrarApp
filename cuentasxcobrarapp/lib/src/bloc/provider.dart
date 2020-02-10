import 'package:cuentasxcobrarapp/src/bloc/ahorro_bloc.dart';
import 'package:flutter/material.dart';

class Provider extends InheritedWidget{

  //final loginBloc = new LoginBloc();
  final _ahorrosBloc = new AhorrosBloc();

  static Provider _instancia;

  factory Provider({ Key key, Widget child}){
    if( _instancia ==null ){
      _instancia = new Provider._internal(key: key, child: child);
    }

    return _instancia;
  }

   Provider._internal({ Key key, Widget child})
     : super(key: key, child: child);

  

  @override
  bool updateShouldNotify(InheritedWidget oldWidget) => true;

  // static LoginBloc of ( BuildContext context ){
  //   return context.dependOnInheritedWidgetOfExactType<Provider>().loginBloc;
  // }

  static AhorrosBloc ahorrosBloc ( BuildContext context ){
    return context.dependOnInheritedWidgetOfExactType<Provider>()._ahorrosBloc;
  }

}