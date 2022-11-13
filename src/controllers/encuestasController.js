const controllerEncuestas = {};
var transport = require('../email/mailer.js');

controllerEncuestas.add = (req, res) => {
    var autenticado=req.isAuthenticated()
    if(autenticado){
        let email=req.user.email;
    req.getConnection((err, conn) =>{  
        conn.query("SELECT * FROM tipo_pregunta", (err, rows) =>{
            conn.query('SELECT * FROM poblacion',(err,po) =>{
                res.render('preguntas',{
                    tipos:rows,
                    poblaciones:po,
                    email:email
                });
            })
            
        });    
    });}else{
        res.redirect('/')
}
}
controllerEncuestas.elim = (req, res) => {
    var autenticado=req.isAuthenticated()
    if(autenticado){ 
    req.getConnection((err, conn) => {
        const {id} = req.params;
        conn.query('DELETE FROM encuesta WHERE id_encuesta = ?', [id], (err, rows) =>{
            res.redirect('/inicio');
        })
    })}else{
        res.redirect('/')
}
}
controllerEncuestas.edit = (req, res) => {
    var autenticado=req.isAuthenticated()
    if(autenticado){ 
    req.getConnection((err, conn) => {
        const {id} = req.params;
        const newData = req.body;
        conn.query('UPDATE encuesta set ? WHERE id_encuesta = ?', [newData,id], (err, rows) =>{
            res.redirect('/inicio');
        })
    })
}else{
    res.redirect('/')
}
}
    


controllerEncuestas.pub = (req, res) => {
    var autenticado=req.isAuthenticated()
    if(autenticado){ 
    var indice=0;
    const data = req.body;
    req.getConnection((err, conn) => {
        conn.query('INSERT INTO encuesta (nombre,objetivo,fecha_creación,fecha_publicacion,fecha_cierre,población) values ("'+data.titulo+'","'+data.descripcion+'","'+data.fecha_hoy+'","'+data.fecha_ini+'","'+data.fecha_fin+'","'+data.poblacion+'")', (errO, rows) =>{})
        
        if(data.cantidadpreguntas.length==1){    
        conn.query('SELECT id_encuesta FROM encuesta WHERE nombre="'+data.titulo+'"', (error, id) =>{
               
                conn.query('INSERT INTO pregunta (descripcion,obligatoriedad,tipo,encuesta) values ("'+data.pregunta+'","'+1+'","'+data.tipo+'","'+id[0].id_encuesta+'")', (err, rows) =>{})
                      conn.query("SELECT id_pregunta FROM pregunta WHERE descripcion='"+data.pregunta+"'", (er, idp) =>{
                        for(let o=0;o<parseInt(data.cantidadesopciones);o++){
                            req.getConnection((err, cox) => {
                            cox.query('INSERT INTO opcion (descripcion,pregunta) values ("'+data.opciones[o]+'","'+idp[0].id_pregunta+'")', (err, rows) =>{
                                
                            
                            })
                            })
                            
                        }if (err) {
                            res.json(err);}
                          else{res.redirect('/sesionad2');}
                    })
                
               })}
                else{for(let i=0;i<data.pregunta.length;++i){
                    
                    conn.query('SELECT id_encuesta FROM encuesta WHERE nombre="'+data.titulo+'"', (error, id) =>{
                    
                    conn.query('INSERT INTO pregunta (descripcion,obligatoriedad,tipo,encuesta) values ("'+data.pregunta[i]+'","'+1+'","'+data.tipo[i]+'","'+id[0].id_encuesta+'")', (err, rows) =>{})
                         
                    conn.query("SELECT id_pregunta FROM pregunta WHERE descripcion='"+data.pregunta[i]+"'", (er, idp) =>{

                        if(parseInt(data.tipo[i])!=3){
                            for(let o=0;o<parseInt(data.cantidadesopciones[i]);++o){
                                    conn.query('INSERT INTO opcion (descripcion,pregunta) values ("'+data.opciones[indice]+'","'+idp[0].id_pregunta+'")', (err, rows) =>{
                                        
                                    })
                                    indice+=1
                                }
                        }
                            
                        })
                    
                    })}if (err) {
                        res.json(err);}
                      else{res.redirect('/inicio');}
            }
                
                
            
        
        conn.query('SELECT * from encuestado_poblacion where id_poblacion='+ data.poblacion, (errO, rows) =>{
            try {
                for (let i = 0; i < rows.length; i++) {
                    generarinfocorreos(rows[i].encuestado);
                }
            } catch (error) {
               // console.log(errO)
            }
            
        })
    })
}else{
    res.redirect('/')
}
}

