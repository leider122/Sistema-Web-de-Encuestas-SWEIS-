function agregarresp(y){
    let x=document.getElementById(y+"").value
    let cantidad=parseInt(document.getElementById("cantidad").value)
    cantidad-=1;
    let cont=`<input name="cantidadesopciones" type="hidden" value="`+x+`"></div>`
    if(x<=0){
        cont+="<div class='col' id='error' ><label class='text-center mt-4 mb-4 ml-4'>" +
        "El numero digitado no es valido</label></div>";
        }
        else{
          for(var i=1;i<=x;i++){
            cont+=`<br><div class='form-check form-check' style='margin-left:20px'><input class="form-check-input" type="radio" name="respuesta" id="inlineRadio1" value="option1">
            <input name="pregunta`+cantidad+`" class="form-check-label" for="inlineRadio1" placeholder="Ingrese respuesta"></div>`
          }
        }


    document.getElementById("resp"+y).innerHTML = cont;
}

function agregarresp2(y){
    let x=document.getElementById(y+"").value
    let cantidad=parseInt(document.getElementById("cantidad").value)
    cantidad-=1;
    let cont=`<input name="cantidadesopciones" type="hidden" value="`+x+`"></div>`
    if(x<=0){
        cont+="<div class='col' id='error' ><label class='text-center mt-4 mb-4 ml-4'>" +
        "El numero digitado no es valido</label></div>";
        }
        else{
          for(var i=1;i<=x;i++){
            cont+=`<br><div class="form-check form-check" style="margin-left:20px">
                  <input class="form-check-input" type="checkbox" name="inlineRadioOptions" id="inlineRadio1" value="option1">
                  <input name="pregunta`+cantidad+`" class="form-check-label" for="inlineCheck1" placeholder="Ingrese respuesta">
            </div>`
          }
        }


    document.getElementById("resp"+y).innerHTML = cont;
				
}

function agregarpregunta(){
    let z=document.getElementById("tipo").value
    let x=encontrarultimoid();
    let cantidad=parseInt(document.getElementById("cantidad").value)
    document.getElementById("cantidad").value=cantidad+1;

    let cont=""
    if(z==1){
    cont+=`<br><div name="preguntaU" class="form-group">
    <input name="cantidadpreguntas" type="hidden" value="`+x+`"></div>
			<div id="contenido4">
				<div class="row" style="margin-top: 5px;">
					<div class="col-md-9">
				<input name="pregunta`+cantidad+`" type="text" placeholder="Formule la pregunta" class="confondo" style="-webkit-border-radius:12px;	-moz-border-radius:5px;border-radius:5px; width: 400px; border-bottom:#FFFFFF; border-top: #FFFFFF; border-right:#FFFFFF ; border-left:#FFFFFF;background-color: #FFFFFF; margin-left:20px" required>
				<input name="pregunta`+cantidad+`" type="hidden" value="1">	
                </div>
					
				</div>
			</div><br>
			<div>
				<label>Digite cantidad de respuestas</label>
				<input type="number" id="`+x+`" min="2" max="10">
				<button type="button" class="btn btn-primary" onclick=agregarresp(`+x+`) id="agregar">Agregar Respuestas</button>
			</div>
			<div id="contenido5"><div id="resp`+x+`"></div>
			</div>
		</div>`
    } else if(z==2){
        cont+=`<br><div id="preguntam">
        <input name="cantidadpreguntas" type="hidden" value="`+x+`"></div>
		<div id="contenido4">
			<div class="row" style="margin-top: 5px;">
				<div class="col-md-1">
				<input name="pregunta`+cantidad+`" type="text" placeholder="Formule la pregunta" class="confondo" style="-webkit-border-radius:12px;	-moz-border-radius:5px;border-radius:5px; width: 400px; border-bottom:#FFFFFF; border-top: #FFFFFF; border-right:#FFFFFF ; border-left:#FFFFFF;background-color: #FFFFFF; margin-left:20px" required>
				<input name="pregunta`+cantidad+`" type="hidden" value="2">
                </div>
			</div>
		</div>

		<br>
				<label>Digite cantidad de respuestas</label>
				<input type="number" id="`+x+`" min="2" max="10">
				<button type="button" class="btn btn-primary" onclick=agregarresp2(`+x+`) id="agregar">Agregar Respuestas</button>
			
			<div id="contenido5"><div id="resp`+x+`"></div></div>
			

	</div>`
    }else if(z==3){
        cont+=`<br>
<div id="preguntaA">
<input name="cantidadpreguntas" type="hidden" value="`+x+`"></div>
	<div id="contenido4">
		<div class="row" style="margin-top: 5px;">
			<div class="col-md-1">
				<input name="pregunta`+cantidad+`" type="text" placeholder="Formule la pregunta" class="confondo" style="width: 400px; border-bottom:#FFFFFF; border-top: #FFFFFF; border-right:#FFFFFF ; border-left:#FFFFFF;background-color: #ffffff; margin-left:20px" required>
                <input name="pregunta`+cantidad+`" type="hidden" value="3">
			</div>
		</div>
		<br>
	    <div id="contenido5"><textarea style="margin-left: 70px; resize: none; " name="`+x+`" rows="4" cols="100"></textarea></div>
	</div>
</div><br><br><br><br><br>
<div id="contenido5"><div id="resp`+x+`"></div></div>`

    }
  
    let y=x+1;	
    cont+=`<div id="preg`+y+`"></div>`
    document.getElementById("preg"+x).innerHTML=cont    
}

function encontrarultimoid(){
    let x=document.getElementById("resp"+1);
    let y=1;    
    for(let i=2;x!=null;++i){
            y=i;
            if(x==null){
                return i-1;
            }else{x=document.getElementById("resp"+i);}
        }return y;
}
function formatoFecha(fecha, formato) {
    const map = {
        dd: fecha.getDate(),
        mm: fecha.getMonth() + 1,
        yy: fecha.getFullYear().toString().slice(-2),
        yyyy: fecha.getFullYear()
    }

    return formato.replace(/dd|mm|yy|yyy/gi, matched => map[matched])
}

function getFechaHoy(){
    var now = new Date();

    var day = ("0" + now.getDate()).slice(-2);
    var month = ("0" + (now.getMonth() + 1)).slice(-2);

    var today = now.getFullYear()+"-"+(month)+"-"+(day) ;
    return today;
}
