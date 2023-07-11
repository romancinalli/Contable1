//guardo el tag form en una variable:
let formulario = document.querySelector("form");
// Guardar cada uno de los inputs en sus respectivas variables
let obraSocialInput = document.querySelector("#obraSocial");
let factura = document.querySelector("#numeroFactura");
let mes = document.querySelector("#mes");
let monto = document.querySelector("#monto");
let facturas=document.querySelector(".facturas")
let montoAdeudado= document.querySelector(".montoAdeudado")
//guardo el boton en una variable:
let ingresarBtn = document.querySelector(".enviar-btn");
//PAGOS
let pagoForm = document.querySelector("#formularioPago")
let pago = document.querySelector("#pago");
let botonPago = document.querySelector("#enviar-pago")
let obraSocialPago = document.querySelector("#obraSocialPago")

let facturasIngresadas = []; // Array donde se guardan los objetos instanciados
let deudasGeneradas = [];

recuperarDatosDelLocalStorage()
init()

class Deuda {
  constructor(A, B = [], C = [], D = 0) {
    this.A = A;
    this.B = B;
    this.C = C;
    this.D = D; 
  }
  
  deudaAcumulada(){
    let lista5 = document.createElement("li");
    lista5.textContent = "Obra Social: " + this.A;
    lista5.style.paddingTop = "10px";
    let lista6 = document.createElement("li");
    lista6.textContent = "Factura nro: " + this.B.join(",  ");
    let lista7 = document.createElement("li");
    lista7.textContent = "Mes: " + this.C.join(",  ");
    let lista8 = document.createElement("li");
    lista8.textContent = "Monto adeudado: " + this.D;
    lista8.style.paddingBottom = "1rem";

    montoAdeudado.appendChild(lista5);
    montoAdeudado.appendChild(lista6);
    montoAdeudado.appendChild(lista7);
    montoAdeudado.appendChild(lista8);
    

  }
}

class Facturacion {
  constructor(obraS, factura, mes, monto, pago) {
    this.obraS = obraS;
    this.factura = factura;
    this.mes = mes;
    this.monto = parseInt(monto);
    this.pago = pago;
  }
  
  facturasGuardadas() {
    let lista1 = document.createElement("li");
    lista1.textContent = "Obra Social: " + this.obraS;
    let lista2 = document.createElement("li");
    lista2.textContent = "Factura Nro: " + this.factura;
    let lista3 = document.createElement("li");
    lista3.textContent = "Mes: " + this.mes;
    let lista4 = document.createElement("li");
    lista4.textContent = "Monto: " + this.monto;
    lista4.style.paddingBottom = "1rem";

    facturas.appendChild(lista1);
    facturas.appendChild(lista2);
    facturas.appendChild(lista3);
    facturas.appendChild(lista4);

   
  }
}


let deuda = null;
//aplico evento al boton ingresar:
ingresarBtn.addEventListener("click", function() {
  let obraSocialValue = obraSocialInput.value;
  let facturaValue = factura.value;
  let mesValue = mes.value;
  let montoValue = monto.value;
  let pagoValue = pago.value;

  let nuevaFactura = new Facturacion(obraSocialValue, facturaValue, mesValue, montoValue, pagoValue);
  facturasIngresadas.push(nuevaFactura);

  formulario.reset();

  nuevaFactura.facturasGuardadas();

  const ultimaFactura = facturasIngresadas[facturasIngresadas.length - 1];

  if (facturasIngresadas.length > 1) {
    const facturasPrevias = facturasIngresadas.slice(0, facturasIngresadas.length - 1);
    const acumuladorMonto = facturasPrevias.reduce((total, facturaPrev) => total + facturaPrev.monto, 0);
    const acumuladorFactura = facturasPrevias.map(facturaPrev => facturaPrev.factura);
    const acumuladorMes = facturasPrevias.map(facturaPrev => facturaPrev.mes);

    if (acumuladorMonto > 0) {
      let deudaExistente = deudasGeneradas.find(deuda => deuda.A === ultimaFactura.obraS);

      if (deudaExistente) {
        deudaExistente.B.push(ultimaFactura.factura);
        deudaExistente.C.push(ultimaFactura.mes);
        deudaExistente.D += ultimaFactura.monto;
      } else {
        deudaExistente = new Deuda(
          ultimaFactura.obraS,
          [ultimaFactura.factura],
          [ultimaFactura.mes],
          ultimaFactura.monto
        );
        deudasGeneradas.push(deudaExistente);
      }

      limpiarDeuda();

      deudasGeneradas.forEach(deuda => deuda.deudaAcumulada());
    }
  } else {
    let deudaExistente = deudasGeneradas.find(deuda => deuda.A === ultimaFactura.obraS);

    if (deudaExistente) {
      deudaExistente.B.push(ultimaFactura.factura);
      deudaExistente.C.push(ultimaFactura.mes);
      deudaExistente.D += ultimaFactura.monto;
    } else {
      deudaExistente = new Deuda(
        ultimaFactura.obraS,
        [ultimaFactura.factura],
        [ultimaFactura.mes],
        ultimaFactura.monto
      );
      deudasGeneradas.push(deudaExistente);
    }

    

    limpiarDeuda();

    deudasGeneradas.forEach(deuda => deuda.deudaAcumulada());
  }

  guardarDatosEnLocalStorage()
  console.log("Facturas ingresadas:", facturasIngresadas);
  console.log("Deudas generadas:", deudasGeneradas);
})



//funciones
function vaciarArray() {
  let todasDeudasSaldadas = deudasGeneradas.every(deuda => deuda.D === 0);
  if (todasDeudasSaldadas) {
    deudasGeneradas = [];
  }
}

