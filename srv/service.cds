using cadmateriais from '../db/schema';

service CadMat {
    entity Materiais as projection on cadmateriais.Materiais;

    function filtroMateriais(QTD : Integer) returns array of Materiais;
        
    action adicionarMaterial(
        ID     : Integer,
        NumMat : Integer,
        Nome   : String(50),
        Descr  : String(80)
  ) returns String;

}