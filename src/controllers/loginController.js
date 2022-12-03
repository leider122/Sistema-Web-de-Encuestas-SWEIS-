const controller = {};
const bcrypt = require('bcryptjs');
var transport = require('../email/mailer.js');


controller.mostrar =  (req, res) => {
  //  var autenticado=req.isAuthenticated()
    //if(autenticado){
        
        req.getConnection((error, conn) =>{
            conn.query('', (err, rows) =>{
                    res.render('index', {
                        Message:req.flash('auth')
                    })
            })
        })
//}else{
  //      res.redirect('/')
//}
    
};

controller.nc =  (req, res) => {
    const data = req.body;
    let contrasenia = generarContraseña(data.correo);
    let contra = encriptar(contrasenia);
    //console.log(data.correo);
          req.getConnection((error, conn) =>{
            conn.query('Select correo_electronico from encuestado', (err, correos) =>{
                if(estaEncuestado(data.correo,correos)){
                    conn.query('UPDATE encuestado SET contrasena="'+contra+'" WHERE correo_electronico="'+data.correo+'"', (err, rows) =>{
                        console.log(generarinfocorreos(data.correo,contrasenia));
                    })
                //console.log("esta")
                }else{
                //console.log("no esta")
                }
            })
              
              res.render('enviocontraseña')
          })
      
};

controller.cc =  (req, res) => {
    var autenticado=req.isAuthenticated()
    if(autenticado){
    console.log("cambiando contraseña")
    let email=req.user.email;
    const data = req.body;
    let contra = encriptar(data.contrasenia);
    //console.log(data.contrasenia);
          req.getConnection((error, conn) =>{
                conn.query('UPDATE encuestado SET contrasena="'+contra+'" WHERE correo_electronico="'+email+'"', (err, rows) =>{
                    console.log(generarinfocorreos(email,data.contrasenia));
                })
                req.flash('inic','Se ha cambiado exitosamente la contraseña')
                console.log('este es el email: '+email)
                console.log("volviendo al inicio")
                conn.query('SELECT rol from encuestado where correo_electronico="'+email+'"', (err, rows) =>{
                    if(rows[0].rol==1)
                        res.redirect('/sesionad2')
                    else
                        res.redirect('/sesionen2')
                })
                
          })
    }else{
        res.redirect('/')
    }
};

controller.hcc =  (req, res) => {
    var autenticado=req.isAuthenticated()
    if(autenticado){ 
    let email=req.user.email;
          req.getConnection((error, conn) =>{
            console.log("mostrar vista de contraseña")
                res.render('cambiarcontrasenia',{
                    email:email
                })
          })
    }else{
        res.redirect('/')
    }
};

async function generarinfocorreos(correo,contrasenia){
    //console.log(correo)
    //console.log(contrasenia)
    let info=await transport.sendMail({
        from: '"SWEIS UFPS 📝📈📋" <sweisufps@gmail.com>', // sender address
        to: correo, // list of receivers
        subject: "Cambio de Contraseña", // Subject line
        text: "Hola, se ha cambiado la contraseña en el Sistema Web de Encuesta de Ingenieria de Sistemas - SWEIS, tus nuevas credenciales son: \n correo: "+correo+"\n contraseña: "+contrasenia, // plain text body
        html: "<img src='https://i.ibb.co/bQKsXBX/banner.png' alt='logo'><p>Hola, se ha cambiado la contraseña en el Sistema Web de Encuesta de Ingenieria de Sistemas - <b>SWEIS UFPS<b></p> <br> <p><a href='https://crafty-biplane-368819.uc.r.appspot.com/'>Ingresa aquí</a> con las nuevas credenciales y verificar si tienes encuestas por llenar:</p> <br> <b>correo:</b> "+correo+"<br> <b>contraseña:</b> "+contrasenia, // html body
      });
      return info
    //leideryesidmm@ufps.edu.co,jheyneralexanderld@ufps.edu.co,matildealexandraal@ufps.edu.co
}

