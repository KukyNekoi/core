import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, Inject, TemplateRef,ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';

// Models
import { Document } from '../../shared/models/document';
import { Indicator } from '../../shared/models/indicator';
import { Months } from '../../shared/models/months';
import { RegistryType } from '../../shared/models/registryType';

// Services
import { IndicatorService } from '../../services/indicator/indicator.service';
import { RegistryService } from '../../services/registry/registry.service';
import { IndicatorGroupService } from '../../services/indicator-group/indicator-group.service';
import { SessionService } from '../../services/session/session.service';

// Ngx-Bootstrap
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

// ng2-chart
import { BaseChartDirective } from 'ng2-charts/ng2-charts';

@Component({
  selector: 'app-indicator-detail',
  templateUrl: './indicator-detail.component.html',
  styleUrls: ['./indicator-detail.component.css'],
})
export class IndicatorDetailComponent implements OnInit {
  // For filtering by years
  private static ALL_YEARS = 'Todos los años';
  private static YEAR = 'Año '; // Part of the string that the DropDown has to show as selected
  // For filtering by months
  private static ALL_MONTHS = 'Todos los meses';

  private idIndicatorGroup: number;
  public indicatorGroupName$: Observable<string>;

  public idIndicator = -1;

  public indicator$: Observable<Indicator>;
  public goal$: Observable<number>;
  public value$: Observable<number>;
  router: Router;
  modalRef: BsModalRef;

  allYears: string = IndicatorDetailComponent.ALL_YEARS;
  selectedYearText: string; // Dropdown year "Año 2018"
  selectedYear: number; // Numeric value for selectionYear
  years: number[] = []; // List of years from 2018 to CurrentYear

  allMonths: string = IndicatorDetailComponent.ALL_MONTHS;
  selectedMonthText: string = IndicatorDetailComponent.ALL_MONTHS; // Default selection (string shown in the dropdown)
  selectedMonth: number; // The current selected month (number), depends of the name of the month in spanish.
  months: number[] = []; // List of the months from 0 (January) to the current month (defined in ngOnInit)
  monthsOfTheYear: string[] = []; // List with the list names of the months (in spanish) of the selected year (defined in ngOnInit)
  isMonthDisabled = false;  // Set 'true' when ALL_YEARS is selected. In other case, set false.

  public RegistryType = RegistryType;

  selectedTypeChart: string;
  typesChart: string[] = [];
  typeDispersion: string[] = [];

  //devStandar : number = 0;
  //varianza : number = 0;

  goal: number = 0;

  //@ViewChild(BaseChartDirective) chart: BaseChartDirective;
    // lineChart
    public counter = 0;
    
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

    public document: Document = null; // For EditDocument


  constructor(private service: IndicatorService,
    router: Router,
    private registryService: RegistryService,
    private indicatorGroupService: IndicatorGroupService,
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private sessionStorage: SessionService) {
    this.idIndicator = this.route.snapshot.params.idIndicator;
    this.idIndicatorGroup = this.route.snapshot.params.idIndicatorGroup;
    this.router = router;
  }

  ngOnInit() {
    this.indicator$ = this.service.getIndicator(this.idIndicator);
    this.updateExternalIndicator();

    const currentYear = new Date().getFullYear();
    const baseYear = 2018;
    for (let i = 0; i <= (currentYear - baseYear); i++) {
      this.years[i] = baseYear + i;
    }

    this.selectedYearText = this.sessionStorage.getYearText(IndicatorDetailComponent.YEAR + currentYear);
    this.selectedYear = this.sessionStorage.getYear(currentYear);

    const currentMonth = new Date().getMonth(); // 0 = Juanuary, 1 = February, ..., 11 = December
    // List of the months (numbers) from 0 to the current month (max 11)
    for (let i = 0; i <= currentMonth; i++) {
      this.months[i] = i;
    }
    this.setMonthsOfTheYear(); // List of the names of the months, based in the prior list (this.months)
    this.selectedMonthText = this.sessionStorage.getMonthText(IndicatorDetailComponent.ALL_MONTHS);
    this.selectedMonth = this.sessionStorage.getMonth(-1);
    this.indicatorGroupName$ = this.indicatorGroupService.getIndicatorGroupName(this.idIndicatorGroup);

    this.selectedTypeChart = 'Gráfico de línea'; // default chart type
    this.typesChart = ['Gráfico de barra', 'Gráfico de línea']; // array options chart type
    this.typeDispersion = ['Gráfico de dispersión'];


    if (this.selectedYear === -1) {
      this.isMonthDisabled = true;
    }

    this.loadDataByFilters();

  }

