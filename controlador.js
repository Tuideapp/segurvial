
$(document).ready(function(){

	//Controlador de Handlebars
	var MisPantillas = 	Handlebars.compile(
								$("#AreaHandleBars").html()
							);

	//Conexion con FIREBASE
	var Obj=new Firebase("https://segurvial.firebaseio.com");	
	ConsultarDatosFirebase(Obj);	

	/*******************************************************/
	/* INSERCIÓN Y CONSULTA DEL DATO
	/*******************************************************/
	$("#Adjuntar").click(function(obj){

		//Identificar si se repite un nodo para cambiarlo
		Obj.once("value", function(todos) {

			if (todos.numChildren() == 0){

				Obj.push({ 
	    			'codigo': Math.floor((Math.random() * 1000) + 1),
	    		 	'mensaje': $("#TextoAdjuntar").val()
	    		});
			}else{
				var aux = 0;
		  		todos.forEach(function(uno) {

			  		if(uno.val().codigo == $("#valoropcion").val() && $("input[type=radio]").is(':checked')) {
			  			
			  			//alert('codigo fire: '+uno.val().codigo+" opcion: "+$(".opcion").val())

			  			var url = new Firebase('https://segurvial.firebaseio.com/'+uno.key());

		  				url.update({
		  					mensaje: $("#TextoAdjuntar").val()}
		  				);
		  				aux = 1;
			  		}		

				});

				if(aux == 0){

		  			//Inserta
		  			Obj.push({ 
		    			'codigo': Math.floor((Math.random() * 1000) + 1),
		    		 	'mensaje': $("#TextoAdjuntar").val()
		    		});
		  		};
			};

			$("#TextoAdjuntar").focus(function(){
				this.value= "";
			});

			ConsultarDatosFirebase(obj);
		});
		//$("#TextoAdjuntar").val().empty();
	});

	/*******************************************************/
	/* MODIFICACÓN DEL DATO
	/*******************************************************/
	$(document).on("click", "input[type=radio]", function(){
		$("#TextoAdjuntar").empty();
		$("#TextoAdjuntar").focus();
		$("#valoropcion").val($(this).val());
	});

	/*******************************************************/
	/* ELIMINACIÓN DEL DATO
	/*******************************************************/
	$("#Eliminar").click(function(obj){

		if(!$("input[type=radio]").is(':checked')){
				alert("Debes seleccionar una opcion.");	
		}else{

			var confirmacionusuario = confirm("De verdad deseas eliminar esta nota?");
			if (confirmacionusuario == true) {
				Obj.once("value", function(todos) {
					todos.forEach(function(uno) {

						if(uno.val().codigo == $("#valoropcion").val()) {

							var re = new Firebase('https://segurvial.firebaseio.com/'+uno.key());
							re.remove();

							ConsultarDatosFirebase(obj);
				  		}
					});
				});
			};

			
		}
	});

	/*******************************************************/
	/* FUNCIONES
	/*******************************************************/
	function ConsultarDatosFirebase(obj){
			$("#Area").empty();
		Obj.once("value", function(todos) {

			if (todos.numChildren() != 0){
		  		todos.forEach(function(uno) {
					var o = {
								codigo:uno.val().codigo,
								mensaje:uno.val().mensaje
							}

					$("#Area").append(MisPantillas(o));
				});
	  		}
		});
	}
});
