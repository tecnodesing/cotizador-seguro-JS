//constructores
function Seguro(marca, year, tipo) {
    this.marca = marca;
    this.year = year;
    this.tipo = tipo;
};

//realizar la cotizacion con los datos
Seguro.prototype.cotizarSeguro = function(){
    /*
    1 = americano 1.15
    2 = asiatico 1.05
    3 = europeo 1.35
    */
   let cantidad;
   const base = 2000;

    switch(this.marca){
        case '1':
            cantidad = base *1.15;
            break;    
        case '2':
            cantidad = base *1.05;
            break;        
        case '3':
            cantidad = base *1.35;
            break;    
    }

    //leer el año
    const diferencia = new Date().getFullYear() - this.year;

    //cada año que la diferencia es mayor, el costo va a reducir un 3%
    cantidad -= ((diferencia * 3) * cantidad ) / 100;
    /*
        si el seguro es basico se multiplica  por un 30% mas
        si el seguro es completo se multiplica  por un 50% mas
    */
   if(this.tipo === 'basico'){
        cantidad *= 1.30;
   }else{
        cantidad *= 1.50;
   }
   return cantidad;
    console.log(cantidad);
}

function UI (){

};

//llena las opciones de años
UI.prototype.llenarOpciones = () => {
    const max = new Date().getFullYear(),
          min = max - 20;
    
    const selectYear = document.querySelector('#year');

    for (let i = max; i > min; i--) {
        let option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        selectYear.appendChild(option);
    };
};

//muestra alertas en pantalla
UI.prototype.mostrarMensaje = (mensaje, tipo) =>{
    const div = document.createElement('div');
    if(tipo === 'error'){
        div.classList.add('error');
    }else{
        div.classList.add('correcto');
    }

    div.classList.add('mensaje', 'mt-10');
    div.textContent = mensaje;

    //insertar en html
    const formulario = document.querySelector('#cotizar-seguro');
    formulario.insertBefore(div, document.querySelector('#resultado'));

    setTimeout(() => {
        div.remove();
    }, 3000);
}

UI.prototype.mostrarResultado = (total, seguro) => {
    const {marca, year, tipo} = seguro;
    let textoMarca;
    switch(marca){
        case '1':
            textoMarca = 'Americano';
            break;
        case '2':
            textoMarca = 'Asiatico';
            break;
        case '3':
            textoMarca = 'Europeo';
            break;
        default:
            break;
    }
    //crear resultado
    const div = document.createElement('div');
    div.classList.add('mt-10');

    div.innerHTML = `
        <p class="header">Tu resumen</p>
        <p class="font-bold">Marca: <span class="font-normal">${textoMarca}</span></p>
        <p class="font-bold">Año: <span class="font-normal">${year}</span></p>
        <p class="font-bold">Tipo: <span class="font-normal capitalize">${tipo}</span></p>
        <p class="font-bold">Total: <span class="font-normal">$ ${total}</span></p>
    `;
    const resultadoDiv = document.querySelector('#resultado');

    //mostrar spinner 
    const spinner = document.querySelector('#cargando');
    spinner.style.display = 'block';

    setTimeout(() => {
        spinner.style.display = 'none';//se borra spinner
        resultadoDiv.appendChild(div);//se muestra resultado
    }, 3000);
}

//instanciar
const ui = new UI();
console.log(ui)

document.addEventListener('DOMContentLoaded', () => {
    ui.llenarOpciones();//llena los años
});

eventListeners();
function eventListeners() {
    const formulario = document.querySelector('#cotizar-seguro');
    formulario.addEventListener('submit', cotizarSeguro)
};

function cotizarSeguro(e){
    e.preventDefault();

    //leer la marca
    const marca = document.querySelector('#marca').value;
    
    //leer el año
    const year = document.querySelector('#year').value;

    //leer cobertura
    const tipo = document.querySelector('input[name="tipo"]:checked').value;

    if(marca === '' || year === '' || tipo === ''){
        ui.mostrarMensaje('Todos los campos son obligatorios', 'error');
    }

    ui.mostrarMensaje('Cotizando...', 'exito');

    //oculta cotizaciones previas
    const resultados = document.querySelector('#resultado div');
    if (resultados != null){
        resultados.remove();
    }

    //instanciar seguro
    const seguro = new Seguro(marca, year, tipo);
    const total = seguro.cotizarSeguro();

    //utilizar prototype que va a cotizar
    ui.mostrarResultado(total, seguro);
}
