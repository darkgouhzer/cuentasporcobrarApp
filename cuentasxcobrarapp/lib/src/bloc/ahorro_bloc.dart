import 'package:cuentasxcobrarapp/src/models/ahorro_model.dart';
import 'package:cuentasxcobrarapp/src/providers/ahorros_provider.dart';
import 'package:rxdart/rxdart.dart';

class AhorrosBloc{

  final _ahorrosController = new BehaviorSubject<List<AhorroModel>>();
  final _cargandoController = new BehaviorSubject<bool>();

  final _ahorrosProvider = new AhorrosProvider();

  Stream<List<AhorroModel>> get ahorrosStream => _ahorrosController.stream;
  Stream<bool> get cargando => _cargandoController.stream;

  void cargarAhorros()async{

    final ahorros =await _ahorrosProvider.cargarAhorros();
    _ahorrosController.sink.add(ahorros);
  }
  // void agregarProducto(AhorroModel ahorro)async{
  //   _cargandoController.sink.add(true);
  //   await _ahorrosController.crearAhorro(ahorro);
  //   _cargandoController.sink.add(false);

  // }

  // Future<String> subirFoto(File foto)async{
  //   _cargandoController.sink.add(true);
  //   final fotoUrl = await _productosProvider.subirImagen(foto);
  //   _cargandoController.sink.add(false);
  //   return fotoUrl;
  // }

  void editarProducto(AhorroModel ahorro)async{
    _cargandoController.sink.add(true);
    await _ahorrosProvider.editarAhorro(ahorro);
    _cargandoController.sink.add(false);

  }

  void borrarProducto(String id)async{
    //await _ahorrosProvider.borrarProducto(id);
  }


  dispose(){
    _ahorrosController?.close();
    _cargandoController?.close();
  }
}