var estadisticas={};

estadisticas.getIdspreguntas=(datos)=>{
    var preg=[]
    var preg2=[]
    for (let i = 0; i < datos.length; i++) {
        if(!preg.includes(datos[i].id_pregunta)){
            let preg1={}
            preg.push(datos[i].id_pregunta)
            preg1.id_pregunta=datos[i].id_pregunta;
            preg1.descripcion_pregunta=datos[i].descripcion_pregunta
            preg1.tipo=datos[i].tipo_pregunta;
            preg2.push(preg1);
        }
        
    }
    return preg2;
    
}

estadisticas.getAbiertas=(preg, resp)=>{
    let abiertas=[];
    for (let i = 0; i < preg.length; i++) {
        if(preg[i].tipo=="Abierta"){
            let abierta={}
            abierta.id_pregunta=preg[i].id_pregunta;
            let respu=[];
            for (let j = 0; j < resp.length; j++) {
                if(resp[j].id_pregunta==preg[i].id_pregunta){
                    respu.push(resp[j].descripcion_Abierta)
                }
                
            }
            abierta.resp=respu
            abiertas.push(abierta)
        }
        
    } console.log(abiertas)
    return abiertas;
}

estadisticas.getEtiquetas=(opciones, preguntas)=>{
    let etq=[]
    for (let i = 0; i < preguntas.length; i++) {
        let preg={}
        let opc=[]
        let opc1=[]
        for (let j = 0; j < opciones.length; j++) {
            if(preguntas[i].id_pregunta==opciones[j].id_pregunta){
                opc.push({descripcion_opcion:opciones[j].descripcion_opcion})
            }    
        }
        preg.opciones=opc;
        preg.id_pregunta=preguntas[i].id_pregunta;
        etq.push(estadisticas.getFormatearEtiquetas(preg))
    }
    return etq;
}

estadisticas.getFormatearEtiquetas=(preg)=>{
    let labels={}
    let label=[];
    for (let i = 0; i < preg.opciones.length; i++) {
        let s=""+preg.opciones[i].descripcion_opcion;
        label.push(s);
    }
    labels.label=label;
    labels.id_pregunta=preg.id_pregunta;
    return labels;
}

estadisticas.getCantresp=(resp, preg, opc)=>{
    let cantidades=[]
    for (let i = 0; i < preg.length; i++) {
        let pregunta={}
        pregunta.id_pregunta=preg[i].id_pregunta;
        pregunta.cant=estadisticas.getCantrespXPreg(resp, preg[i].id_pregunta, opc);
        cantidades.push(pregunta)
    }
    return cantidades
}
estadisticas.getCantrespXPreg=(resp, preg, opc)=>{
        let cant=[]
        for (let j = 0; j < opc.length; j++) {
            
            if(opc[j].id_pregunta==preg){
                
                let cont=0;
                for(let k = 0; k < resp.length; k++) {
                    if(resp[k].id_opcion==opc[j].id_opcion){
                        cont++;
                    }
                }
                cant.push(cont);
            }
            
            
            
        }
        
    return cant
}


estadisticas.getConfigs=(labels,resp, preg)=>{
    let conf=[]
    for (let i = 0; i < preg.length; i++) {
        let con={};
        con.id_pregunta=preg[i].id_pregunta;
        let config={};
        let data={}
        for (let j = 0; j < labels.length; j++) {
            if(preg[i].id_pregunta==labels[j].id_pregunta)
            data.labels=labels[j].label;
            if(preg[i].id_pregunta==resp[j].id_pregunta){
            data.datasets=[{
                label: '',
                data: resp[j].cant
            }]
            }
            
        }
        config.data=data;
        config.opciones={
            scales: {
              y: {
                beginAtZero: true
              }
            }
          };
        con.config=config;
        conf.push(con);
    }
    
return conf
}

module.exports =estadisticas;