async function generarinfocorreos(correo){

    var info=await transport.sendMail({
        from: '"SWEIS UFPS 📝📈📋" <sweisufps@gmail.com>', // sender address
        to: correo, // list of receivers
        subject: "Encuesta por responder", // Subject line
        text: "Hola, tu correo ha sido registrado al Sistema Web de Encuesta de Ingenieria de Sistemas - SWEIS, ingresa con las siguientes credenciales para verificar si tienes encuestas por llenar: \n correo: ", // plain text body
        html: "<img src='https://i.ibb.co/bQKsXBX/banner.png' alt='logo'><p>Hola, tienes una encuesta pendiente en Sistema Web de Encuesta de Ingenieria de Sistemas <b>- SWEIS UFPS</b> </p> <p><a href='http://localhost:3000/'>Ingresa aquí</a>  para llenarla</p>" // html body
      });
      console.log(info)
    //leideryesidmm@ufps.edu.co,jheyneralexanderld@ufps.edu.co,matildealexandraal@ufps.edu.co
}
    


controllerEncuestas.ver =  (req, res) => {
    var autenticado=req.isAuthenticated()
    if(autenticado){ 
    let email=req.user.email;
    req.getConnection((error, conn) =>{
        const {id} = req.params;
        conn.query('SELECT e.id_encuesta,e.nombre,e.fecha_cierre,e.fecha_creación,e.fecha_publicacion,e.objetivo,p.nombre as "poblacion" FROM encuesta e join poblacion p on p.id_poblacion=e.población where id_encuesta=?',[id], (err, rows) =>{
            conn.query('SELECT p.id_pregunta,p.descripcion,p.tipo,o.descripcion as "opcion" from pregunta p join opcion o on p.id_pregunta=o.pregunta where p.encuesta=?',[id], (err, opc) =>{
                conn.query('SELECT p.id_pregunta,p.descripcion,p.tipo,t.descripcion as "tipopreg" from pregunta p join tipo_pregunta t on p.tipo=t.id_tipo_pregunta where encuesta=?',[id], (err, preg) =>{
                if (err) {
                res.json(err);
            } else {
                
                    res.render('verencuesta', {
                        encuesta:rows,
                        preguntas:preg,
                        opciones:opc,
                        email:email
                    })
                
            }
        })})
        })
    })
}else{
    res.redirect('/')
}
};

controllerEncuestas.llenar =  (req, res) => {
    var autenticado=req.isAuthenticated()
    if(autenticado){ 
    req.getConnection((error, conn) =>{
        const {id} = req.params;
        conn.query('SELECT e.id_encuesta,e.nombre,e.fecha_cierre,e.fecha_creación,e.fecha_publicacion,e.objetivo,p.nombre as "poblacion" FROM encuesta e join poblacion p on p.id_poblacion=e.población where id_encuesta=?',[id], (err, rows) =>{
            conn.query('SELECT o.id_opcion,p.id_pregunta,p.descripcion,p.tipo,o.descripcion as "opcion" from pregunta p join opcion o on p.id_pregunta=o.pregunta where p.encuesta=?',[id], (err, opc) =>{
                conn.query('SELECT p.id_pregunta,p.descripcion,p.tipo,t.descripcion as "tipopreg" from pregunta p join tipo_pregunta t on p.tipo=t.id_tipo_pregunta where encuesta=?',[id], (err, preg) =>{
                if (err) {
                res.json(err);
            } else {
                
                
                    res.render('responderencuesta', {
                        encuesta:rows,
                        preguntas:preg,
                        opciones:opc,
                        correo:req.user.email
                    }) 
                
            }
        })})
        })
    })
}else{
    res.redirect('/')
}
};