  loadDataByFilters() {
    if (this.isMonthDisabled === true) {
      if (this.selectedYear === -1) {
        this.selectRegistries(IndicatorDetailComponent.ALL_YEARS, '');
      } else {
        this.selectRegistries(this.selectedYear, '');
      }
    } else {
      this.selectRegistries('', this.selectedMonthText);
    }
  }

  selectRegistries(year: any, month: string) {
    if ((year as string).length !== 0 ) {
      if (year === IndicatorDetailComponent.ALL_YEARS) {
        this.indicator$ = this.service.getIndicator(this.idIndicator); // Show all the registries
        // Calculate indicator all years
        this.value$ = this.service.getIndicatorValue(this.idIndicator);
        this.goal$ = this.service.getGoal(this.idIndicator); // shows all goals
        this.selectedYearText = IndicatorDetailComponent.ALL_YEARS;
        this.sessionStorage.setYearText(this.selectedYearText);
        this.isMonthDisabled = true;  // Not able to select a month
        this.selectedYear = -1;
        this.sessionStorage.setYear(this.selectedYear);
      }
      // tslint:disable-next-line:one-line
      else {
        this.selectedYearText = IndicatorDetailComponent.YEAR + year; // Change the text on the dropdown
        this.sessionStorage.setYearText(this.selectedYearText);
        this.isMonthDisabled = false; // It's possible to select a month
        this.selectedYear = year;
        this.sessionStorage.setYear(this.selectedYear);
        // tslint:disable-next-line:max-line-length
        this.indicator$ = this.service.getIndicatorYearRegistries(this.idIndicator, this.selectedYear); // Show registries from the year selected
        // Calculate Indicator Selected Year
        this.value$ = this.service.getIndicatorValueYear(this.idIndicator, this.selectedYear);
        this.goal$ = this.service.getGoalYear(this.idIndicator, this.selectedYear);
        console.log("goal: ");
        console.log(this.goal$);
        this.setMonths();
        }
      this.selectedMonthText = IndicatorDetailComponent.ALL_MONTHS;
      this.sessionStorage.setMonthText(this.selectedMonthText);
    }
    // tslint:disable-next-line:one-line
    else {
      if (month === IndicatorDetailComponent.ALL_MONTHS) {
        this.selectedMonth = -1; // Not selected a specific month
        this.sessionStorage.setMonth(this.selectedMonth);
        this.indicator$ = this.service.getIndicatorYearRegistries(this.idIndicator, this.selectedYear);
        // Calculate Indicator All MONTHS
        this.value$ = this.service.getIndicatorValueYear(this.idIndicator, this.selectedYear);
        this.selectedMonthText = IndicatorDetailComponent.ALL_MONTHS;
        this.sessionStorage.setMonthText(this.selectedMonthText);
        this.goal$ = this.service.getGoalYear(this.idIndicator, this.selectedYear);
      }
      // tslint:disable-next-line:one-line
      else{
        this.setSelectedMonth(month);
        this.indicator$ = this.service.getIndicatorYearMonthRegistries(this.idIndicator, this.selectedYear, this.selectedMonth);
        // Calculate Indicator selected MONTH
        this.value$ = this.service.getIndicatorValueYearMonth(this.idIndicator, this.selectedYear, this.selectedMonth);
        this.goal$ = this.service.getGoalYearMonth(this.idIndicator, this.selectedYear, this.selectedMonth);
        this.selectedMonthText = Months[this.selectedMonth]; // Change the value shown in the dropdown
        this.sessionStorage.setMonthText(this.selectedMonthText);
      }
    }
  }

  openModalEditDocument(template: TemplateRef<any>, selectedDocument: Document) {
    this.document = selectedDocument;
    this.modalRef = this.modalService.show(template);
  }

