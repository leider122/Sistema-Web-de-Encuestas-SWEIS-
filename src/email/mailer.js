const nodemailer = require('nodemailer');
const { google } = require("googleapis");
const clienteid="473269953463-qiilb4hs18i5ap5kelq6g3er358schet.apps.googleusercontent.com";
const clientSecret="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";
const refreshToken="1//04OazaBiwoMhYCgYIARAAGAQSNwF-L9IrEKR4WkPftdTAs3PA7sHBI83WoKY78ixehDm4GqPgCngjnQwgQ-OC5KUBKn49A5hd8G0";
const redirectURI="https://developers.google.com/oauthplayground";

const OAuth2client= new google.auth.OAuth2(
  clienteid,
  clientSecret,
  redirectURI
);

OAuth2client.setCredentials({refresh_token:refreshToken})


const accessToken=getOAuth();
//console.log("gb c")
//console.log(accessToken)
async function getOAuth(){
  return await OAuth2client.getAccessToken();
}
const accountTransport = {
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: "sweisufps@gmail.com",
    pass: "onceefzfuyushyxf",
    clientId: clienteid,
    clientSecret: clientSecret,
    refreshToken: refreshToken,
    accessToken: accessToken,
  },
  tls : { rejectUnauthorized: false }
} 
const transport=nodemailer.createTransport(accountTransport);

//console.log(transport)
/*async function dsendMail(transport){
  try{
    const d=await transport.sendMail({
      from: '"SWEIS UFPS 🪓🔫🔪💉" <sweisufps@gmail.com>', // sender address
      to: "leideryesidmm@gmail.com", // list of receivers
      subject: "Encuesta por responder", // Subject line
      text: "Hola tu correo ha sido registrado al Sistema Web de Encuesta de Ingenieria de Sistemas - SWEIS, ingresa con las siguientes credenciales para verificar si tienes encuestas por llenar: \n correo: "+"leideryesidmm@ufps.edu.co"+"\n contraseña: "+"ef efv", // plain text body
      html: "<a href:'http://localhost:3000/'>Ingresar aquí</a>", // html body
    });
    //console.log("cd")
  }catch(err){
    //console.log(err)
  }

}

try{
  dsendMail(transport);
}catch(err){
  console.log(err)
}*/

  //{
  //  host: "smtp.gmail.com",
  //  port: 587,// true for 465, false for other ports
  //  auth: {
  //    user: "sweisufps@gmail.com", // generated ethereal user
  //    pass: "onceefzfuyushyxf", // generated ethereal password
  //    //pass: "kjtcpsxtkxvyxsbr"
  //  },
  //});


//id de cliente
//473269953463-qiilb4hs18i5ap5kelq6g3er358schet.apps.googleusercontent.com
//secreto de cliente
//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
//refreisn token
//1//0412-GJVD3hbeCgYIARAAGAQSNwF-L9Ir7xr-UViZKxa8IY-JU_9UUWyhEXFGbUTJor7VS0SWX6QikUaXu7nlWt2F4YKqslIbk4I
  module.exports = transport;