controllerEncuestas.enviar =  (req, res) => {
    var autenticado=req.isAuthenticated()
    if(autenticado){ 
        let email=req.user.email;
    const data = req.body
    req.getConnection((error, conn) =>{
        conn.query('INSERT INTO encuesta_contestada (fecha_contestada,id_encuesta,encuestado) values ("'+data.fecha_hoy+'","'+data.id_encuesta+'","'+email+'")', (err, rows) =>{
            conn.query('SELECT id_resp_enc FROM encuesta_contestada WHERE id_encuesta='+data.id_encuesta+' AND '+'encuestado="'+email+'"', (error, id) =>{
                
                let x=0;
                for(let i=0;i<data.P.length;i=i+3){
                    
                    conn.query('INSERT INTO pregunta_contestada (resp_enc,id_pregunta) values ("'+id[0].id_resp_enc+'","'+data.P[i]+'")', (err, rows) =>{
                        
                        conn.query('SELECT id_pregunta_contestada FROM pregunta_contestada WHERE resp_enc='+id[0].id_resp_enc+' AND id_pregunta='+data.P[i], (error, id2) =>{
                            console.log(data.O)
                            if (err) 
                            res.json(err);
                                
                                if(data.P[i+1]=='Abierta'){
                                    console.log("es abierta")
                                    conn.query('INSERT INTO opcion_respuesta (pregunta_contestada,descripcion_Abierta) values ("'+id2[0].id_pregunta_contestada+'","'+data.O[x]+'")', (err, rows) =>{
                                        
                                    })
                                    x=x+1;
                                    }else{console.log("no es abierta")
                                    conn.query('INSERT INTO opcion_respuesta (pregunta_contestada,id_opcion) values ("'+id2[0].id_pregunta_contestada+'","'+data.O[x]+'")', (err, rows) =>{
                                        
                                    })
                                    x=x+1;
                                }
                            
                        })
                    })
                    
                }
                for(let i=1;i<data.M.length;i++){
                    conn.query('SELECT pregunta FROM opcion WHERE id_opcion='+data.M[i], (error, id4) =>{
                                conn.query('INSERT INTO pregunta_contestada (resp_enc,id_pregunta,multiple) values ("'+id[0].id_resp_enc+'","'+id4[0].pregunta+'","'+id[0].id_resp_enc+''+id4[0].pregunta+'")', (err, rows) =>{
                                    conn.query('SELECT id_pregunta_contestada FROM pregunta_contestada WHERE resp_enc='+id[0].id_resp_enc+' AND id_pregunta='+id4[0].pregunta, (error, id3) =>{
                                        conn.query('INSERT INTO opcion_respuesta (pregunta_contestada,id_opcion) values ("'+id3[0].id_pregunta_contestada+'","'+data.M[i]+'")', (err, rows) =>{
                                        })
                                    })
                        })
                        

                    })
                }

            })
        })
    })
    res.redirect('/sesionen2');

}else{
    res.redirect('/')
}
};

controllerEncuestas.resp = (req, res) => {
    var autenticado=req.isAuthenticated()
    if(autenticado){ 
        let email=req.user.email;
        req.getConnection((error, conn) =>{
            const {id} = req.params;
            conn.query('SELECT * from encuesta_contestada ec join encuesta e on e.id_encuesta=ec.id_encuesta where e.id_encuesta=?',[id], (err, resp) =>{
                res.render('respuestas',{
                    respuestas:resp,
                    email:email
                })
                //console.log(resp)
            })
        })
    
    }else{
            res.redirect('/')
        }

}

controllerEncuestas.respenc = (req, res) => {
    var autenticado=req.isAuthenticated()
    if(autenticado){ 
        let email=req.user.email;
        req.getConnection((error, conn) =>{
            const {id} = req.params;
            conn.query('SELECT * from encuesta_contestada ec join encuesta e on e.id_encuesta=ec.id_encuesta where ec.id_resp_enc=?',[id], (err, enc) =>{
                conn.query('SELECT * from pregunta_contestada pc join pregunta p on p.id_pregunta=pc.id_pregunta where pc.resp_enc=?',[id], (err, preg) =>{
                    conn.query('SELECT * from pregunta_contestada pc join opcion_respuesta ore on pc.id_pregunta_contestada=ore.pregunta_contestada left join opcion o on o.id_opcion=ore.id_opcion where pc.resp_enc=?',[id], (err, opc) =>{
                        res.render('respuestasencuestado',{
                            encuesta:enc,
                            preguntas:preg,
                            opciones:opc,
                            email:email

                        })
                        //console.log(enc)
                    })
                })
                
            })
        })
    
    }else{
            res.redirect('/')
        }

}


function crear(){
    const formulario = new URLSearchParams('')
    return formulario.get('');
}

module.exports = controllerEncuestas;
` for(let o=0;o<data.i.length;++o){
    conn.query('INSERT INTO opcion (descripcion,pregunta) values ("'+data.i[o]+'","'+idp[0].id_pregunta+'")', (err, rows) =>{
        if (err) {
            res.json(err);}
          else{res.redirect('/inicio');}
    })
}`
