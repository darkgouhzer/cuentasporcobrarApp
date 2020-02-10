


import 'dart:convert';

import 'package:cuentasxcobrarapp/src/models/ahorro_model.dart';
import 'package:http/http.dart' as http;

class AhorrosProvider{

  final String _url = 'https://cuentas-y-ahorros.firebaseio.com';


    Future<bool> editarAhorro( AhorroModel ahorro ) async {
    
    final url = '$_url/ahorros/${ ahorro.id }.json';

    final resp = await http.put( url, body: ahorroModelToJson(ahorro) );

    final decodedData = json.decode(resp.body);

    print( decodedData );

    return true;

  }

  Future<List<AhorroModel>> cargarAhorros() async {

    final url  = '$_url/ahorros.json';
    final resp = await http.get(url);

    final Map<String, dynamic> decodedData = json.decode(resp.body);
    final List<AhorroModel> ahorros = new List();


    if ( decodedData == null ) return [];
    
    if ( decodedData['error'] != null ) return [];


    decodedData.forEach( ( id, ahorro ){

      final ahorTemp = AhorroModel.fromJson(ahorro);
      ahorTemp.id = id;

      ahorros.add( ahorTemp );

    });

    // print( productos[0].id );

    return ahorros;

  }

}