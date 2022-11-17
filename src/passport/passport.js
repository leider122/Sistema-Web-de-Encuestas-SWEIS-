const LocalStrategy = require('passport-local').Strategy;
var mysql= require('mysql');
var bcrypt= require('bcryptjs')

module.exports = function(passport){
    passport.serializeUser(function(user,done){
        done(null,user);
    });
    passport.deserializeUser(function(obj,done){
        done(null,obj);
    });
    passport.use(new LocalStrategy({
        passReqToCallback:true
    },function(req,email,password,done){
        var config = {
            host: '34.28.95.115',
            user: 'root',
            password: 'sweis2022ufps',
            port: 3306,
            database: 'sweis'
        };
        var bd=mysql.createConnection(config)
        bd.connect();
        bd.query('SELECT * FROM encuestado WHERE correo_electronico= ?', email,function(err, rows,fields){
            if(err) throw err;
            bd.end();
            
            if(rows.length>0){
                var user =rows[0]
                console.log(bcrypt.compareSync(password,user.contrasena))
                if(bcrypt.compareSync(password,user.contrasena)){
                    return done(null,{
                        email:user.correo_electronico,
                        type:user.Rol
                    },req.flash('auth','Email o Password incorrectos'));
                }
                return done(null,false,req.flash('auth','Email o Password incorrectos'))
            }
            return done(null,false,req.flash('auth','Email o Password incorrectos'));
        })
        
    }))
};