function generarContraseña(correo){
    const caracteres=4;
    let contrasenia = ""
    for(let i=0;i<caracteres;i++){
        contrasenia+=correo[Math.floor(Math.random()*correo.length)]+Math.floor(Math.random()*9)
    }
    return contrasenia;
}
function encriptar(contrasenia){
    var salt=bcrypt.genSaltSync(12);
    var password=bcrypt.hashSync(contrasenia,salt)
    return password;
}

function estaEncuestado(correo,correos){
    let esta=false
    for(let i=0;i<correos.length;i++){
        if(correos[i].correo_electronico==correo){
            esta=true
        }
    }
    return esta
}

controller.out =  (req, res) => {
    var autenticado=req.isAuthenticated()
    if(autenticado){
        req.logout(req.user, err => {
        if(err) 
        res.redirect("/");
      });
    }
        res.redirect('/')
};

controller.olv =  (req, res) => {
    res.render('olvidocontraseña');
};

controller.se =  (req, res) => {
    //
    var autenticado=req.isAuthenticated()
    try {
        var type=req.user.type;
    } catch (error) {
        res.redirect('/')
    }
    
    if(autenticado&&type==1){
       
        console.log(req.user)
//            const data = req.body;
        req.getConnection((error, conn) =>{
//            conn.query('Select * from administrador', (err, rows) =>{
    
//            if(data.correo.toString()==rows[0].correo&&data.contrasena.toString()==rows[0].contrasena4){
                    conn.query('SELECT * FROM encuesta order by id_encuesta', (err, rows) =>{
                        conn.query('SELECT e.id_encuesta, COUNT(ec.id_encuesta) as "cantidad" from encuesta e left join encuesta_contestada ec on ec.id_encuesta=e.id_encuesta GROUP by e.id_encuesta order by e.id_encuesta', (err, cantr) =>{
                            conn.query('SELECT e.id_encuesta,p.id_poblacion,count(ep.id_encuestado_poblacion) as "cantidad" from encuesta e join poblacion p on p.id_poblacion=e.población join encuestado_poblacion ep on p.id_poblacion=ep.id_poblacion group by e.id_encuesta', (err, cantp) =>{
                            //let Evalidas=encuestavalida(cantp,cantr);


                        if (err) {
                            res.json(err);
                        } else {
                            res.render('inicio', {
                                encuestas:rows,
                                email: req.user.email,
                                cantr:cantr,
                                cantp:cantp,
                                menssge:req.flash('inicio')
                            })
                            
                        }
                    })
                    })
                    })
//                }else{
//                  res.render('index', {
//                   })
//                }
                    
//            })
        })
        
        
}else{
        if(autenticado)
           req.flash('auth','Tipo de usuario incorrecto, ingrese como encuestado')
        res.redirect('/')
}
    
};

controller.activas =  (req, res) => {
    //
    var autenticado=req.isAuthenticated()
    
    
       if(autenticado){
        console.log(req.user)
//            const data = req.body;
        req.getConnection((error, conn) =>{
//            conn.query('Select * from administrador', (err, rows) =>{
    
//            if(data.correo.toString()==rows[0].correo&&data.contrasena.toString()==rows[0].contrasena4){
                    conn.query('SELECT * FROM encuesta where fecha_cierre>="'+getFechaHoy()+'" order by id_encuesta', (err, rows) =>{
                        conn.query('SELECT e.id_encuesta, COUNT(ec.id_encuesta) as "cantidad" from encuesta e left join encuesta_contestada ec on ec.id_encuesta=e.id_encuesta where fecha_cierre>="'+getFechaHoy()+'" GROUP by e.id_encuesta order by e.id_encuesta', (err, cantr) =>{
                            conn.query('SELECT e.id_encuesta,p.id_poblacion,count(ep.id_encuestado_poblacion) as "cantidad" from encuesta e join poblacion p on p.id_poblacion=e.población join encuestado_poblacion ep on p.id_poblacion=ep.id_poblacion where fecha_cierre>="'+getFechaHoy()+'" group by e.id_encuesta', (err, cantp) =>{
                            //let Evalidas=encuestavalida(cantp,cantr);


                        if (err) {
                            res.json(err);
                        } else {
                            res.render('inicio', {
                                encuestas:rows,
                                email: req.user.email,
                                cantr:cantr,
                                cantp:cantp,
                                menssge:req.flash('inicio')
                            })
                            
                        }
                    })
                    })
                    })
//                }else{
//                  res.render('index', {
//                   })
//                }
                    
//            })
        })}else{
            res.redirect('/')
            
        }
        
        

    
};

