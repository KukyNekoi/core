
$(document).ready(function (){//ACCION CUANDO CARGUE LA PAGINA

  var altura_arr = [];//CREAMOS UN ARREGLO VACIO
  $('.vertical-size-base').each(function(){//RECORREMOS TODOS LOS CONTENEDORES DE LAS IMAGENES, DEBEN TENER LA MISMA CLASE
    var altura = $(this).height(); //LES SACAMOS LA ALTURA
    altura_arr.push(altura);//METEMOS LA ALTURA AL ARREGLO
  });
  // console.log(altura_arr.sort((a, b) => b-a ));
  $('.vertical-size-base').each(function(){//RECORREMOS DE NUEVO LOS CONTENEDORES
    $(this).css('height',altura_arr[0]);//LES PONEMOS A TODOS LOS CONTENEDORES EL PRIMERO ELEMENTO DE ALTURA DEL ARREGLO, QUE ES EL MAS GRANDE.
  });
  $('.vertical-size').each(function(){//RECORREMOS DE NUEVO LOS CONTENEDORES
    $(this).css('height',altura_arr[0]);//LES PONEMOS A TODOS LOS CONTENEDORES EL PRIMERO ELEMENTO DE ALTURA DEL ARREGLO, QUE ES EL MAS GRANDE.
  });
});
