const controller = {};

const bcrypt = require('bcryptjs');
var transport = require('../email/mailer.js');
var SendGrid = require('sendgrid')

controller.list =  (req, res) => {
    var autenticado=req.isAuthenticated()
    console.log(req.user)
    if(autenticado){
        let email=req.user.email;
        req.getConnection((error, conn) =>{
        
            conn.query('SELECT * FROM poblacion', (err, po) =>{
                conn.query('SELECT * FROM poblacion p join encuestado_poblacion ep on p.id_poblacion=ep.id_poblacion', (err, en) =>{
                    
                    res.render('poblacion', {
                        poblaciones:po,
                        encuestados: en,
                        menssage:req.flash('info'),
                        email:email
                    })
            })
        })
            
        })
}else{
        res.redirect('/')
}
    
};
controller.save = (req, res) => {
    var autenticado=req.isAuthenticated()
    if(autenticado){
        let email=req.user.email;
        const data = req.body;
        let correos=data.correos.split(",");
        console.log(data)
        if(correos[0]!=''&&correos[0]!=null){
        let tamanio=correos.length
        console.log("El tamaño es: "+tamanio)
        req.getConnection((err, conn) => {
            conn.query('INSERT INTO poblacion (nombre,tamanio) values ("'+data.nombre+'",'+tamanio+')', (err, rows) =>{
                console.log(err);
                conn.query('SELECT id_poblacion FROM poblacion WHERE nombre="'+data.nombre+'"', (err, id) =>{
                    console.log("")
                    for(let i=0;i<correos.length;++i){
                        let contra1=generarContraseña(correos[i]);
                        let contra=encriptar(contra1);
                        //var contra=encriptar('contraseña');
                        conn.query('INSERT INTO encuestado (correo_electronico,contrasena,Rol) values ("'+correos[i]+'","'+contra+'","0")', [data], (err, rows) =>{
                            //enviar(correos[i])
                            if(!err){
                                generarinfocorreos(correos[i],contra1)
                            }
                        })
                        conn.query('SELECT * FROM encuestado_poblacion', (err, respuesta) =>{
                            if(!estaEncuestado(correos[i], id[0].id_poblacion, respuesta)){
                                

                                conn.query('INSERT INTO encuestado_poblacion (encuestado,id_poblacion) values ("'+correos[i]+'",'+id[0].id_poblacion+')', (err, rows) =>{
                                    if (err) {
                                        res.json(err);}
                                })
                            }
                        })
                        
                    }
                    
    
    
                    if (err) {
                        res.json(err);}
                      else{
                        conn.query('SELECT * FROM poblacion', (err, po) =>{
                            conn.query('SELECT * FROM poblacion p join encuestado_poblacion ep on p.id_poblacion=ep.id_poblacion', (err, en) =>{
                                req.flash('info','Se ha registrado correctamente la poblacion '+data.nombre)
                        res.render('poblacion',{
                            menssage: req.flash('info'),
                            poblaciones:po,
                            encuestados: en,
                            email:email
                        });
                        })
                    })
                        }
                })
            })
        })}else{
            req.getConnection((err, conn) => {
            conn.query('SELECT * FROM poblacion', (err, po) =>{
                conn.query('SELECT * FROM poblacion p join encuestado_poblacion ep on p.id_poblacion=ep.id_poblacion', (err, en) =>{
                    req.flash('info','La poblacion ingresada en '+data.nombre+' esta vacia o no cumple con el formato de comas')
            res.render('poblacion',{
                menssage: req.flash('info'),
                poblaciones:po,
                encuestados: en,
                email:email
            });
            })
        })})
        }
}else{
        res.redirect('/')
}
    
}
function enviar(correo){
var mail = new SendGrid.Email({
    to: correo,
    from: 'sweisufps@gmail.com',
    subject: 'test mail',
    text: 'This is a sample email message.'
});

var sender = new SendGrid.SendGrid('sweisufps@gmail.com','sweisUFPS2022');

sender.smtp(mail, function(success, err){
    if(success) console.log('Email sent');
    else console.log(err);
});


sender.send(mail, function(success, err){
    if(success) console.log('Email sent');
    else console.log(err);
});
}