  selectChart(type: string, indicator: Indicator) {


    if (type === 'Gráfico de barra') {
      this.selectedTypeChart = 'Gráfico de barra'; // change the dropdownlist text
      //this.lineChartColors[0].backgroundColor = 'rgba(144,188,36,0.4)'; // change the bar colors
      //this.lineChartType = 'bar'; // now the type is barchart
      //let dataset = this.lineChartData[1];
      //dataset["type"] = 'line';
      //dataset["fill"] = 'false';


    } else if (type === 'Gráfico de línea') {
      this.selectedTypeChart = 'Gráfico de línea'; // change the dropdownlist text
      //this.lineChartColors[0].backgroundColor = 'rgba(144,188,36,0.4)'; // back to the original color
      //this.lineChartType = 'line'; // the type now is linechart
    } else {
      this.selectedTypeChart = 'Gráfico de dispersión';
    }

  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  gotoRegistry(registryID: number) {
    this.router.navigateByUrl('/registry/' + registryID);
  }

  gotoAddRegistry() {
    this.router.navigateByUrl('/indicator-add-registry');
  }

  // Set the list of the months (numbers) from 0 to the current month (max 11)
  // The months depends on the selected year (this.selectedYear)
  setMonths() {
    const currentYear = new Date().getFullYear();
    if (this.selectedYear < currentYear) {
      this.months = [];
      for (let i = 0; i <= 11; i++) { // Months from January (0) to December (11)
        this.months[i] = i;
      }
    }
    // tslint:disable-next-line:one-line
    else {
      this.months = [];
      console.log(this.months);
      const currentMonth = new Date().getMonth(); // 0 = Juanuary, 1 = February, ..., 11 = Decembery
      for (let i = 0; i <= currentMonth; i++) {
        this.months[i] = i;
      }
    }
    this.setMonthsOfTheYear();
  }

  // Sets the names of the months of the selected year
  setMonthsOfTheYear() {
    this.monthsOfTheYear = [];
    this.months.forEach(month => {
      this.monthsOfTheYear[month] = Months[month];
    });
  }

  // According to the name of a month, it sets the corresponding number to the 'selectedMonth'
  setSelectedMonth(month: string) {
    this.selectedMonth = Months[month];
    this.sessionStorage.setMonth(this.selectedMonth);
  }

  /*
  // show the dispersion chart
  public showDispersionGraph(indicator: Indicator){
    if (this.counter++ % 200 == 0){

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
    }
  }

  public showGraph(indicator: Indicator) {
    if (this.counter++ % 200 === 0) {
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
      

        // Se ingresa 0 a todos los datos en el arreglo provisorio de los meses (_lineChartData) 
        for (let i = 0; i < 12; i++) {
          _lineChartData[0].data[i] = 0;
        }

        // Ingreso de datos al arreglo provisorio de meses 
        // console.log("largo" + this.indicator.registries.length);
        for (let i = 0; i < indicator.registries.length; i++) {
          const date: Date = new Date(indicator.registries[i].date);
          const month = date.getUTCMonth();
          // console.log("entre ctm !!!!:   " + month);
          // if si el registro es de cantidad 
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
      console.log(this.lineChartData);
      // ajustar rango del eje y en el gráfico      
    }
  }
  */
  // events
  /*
  public chartClicked(e: any): void {
    //console.log(e);
  }

  public chartHovered(e: any): void {
    //console.log(e);
  }
  */
  /*
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
  */
  // Update the goals depending the already selected filters
  updateGoal(event) {
    if (this.selectedYear === -1) { // All years
      this.goal$ = this.service.getGoal(this.idIndicator);
    } else if (this.selectedMonth === -1) { // Specific year
      this.goal$ = this.service.getGoalYear(this.idIndicator, this.selectedYear);
    } else { // Specific year and month
      this.goal$ = this.service.getGoalYearMonth(this.idIndicator, this.selectedYear, this.selectedMonth);
    }
  }

  updateExternalIndicator() {
    this.indicator$.subscribe((indicator) => {
      if (indicator.registriesType === RegistryType.ExternalRegistry) {
        this.registryService.getRegistriesExternal().subscribe();
      }
    });
  }

}