function limpiarDeuda() {
  while (montoAdeudado.firstChild) {
    montoAdeudado.removeChild(montoAdeudado.firstChild);
  }
}


// ...

// Función para actualizar la interfaz
function actualizarInterfaz() {
  // Limpiar la lista de facturas y deudas en el DOM
  facturas.innerHTML = "";
  montoAdeudado.innerHTML = "";

  // Actualizar la lista de facturas en el DOM
  for (let factura of facturasIngresadas) {
    let lista1 = document.createElement("li");
    lista1.textContent = "Obra Social: " + factura.obraS;
    lista1.style.paddingTop = "10px";
    let lista2 = document.createElement("li");
    lista2.textContent = "Factura Nro: " + factura.factura;
    let lista3 = document.createElement("li");
    lista3.textContent = "Mes: " + factura.mes;
    let lista4 = document.createElement("li");
    lista4.textContent = "Monto: " + factura.monto;
    lista4.style.paddingBottom = "1rem";

    facturas.appendChild(lista1);
    facturas.appendChild(lista2);
    facturas.appendChild(lista3);
    facturas.appendChild(lista4);
  }

  // Actualizar la lista de deudas acumuladas en el DOM
  for (let deuda of deudasGeneradas) {
    let lista5 = document.createElement("li");
    lista5.textContent = "Obra Social: " + deuda.A;
    lista5.style.paddingTop = "10px";
    let lista6 = document.createElement("li");
    lista6.textContent = "Factura nro: " + deuda.B.join(",  ");
    let lista7 = document.createElement("li");
    lista7.textContent = "Mes: " + deuda.C.join(",  ");
    let lista8 = document.createElement("li");
    lista8.textContent = "Monto adeudado: " + deuda.D;
    lista8.style.paddingBottom = "1rem";

    montoAdeudado.appendChild(lista5);
    montoAdeudado.appendChild(lista6);
    montoAdeudado.appendChild(lista7);
    montoAdeudado.appendChild(lista8);
  }
}

botonPago.addEventListener("click", function () {
  let obraSpagoValue = obraSocialPago.value;
  let pagoValue = pago.value;
  let facturaEliminada;

  for (let i = 0; i < facturasIngresadas.length; i++) {
    if (facturasIngresadas[i].obraS === obraSpagoValue && facturasIngresadas[i].factura === pagoValue) {
      facturaEliminada = facturasIngresadas[i];

      facturasIngresadas.splice(i, 1);
      i--;
    }
  }

  for (let j = 0; j < deudasGeneradas.length; j++) {
    if (deudasGeneradas[j].A === obraSpagoValue && deudasGeneradas[j].B.includes(pagoValue)) {
      deudasGeneradas[j].B = deudasGeneradas[j].B.filter(numFactura => numFactura !== pagoValue);
      deudasGeneradas[j].C = deudasGeneradas[j].C.filter(mes => mes !== facturaEliminada.mes);
      deudasGeneradas[j].D -= facturaEliminada.monto;

      if (deudasGeneradas[j].D === 0) {
        deudasGeneradas.splice(j, 1);
        j--;
      }
    }
  }
  actualizarInterfaz();
  guardarDatosEnLocalStorage()
});

function init() {
  
  // Mostrar las facturas ingresadas en el DOM
  for (let factura of facturasIngresadas) {
    let lista1 = document.createElement("li");
    lista1.textContent = "Obra Social: " + factura.obraS;
    let lista2 = document.createElement("li");
    lista2.textContent = "Factura Nro: " + factura.factura;
    let lista3 = document.createElement("li");
    lista3.textContent = "Mes: " + factura.mes;
    let lista4 = document.createElement("li");
    lista4.textContent = "Monto: " + factura.monto;
    lista4.style.paddingBottom = "1rem";

    facturas.appendChild(lista1);
    facturas.appendChild(lista2);
    facturas.appendChild(lista3);
    facturas.appendChild(lista4);
  }

  // Mostrar las deudas generadas en el DOM
  for (let deuda of deudasGeneradas) {
    let lista5 = document.createElement("li");
    lista5.textContent = "Obra Social: " + deuda.A;
    lista5.style.paddingTop = "10px";
    let lista6 = document.createElement("li");
    lista6.textContent = "Factura nro: " + deuda.B.join(",  ");
    let lista7 = document.createElement("li");
    lista7.textContent = "Mes: " + deuda.C.join(",  ");
    let lista8 = document.createElement("li");
    lista8.textContent = "Monto adeudado: " + deuda.D;
    lista8.style.paddingBottom = "1rem";

    montoAdeudado.appendChild(lista5);
    montoAdeudado.appendChild(lista6);
    montoAdeudado.appendChild(lista7);
    montoAdeudado.appendChild(lista8);
  }
}



// Función para guardar los datos en el localStorage
function guardarDatosEnLocalStorage() {
  localStorage.setItem('facturasIngresadas', JSON.stringify(facturasIngresadas));
  localStorage.setItem('deudasGeneradas', JSON.stringify(deudasGeneradas));
}

// Función para recuperar los datos del localStorage
function recuperarDatosDelLocalStorage() {
  const facturasGuardadas = localStorage.getItem('facturasIngresadas');
  const deudasGuardadas = localStorage.getItem('deudasGeneradas');

  if (facturasGuardadas && deudasGuardadas) {
    facturasIngresadas = JSON.parse(facturasGuardadas);
    deudasGeneradas = JSON.parse(deudasGuardadas);
  }
}

// Llamar a la función de recuperar datos al cargar la página
window.addEventListener('load', recuperarDatosDelLocalStorage);

/*

*/