async function generarinfocorreos(correo,contrasenia){
    await transport.sendMail({
        from: '"SWEIS UFPS 📝📈📋" <sweisufps@gmail.com>', // sender address
        to: correo, // list of receivers
        subject: "Registro SWEIS", // Subject line
        text: "Hola, tu correo ha sido registrado al Sistema Web de Encuesta de Ingenieria de Sistemas - SWEIS, ingresa con las siguientes credenciales para verificar si tienes encuestas por llenar: \n correo: "+correo+"\n contraseña: "+contrasenia, // plain text body
        html: "<img src='https://i.ibb.co/bQKsXBX/banner.png' alt='logo'><p>Hola, tu correo ha sido registrado al Sistema Web de Encuesta de Ingenieria de Sistemas - <b>SWEIS UFPS<b></p> <br> <p><a href='https://crafty-biplane-368819.uc.r.appspot.com/'>Ingresa aquí</a> con las siguientes credenciales para verificar si tienes encuestas por llenar:</p> <br> <b>correo:</b> "+correo+"<br> <b>contraseña:</b> "+contrasenia, // html body
      });
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

function estaEncuestado(correo, poblacion, correos){
    let esta=false
    for(let i=0;i<correos.length;i++){
        if(correos[i].encuestado==correo&&correos[i].id_poblacion==poblacion){
            esta=true
        }
    }
    return esta
}
controller.deleteT = (req, res) => {
    var autenticado=req.isAuthenticated()
    if(autenticado){
        req.getConnection((err, conn) => {
            conn.query('DELETE FROM encuestado_poblacion', (err, rows) =>{})
            conn.query('DELETE FROM poblacion', (err, rows) =>{})
        })
        res.redirect('/poblacion')
    }
}

controller.edit = (req, res) => {
    var autenticado=req.isAuthenticated()
    if(autenticado){
        let email=req.user.email;
    const data = req.body;
    console.log(data)
    let correos=data.correos.replace(/ /g, "").split(",");
    let tamanio=correos.length
    console.log("esto es correos[0]: "+correos.legth)
    if(correos[0]!=''&&correos[0]!=null){
    req.getConnection((err, conn) => {
        conn.query('DELETE FROM encuestado_poblacion WHERE id_poblacion = ?',data.id, (err, rows) =>{
            conn.query('SELECT id_poblacion FROM poblacion WHERE nombre="'+data.nombre+'"', (err, id) =>{
                console.log("este es el id de la poblacion: "+id)
                for(let i=0;i<correos.length;++i){
                    if(correos[i]!=''){
                            let contra1=generarContraseña(correos[i]);
                            let contra=encriptar(contra1);
                            conn.query('INSERT INTO encuestado (correo_electronico,contrasena,Rol) values ("'+correos[i]+'","'+contra+'","0")', (err, rows) =>{
                                if(!err){
                                    generarinfocorreos(correos[i],contra1)
                                }
                               
                            })
                            conn.query('SELECT * FROM encuestado_poblacion', (err, respuesta) =>{
                                console.log(respuesta)
                                if(!estaEncuestado(correos[i], id[0].id_poblacion, respuesta)){
                                    conn.query('INSERT INTO encuestado_poblacion (encuestado,id_poblacion) values ("'+correos[i]+'",'+id[0].id_poblacion+')', (err, rows) =>{
                                        if (err) {
                                            res.json(err);}
                                    })
                                }
                            })
                    }
                }
                


                if (err) {
                    res.json(err);}
                  else{
                    req.flash('info','La poblacion '+data.nombre+' ha sido editada exitosamente')
                    res.redirect('/poblacion');}
            })
        })
    })}else{
        req.getConnection((err, conn) => {
        conn.query('SELECT * FROM poblacion', (err, po) =>{
            conn.query('SELECT * FROM poblacion p join encuestado_poblacion ep on p.id_poblacion=ep.id_poblacion', (err, en) =>{
                req.flash('info','La poblacion ingresada en '+data.nombre+' esta vacia o no cumple con el formato de comas')
        res.render('poblacion',{
            menssage: req.flash('info'),
            poblaciones:po,
            encuestados: en,
            email:email
        });
        })
    })})
    }
}else{
        res.redirect('/')
}
    
}



controller.ini =  (req, res) => {
    var autenticado=req.isAuthenticated()
    if(autenticado){
        const data = req.body;
        req.getConnection((error, conn) =>{
            conn.query('SELECT * FROM administrador', (err, rows) =>{
                if (err) {
                    res.json(err);
                } else {
                    
                        res.render('inicio', {
                            data,
                            administrador:rows
                        })
                }
            })
        })
}else{
        res.redirect('/')
}
    
};

controller.verificar = (req, res) => {
    var autenticado=req.isAuthenticated()
    if(autenticado){
        const data = req.body;
        req.getConnection((err, conn) => {
            conn.query('SELECT * FROM administrador', (err, rows) =>{
                
                res.redirect('/');
            })
        })
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

controller.consulta = (req, res) => {
    var autenticado=req.isAuthenticated()
    if(autenticado){
        req.getConnection((err, conn) => {
            const data = req.body;
            conn.query(data.consulta, (err, rows) =>{
                console.log(rows)
                res.redirect('/sesionad2');
            })
        })
}else{
        res.redirect('/')
}
    
}

module.exports = controller;