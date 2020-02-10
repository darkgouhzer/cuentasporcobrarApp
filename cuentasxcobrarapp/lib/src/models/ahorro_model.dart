import 'dart:convert';

AhorroModel ahorroModelFromJson(String str) => AhorroModel.fromJson(json.decode(str));

String ahorroModelToJson(AhorroModel data) => json.encode(data.toJson());

class AhorroModel {
    String id;
    String concepto;
    String fecha;
    double importe;
    String uid;

    AhorroModel({
        this.id,
        this.concepto='',
        this.fecha='',
        this.importe= 0.0,
        this.uid='',
    });

    factory AhorroModel.fromJson(Map<String, dynamic> json) => AhorroModel(
        id: json["id"],
        concepto: json["concepto"],
        fecha: json["fecha"],
        importe: double.tryParse(json["importe"].toString()),
        uid: json["uid"],
    );

    Map<String, dynamic> toJson() => {
       // "id": id,
        "concepto": concepto,
        "fecha": fecha,
        "importe": importe,
        "uid": uid,
    };
}