const express = require('express');
const path = require('path');
const morgan = require('morgan');
const mysql = require('mysql');
const myConnection = require('express-myconnection');
const app = express();
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser=require('cookie-parser');
const passport=require('passport');

require('./passport/passport')(passport);

// Importing routes
const loginRoutes = require('./routes/login');
const encuestasRoutes = require('./routes/encuesta');
const poblacionRoutes = require('./routes/poblacion');
const inicioRoutes = require('./routes/inicio');
const encasigRoutes = require('./routes/encuestasasignadas');
const estadisticasRoutes = require('./routes/estadisticas');
const { urlencoded } = require('express');

// Settings
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(morgan('dev'));
app.use(myConnection(mysql, {
    host: '34.28.95.115',
    user: 'root',
   //password: 'bX!jPPRPTg32cSYH',
    password: 'sweis2022ufps',   
    port: 3306,
    database: 'sweis'
}, 'single'))
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({
    secret:'lyjymslm3x100pre',
    resave: false,
    saveUninitialized:false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
// Routes
app.use('/', loginRoutes);
app.use('/encuestas', encuestasRoutes);
app.use('/poblacion', poblacionRoutes);
app.use('/inicio', inicioRoutes);
app.use('/encuestas-por-llenar', encasigRoutes);
app.use('/estadisticas', estadisticasRoutes);
// Static Files
app.use(express.static(path.join(__dirname, 'public')))

app.listen(app.get('port'), () => {
    console.log('Server on port ', app.get('port'));
});
