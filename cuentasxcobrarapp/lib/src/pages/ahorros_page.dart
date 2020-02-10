import 'package:cuentasxcobrarapp/src/bloc/ahorro_bloc.dart';
import 'package:cuentasxcobrarapp/src/bloc/provider.dart';
import 'package:cuentasxcobrarapp/src/models/ahorro_model.dart';
import 'package:cuentasxcobrarapp/src/widgets/menu_widget.dart';
import 'package:flutter/material.dart';

class AhorrosPage extends StatelessWidget {

  static final String routeName = 'ahorros';

  @override
  Widget build(BuildContext context) {
    
    final ahorrosBloc = Provider.ahorrosBloc(context);
    ahorrosBloc.cargarAhorros();

    return Scaffold(
      appBar: AppBar(
        title: Text('Cuentas de ahorro'),
        backgroundColor: Color.fromRGBO(0, 1, 70, 1),
      ),
      drawer: MenuPage(),
      body: _crearListado(ahorrosBloc),
      
    );
  }

  Widget _crearListado(AhorrosBloc ahorrosBloc) {

  return StreamBuilder(
    stream: ahorrosBloc.ahorrosStream ,
    builder: (BuildContext context, AsyncSnapshot<List<AhorroModel>> snapshot){
      if( snapshot.hasData ){
        final productos = snapshot.data;
        return ListView.builder(
          itemCount: productos.length,
          itemBuilder: (context, i) => _crearItem( context, ahorrosBloc, productos[i] ),
        );
      }else{
        return Center(child: CircularProgressIndicator(),);
      }
    },
  );
}

Widget _crearItem(BuildContext context, AhorrosBloc ahorrosBloc, AhorroModel ahorro){

    return Dismissible(
        key: UniqueKey(),
        background: Container(
          color: Colors.red,
        ),
        child: Card(
          child: Column(
            children: <Widget>[
            ListTile(
                title: Text('${ ahorro.concepto } - ${ ahorro.importe }'),
                subtitle: Text( ahorro.id ),
                onTap: () {} //=> Navigator.pushNamed(context, 'producto', arguments: producto),
              ),
            ],
          ),
        )
    );
}

}