const controllerEstadisticas = {};
var estadisticas = require('../public/js/estadisticas.js');

controllerEstadisticas.mos = (req, res) => {
    var autenticado=req.isAuthenticated()
    if(autenticado){
        let email=req.user.email;
        const {id} = req.params;
    req.getConnection((err, conn) =>{
        conn.query("SELECT o.id_opcion as id_opcion,e.nombre as nombre, e.objetivo as objetivo, po.nombre as poblacion, e.fecha_creación as fecha_creacion, e.fecha_publicacion as fecha_publicacion, e.fecha_cierre as fecha_cierre, p.id_pregunta as id_pregunta, tp.descripcion as tipo_pregunta, p.descripcion as descripcion_pregunta, p.tipo as tipo, o.descripcion as descripcion_opcion FROM encuesta e join poblacion po on po.id_poblacion=e.población join pregunta p on p.encuesta=e.id_encuesta join opcion o on o.pregunta=p.id_pregunta join tipo_pregunta tp on tp.id_tipo_pregunta=p.tipo where e.id_encuesta=?",[id], (err, opc) =>{  
        conn.query("SELECT e.nombre as nombre, e.objetivo as objetivo, po.nombre as poblacion, e.fecha_creación as fecha_creacion, e.fecha_publicacion as fecha_publicacion, e.fecha_cierre as fecha_cierre, ec.id_resp_enc as id_resp_enc, ec.encuestado as encuestado, pc.id_pregunta_contestada as id_pregunta_contestada, p.id_pregunta as id_pregunta, tp.descripcion as tipo_pregunta, p.descripcion as descripcion_pregunta, p.tipo as tipo, ore.id_opcion_respuesta as id_opcion_respuesta, ore.id_opcion as id_opcion, ore.descripcion_Abierta, o.descripcion as descripcion_opcion FROM encuesta e join encuesta_contestada ec on e.id_encuesta=ec.id_encuesta join poblacion po on po.id_poblacion=e.población join pregunta_contestada pc on ec.id_resp_enc=pc.resp_enc join pregunta p on p.id_pregunta=pc.id_pregunta join opcion_respuesta ore on ore.pregunta_contestada=pc.id_pregunta_contestada left join opcion o on o.id_opcion=ore.id_opcion join tipo_pregunta tp on tp.id_tipo_pregunta=p.tipo where ec.id_encuesta=?",[id], (err, resp) =>{
            let preg=estadisticas.getIdspreguntas(resp)
            let labels=estadisticas.getEtiquetas(opc,preg);
            let cant=estadisticas.getCantresp(resp, preg, opc);
            let abiertas=estadisticas.getAbiertas(preg, resp)
            res.render('estadisticas',{
                resp:resp,
                opc:opc,
                cantidades:cant,
                labels:labels,
                email:email,
                preg:preg,
                abiertas:abiertas,
                config:estadisticas.getConfigs(labels,cant,preg)
            });        
        });
        });    
    });}else{
        res.redirect('/')
}
}
module.exports = controllerEstadisticas;