controller.finalizadas =  (req, res) => {
    //
    var autenticado=req.isAuthenticated()
    
       if(autenticado){
        console.log(req.user)
//            const data = req.body;
        req.getConnection((error, conn) =>{
//            conn.query('Select * from administrador', (err, rows) =>{
    
//            if(data.correo.toString()==rows[0].correo&&data.contrasena.toString()==rows[0].contrasena4){
                    conn.query('SELECT * FROM encuesta where fecha_cierre<"'+getFechaHoy()+'" order by id_encuesta', (err, rows) =>{
                        conn.query('SELECT e.id_encuesta, COUNT(ec.id_encuesta) as "cantidad" from encuesta e left join encuesta_contestada ec on ec.id_encuesta=e.id_encuesta where fecha_cierre<"'+getFechaHoy()+'" GROUP by e.id_encuesta order by e.id_encuesta', (err, cantr) =>{
                            conn.query('SELECT e.id_encuesta,p.id_poblacion,count(ep.id_encuestado_poblacion) as "cantidad" from encuesta e join poblacion p on p.id_poblacion=e.población join encuestado_poblacion ep on p.id_poblacion=ep.id_poblacion where fecha_cierre<"'+getFechaHoy()+'" group by e.id_encuesta', (err, cantp) =>{
                            //let Evalidas=encuestavalida(cantp,cantr);


                        if (err) {
                            res.json(err);
                        } else {
                            res.render('inicio', {
                                encuestas:rows,
                                email: req.user.email,
                                cantr:cantr,
                                cantp:cantp,
                                menssge:req.flash('inicio')
                            })
                            
                        }
                    })
                    })
                    })
//                }else{
//                  res.render('index', {
//                   })
//                }
                    
//            })
        })
    }else{
        res.redirect('/')
        
    }
        

    
};

controller.programadas =  (req, res) => {
    //
    var autenticado=req.isAuthenticated()
    
       if(autenticado){
        console.log(req.user)
//            const data = req.body;
        req.getConnection((error, conn) =>{
//            conn.query('Select * from administrador', (err, rows) =>{
    
//            if(data.correo.toString()==rows[0].correo&&data.contrasena.toString()==rows[0].contrasena4){
                    conn.query('SELECT * FROM encuesta where fecha_publicacion>"'+getFechaHoy()+'" order by id_encuesta', (err, rows) =>{
                        conn.query('SELECT e.id_encuesta, COUNT(ec.id_encuesta) as "cantidad" from encuesta e left join encuesta_contestada ec on ec.id_encuesta=e.id_encuesta where fecha_publicacion>"'+getFechaHoy()+'" GROUP by e.id_encuesta order by e.id_encuesta', (err, cantr) =>{
                            conn.query('SELECT e.id_encuesta,p.id_poblacion,count(ep.id_encuestado_poblacion) as "cantidad" from encuesta e join poblacion p on p.id_poblacion=e.población join encuestado_poblacion ep on p.id_poblacion=ep.id_poblacion where fecha_publicacion>"'+getFechaHoy()+'" group by e.id_encuesta', (err, cantp) =>{
                            //let Evalidas=encuestavalida(cantp,cantr);


                        if (err) {
                            res.json(err);
                        } else {
                            res.render('inicio', {
                                encuestas:rows,
                                email: req.user.email,
                                cantr:cantr,
                                cantp:cantp,
                                menssge:req.flash('inicio')
                            })
                            
                        }
                    })
                    })
                    })
//                }else{
//                  res.render('index', {
//                   })
//                }
                    
//            })
        })
    }else{
        res.redirect('/')
        
    }
        

    
};

function encuestavalida(encuestas) {
    
}

