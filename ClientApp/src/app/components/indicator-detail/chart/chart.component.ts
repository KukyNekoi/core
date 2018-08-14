import { Component, OnInit, Input, DoCheck } from '@angular/core';

import {Indicator} from '../../../shared/models/indicator';
import {RegistryType} from '../../../shared/models/registryType';
import { Observable } from '../../../../../node_modules/rxjs';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit, DoCheck {

  @Input() indicator: Indicator;
  @Input() selectedTypeChart: string;
  @Input() chartValues: number[];
  @Input() chartGoals: number[];
  @Input() chartLabels: string[];

  oldIndicator: Indicator;
  oldSelectedTypeChart: string;

  devStandar: number = 0;
  varianza: number = 0;

  public RegistryType = RegistryType;

  public lineChartData: Array<any> = [
    {data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label: 'Cantidad de Registros', lineTension: 0},
    {data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label: 'Meta', lineTension: 0}
  ];

  public DispersionChartData: Array<any> = [
    {data: new Array(), label: 'Datos'},
    {data: new Array(), label: 'Promedio'},
    {data: new Array(), label: 'Meta'}
  ];

  public lineChartLabels: Array<any> = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo',
    'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  public lineChartOptions: any = {
    responsive: true,
    elements: {
      point: {
        radius: 5,
        hitRadius: 0,
        hoverRadius: 5,
        hoverBorderWidth: 0
      },
      line: {
        tension: 0
      }
    },
    scales: {
      yAxes: [{
          ticks: {
            beginAtZero: true,
          }
      }]
    },
    maintainAspectRatio: false
  };

  public dispersionChartOptions : any = {
    responsive: true,
    tooltips: {
      callbacks: {
        // function that modify the tooltip title
        title: function(tooltipItem, data){
          // get the dataset of point
          var datasetIndex = tooltipItem[0].datasetIndex;
          // get the data array 
          var dispersionData = data.datasets[datasetIndex];
          // get the index 
          var index = tooltipItem[0].index;
          // tooltip title
          var title = dispersionData.data[index].x;
          return title;
        }
      }
    },
    elements: {
      point: {
        radius: 5,
        hitRadius: 0,
        hoverRadius: 5,
        hoverBorderWidth: 0
      },
      line: {
        tension:0
      }

    },
    scales: {
      yAxes: [{
          ticks: {
              beginAtZero: true,
              min: 0,
              max: 100,
              stepSize: 10
          }
      }]
    },
    maintainAspectRatio: false
  };

  public lineChartColors: Array<any> = [

    { // grey
      backgroundColor: 'rgba(144,188,36,0.4)',
      borderColor: 'rgba(0,149,58,1)',
      pointBackgroundColor: 'rgba(0,149,58,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: 'rgba(0,149,58,1)',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },

    { // grey
      backgroundColor: 'transparent',
      borderColor: 'rgba(0, 102, 34,1)',
      pointBackgroundColor: 'rgba(0, 102, 34,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: 'rgba(0, 102, 34,1)',
      pointHoverBorderColor: 'rgba(0, 102, 34,1)'
    }

  ];

  public dispersionChartColors : Array<any> = [
    { // points
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      pointBackgroundColor: 'rgba(0,149,58,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: 'rgba(0,149,58,1)',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    
    { // average
      backgroundColor: 'transparent',
      borderColor: 'rgba(0,149,58,1)',
      pointBackgroundColor: 'rgba(0,149,58,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: 'rgba(0,149,58,1)',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // goal
      backgroundColor: 'transparent',
      borderColor: 'rgba(0, 102, 34,1)',
      pointBackgroundColor: 'rgba(0, 102, 34,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: 'rgba(0, 102, 34,1)',
      pointHoverBorderColor: 'rgba(0, 102, 34,1)'
    }
  ];

  public lineChartLegend = true;
  public lineChartType = 'line';


  constructor() {

  }

  ngOnInit() {
    

    this.oldSelectedTypeChart = this.selectedTypeChart;
    this.oldIndicator = JSON.parse(JSON.stringify(this.indicator));
    if (this.indicator.registriesType !== this.RegistryType.PercentRegistry) {
      // this.showGraph(this.indicator);
      this.lineChartData[0].data = this.chartValues;
      this.lineChartData[1].data = this.chartGoals;
      this.lineChartLabels = this.chartLabels;
    }
    else{
      this.showDispersionGraph(this.indicator);
    }
    
  }


  ngDoCheck(){
    if (JSON.stringify(this.oldIndicator) !== JSON.stringify(this.indicator)){
      // console.log("hay cambios");
      this.oldIndicator = JSON.parse(JSON.stringify(this.indicator));
      if (this.indicator.registriesType !== this.RegistryType.PercentRegistry){
        // this.showGraph(this.indicator);
        
      }
      else{
        this.showDispersionGraph(this.indicator);
      }
    }

    if(this.oldSelectedTypeChart !== this.selectedTypeChart){
      // significa que hay cambios en el tipo de grafico
      if (this.selectedTypeChart === 'Gráfico de barra'){
        this.lineChartColors[0].backgroundColor = 'rgba(144,188,36,0.4)'; // change the bar colors
        this.lineChartType = 'bar'; // now the type is barchart
        let dataset = this.lineChartData[1];
        dataset["type"] = 'line';
        dataset["fill"] = 'false';
      }
      else if (this.selectedTypeChart === 'Gráfico de línea'){
        this.lineChartColors[0].backgroundColor = 'rgba(144,188,36,0.4)'; // back to the original color
        this.lineChartType = 'line'; // the type now is linechart
      }
      else{
        this.selectedTypeChart = 'Gráfico de dispersión';
      }
      this.oldSelectedTypeChart = this.selectedTypeChart;
    }
  }

  // show the dispersion chart
  public showDispersionGraph(indicator: Indicator){
    //if (this.counter++ % 200 == 0){

      let promedio = 0;
      
      let _dispersionChartData : Array<any> = new Array(this.DispersionChartData.length);
      _dispersionChartData[0] = {data: new Array(), label: this.DispersionChartData[0].label}

      for(let i = 0; i < indicator.registries.length; i++){
        const date: Date = new Date(indicator.registries[i].date);
        const month = date.getUTCMonth();
        let percent = indicator.registries[i].percent;
        percent = Number(percent); // convert string to number
        let datos = {x: this.lineChartLabels[month], y:percent};
        promedio += percent; 
        _dispersionChartData[0].data.push(datos);
      }

      promedio = promedio / indicator.registries.length;
      
      _dispersionChartData[1] = {data: new Array(), label:this.DispersionChartData[1].label};

      let months = 12;
      for (let i = 0; i < months; i++){
        promedio = Number(promedio); // convert string to number
        let datos = {x: this.lineChartLabels[i], y:promedio};
        _dispersionChartData[1].data.push(datos);
      }

      _dispersionChartData[2] = {data: new Array(), label:this.DispersionChartData[2].label};

      // sumo los valores de las metas mensuales para obtner la meta anual
      let goalLength = indicator.goals.length;
      let goalYear = 0;
      const currentYear = new Date().getFullYear();
      let numGoalsCurrentYear = 0;
      let goalProm = 0;
      for(let i = 0; i < goalLength; i++){
        if (currentYear == indicator.goals[i].year){
          goalProm = goalProm + indicator.goals[i].value;
          numGoalsCurrentYear++;
        }
      }

      goalYear = goalProm/numGoalsCurrentYear;

      // agrego el valor de la meta a cada mes en el grafico
      for(let i = 0; i < months; i++){
        let datos = {x: this.lineChartLabels[i],y:goalYear};
        _dispersionChartData[2].data.push(datos);
      }


      this.DispersionChartData = _dispersionChartData;

      // get callbacks properties
      let callbacks = this.dispersionChartOptions.tooltips.callbacks;
      // add new attribute to callbacks functions
      callbacks["label"] = function(tooltipItem,data){
        
        var datasetIndex = tooltipItem.datasetIndex;
        var dispersionData = data.datasets[datasetIndex];
        var index = tooltipItem.index;
        // solo puntos dispersion
        if (datasetIndex == 0){
          var registryName = indicator.registries[index].name;
          var percent = dispersionData.data[index].y; 
          var label = registryName+": "+percent+"%";
          return label;
        }
        // solo linea promedio
        if (datasetIndex == 1){
          var prom = dispersionData.data[index].y;
          var label = "promedio: "+prom+"%";
          return label;
        }
        // solo linea meta
        if (datasetIndex == 2){
          var goal = dispersionData.data[index].y;
          var label = "Meta: "+goal+"%";
          return label;
        }
        
        
      }

      if (promedio != 0){
        this.calculateVariationIndicator(promedio);
        
      }      
    //}
  }

  public showGraph(indicator: Indicator) {
    //if (this.counter++ % 200 === 0) {
      const _lineChartData: Array<any> = new Array(this.lineChartData.length);
      _lineChartData[0] = {data: new Array(this.lineChartData[0].data.length), label: this.lineChartData[0].label};
        let cantidad = 0;
        const cantidadAcumulada = 0;
        const monthMin = 0;
        
        let goalLength = indicator.goals.length;
        let goalYear = 0;
        const currentYear = new Date().getFullYear();
        for(let i = 0; i < goalLength; i++){
          if (currentYear == indicator.goals[i].year){
            goalYear = goalYear + indicator.goals[i].value;
          }
        }
        

      // data de la meta
      _lineChartData[1] = {data: new Array(this.lineChartData[1].data.length), label: this.lineChartData[1].label}
      
      // cargo en el data correspondiente la meta
      for(let i = 0; i < _lineChartData[1].data.length; i++){
        _lineChartData[1].data[i] = goalYear;
      }
      

        /* Se ingresa 0 a todos los datos en el arreglo provisorio de los meses (_lineChartData) */
        for (let i = 0; i < 12; i++) {
          _lineChartData[0].data[i] = 0;
        }

        /* Ingreso de datos al arreglo provisorio de meses */
        // console.log("largo" + this.indicator.registries.length);
        for (let i = 0; i < indicator.registries.length; i++) {
          const date: Date = new Date(indicator.registries[i].date);
          const month = date.getUTCMonth();
          // console.log("entre ctm !!!!:   " + month);
          /* if si el registro es de cantidad */
          if (indicator.registriesType === 1) {
            cantidad = indicator.registries[i].quantity;
            // console.log("Cantidad : "+cantidad);

            for (let j = 0; j < 12; j++) {
              if (j >= month) {
                _lineChartData[0].data[j] += cantidad;
              }
            }
          } else { // caso contrario si el registro es default o algun otro que no sea cantidad
            cantidad = 1;
            for (let j = 0; j < 12; j++) {
              if (j >= month) {
                _lineChartData[0].data[j] += cantidad;
              }
            }
          }
        }
      this.lineChartData = _lineChartData; // se ingresa los datos del arreglo provisorio al arreglo de meses original
      // console.log(this.lineChartData);
      // ajustar rango del eje y en el gráfico      
    // }
  }

  // method to calculate the varianza and standard desviation
  calculateVariationIndicator(promedio: number) : void{
    let data = this.DispersionChartData[0].data;
    let n = data.length;
    let sum = 0;
    for (let i = 0; i < n; i++){
      let x = data[i].y; // get the percent
      sum = sum + Math.pow(x-promedio,2);
    }
    // caso cuando hay un solo dato (n = 1 - 1 igual 0) division por cero igual NaN
    if (n - 1 != 0){
      let varianza = sum/(n-1);
      this.varianza = Number(varianza.toFixed(2));
    
      let dev = Math.sqrt(sum/(n-1));

      this.devStandar = Number(dev.toFixed(2));
    }
  }

}
