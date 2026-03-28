using cadmateriais from '../db/schema';

service CadMat {
    entity Materiais as projection on cadmateriais.Materiais;

    function filtroMateriais(QTD : Integer) returns array of Materiais;
        
    }