controller.se2 =  (req, res) => {
    var autenticado=req.isAuthenticated()
    try {
        var type=req.user.type;
    } catch (error) {
        res.redirect('/')
    }

    if(autenticado&&type==0){

    var email=req.user.email
    //console.log(email)
    const data = req.body;
    var paso=false;
    req.getConnection((error, conn) =>{
    conn.query('Select * from encuestado', (err, resul) =>{
        for(let c =0; c<resul.length;c++){
            //if(data.correo.toString()==resul[c].correo_electronico&&data.contrasena.toString()==resul[c].contrasena){
            paso=true;
                conn.query('SELECT ep.id_poblacion FROM encuestado e join encuestado_poblacion ep on e.correo_electronico=ep.encuestado where e.correo_electronico="'+email+'"', (err, rows) =>{
                        var s='';
                        //console.log(rows)
                    for(let i =0; i<rows.length;i++){
                        if(i+1==rows.length){
                            s+='"'+rows[i].id_poblacion+'"';
                        }else{
                            s+='"'+rows[i].id_poblacion+'" or población=';
                        }
                    }
                   // console.log(s)
                    conn.query('Select * from (SELECT * from encuesta where población='+s+') z where z.id_encuesta not in (SELECT ec.id_encuesta as id_encuesta from encuesta_contestada ec where ec.encuestado="'+email+'") and z.id_encuesta in (SELECT id_encuesta from encuesta where fecha_cierre >="'+getFechaHoy()+'"and fecha_publicacion <="'+getFechaHoy()+'")', (err, enc) =>{
                        
                        if (err) {
                            res.json(err);
                        } else {
                                res.render('encuestasasignadas', {
                                    encuestas: enc,
                                    correo:email,
                                    autenticado:autenticado
                                })
                               
                        } 
                    })
                    
                    
                    
                })
                break;
  //        }else{
    //      if(c+1==resul.length){
        //    res.render('index', {
      //      })
      //    }}

        }
        
        
        })
    });}else{
        if(autenticado)
           req.flash('auth','Tipo de usuario incorrecto, ingrese como administrador')
        res.redirect('/')
    }
};

controller.ini =  (req, res) => {
    console.log("estamos en el controlador inicio")
    var autenticado=req.isAuthenticated()
    if(autenticado){
        let email=req.user.email;
        console.log('este es el email 2: '+email)
        req.getConnection((error, conn) =>{
            conn.query('SELECT * FROM encuesta', (err, rows) =>{
                if (err) {
                    res.json(err);
                } else {
                    console.log('este es el email 3: '+email)
                    console.log("vamos a renderizar la pagina de inicio")
                        res.render('inicio', {
                            encuestas:rows,
                            email:email,
                            menssage:req.flash('inicio')
                        })
                    
                    
                }
            })
        })
}else{
        res.redirect('/')
}
    
};

function getFechaHoy(){
    var now = new Date();

    var day = ("0" + now.getDate()).slice(-2);
    var month = ("0" + (now.getMonth() + 1)).slice(-2);

    var today = now.getFullYear()+"-"+(month)+"-"+(day) ;


    return today
}

controller.verificar = (req, res) => {
    const data = req.body;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM administrador', (err, rows) =>{
            
            res.redirect('/');
        })
    })
}

controller.edit = (req, res) =>{
    var autenticado=req.isAuthenticated()
    if(autenticado){
        const {id} = req.params;
        req.getConnection((err, conn) =>{
            conn.query('SELECT * FROM usuario WHERE id_Usuario = ?', [id], (err, rows) =>{
                
                res.render('users_edit', {
                    data: rows[0]
                });
            });
        });
}else{
        res.redirect('/')
}
    
}

controller.update = (req, res) =>{
    var autenticado=req.isAuthenticated()
    if(autenticado){
        const {id} = req.params;
        const newData = req.body;
        req.getConnection((err, conn) =>{
            conn.query('UPDATE usuario set ? WHERE id_Usuario = ?', [newData, id], (err, rows) =>{
                res.redirect('/');
            })
        });
}else{
        res.redirect('/')
}
   
}

controller.delete = (req, res) => {
    var autenticado=req.isAuthenticated()
    if(autenticado){
        req.getConnection((err, conn) => {
            const {id} = req.params;
            conn.query('DELETE FROM usuario WHERE id_Usuario = ?', [id], (err, rows) =>{
                res.redirect('/');
            })
        })
}else{
        res.redirect('/')
}
    
}

module.exports = controller;