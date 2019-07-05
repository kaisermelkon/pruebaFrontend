import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'pruebaFrontend';
  rows = [];
  columns = [
    { name: 'Months' },
    { name: 'Markets' },
    { name: 'Hub' },
    { name: 'Ports to Provision' },
    { name: 'Router' },
    { name: 'Recommended Ports' },
    { name: 'Market Provisioned Capacity' },
    { name: 'Forecasted Traffic' }
  ];
  private _jsonURL = 'assets/2018-hubs-simulation_output.json';
  private siteName = "";
  private tempMonth = "";
  private tempHubName = "";
  private tempForecastedTraffic;
  private tempMaxPortSize;
  private tempProvisionedCapacity;
  private tempRouter;
  private tempCantidadPorts;
  private tempPorts=[];
  private tempTipoPorts;
  tempRows = [];

  constructor(private http: HttpClient) {

  }

  ngOnInit() {
    this.getJSON().subscribe(data => {
      console.log(data);
      for (let datas of data) {
        this.siteName = datas.site;
        for (let sim of datas.simulation) {
          this.tempMonth = sim.month.toString();
          console.log(this.tempMonth);
          for (let hub of sim.hubs) {
            this.tempHubName = hub.hub_name;
            this.tempForecastedTraffic = hub.forecasted_traffic;
            this.tempMaxPortSize = hub.max_port_size;
            this.tempProvisionedCapacity = hub.provisioned_capacity;
            this.tempCantidadPorts=null;
            this.tempTipoPorts=null;
            this.tempPorts=[];
            //console.log(hub);
            if (hub.hasOwnProperty('new_provisioning')) {
              for (let pro of hub.new_provisioning) {
                this.tempRouter = pro.router;
                //console.log(pro.interfaces);
                if (pro.interfaces.hasOwnProperty('10g_ports')) {
                  this.tempPorts=[];
                  this.tempCantidadPorts=pro.interfaces["10g_ports"].length;
                  this.tempTipoPorts="10G";
                  console.log(this.tempCantidadPorts);
                  for (let inter of pro.interfaces["10g_ports"]) {
                    this.tempPorts.push(inter);
                    
                    //console.log(inter);
                  }
                  //console.log(this.tempPorts);
                }
                else if (pro.interfaces.hasOwnProperty('100g_ports')) {
                  this.tempPorts=[];
                  this.tempCantidadPorts=pro.interfaces["100g_ports"].length;
                  this.tempTipoPorts="100G";
                  //console.log(this.tempCantidadPorts);
                  for (let inter of pro.interfaces["100g_ports"]) {
                    this.tempPorts.push(inter);
                    //console.log(inter);
                    //console.log("bahduihadihidahiwd")
                  }
                }
                this.tempRows.push({ months: this.tempMonth, markets: this.siteName, hub: this.tempHubName, portsToProvision: this.tempCantidadPorts+"x"+this.tempTipoPorts, router: this.tempRouter, recommendedPorts: this.tempPorts, marketProvisionedCapacity: this.tempProvisionedCapacity, forecastedTraffic: this.tempForecastedTraffic });
                //console.log(this.tempRows);
                this.rows = this.tempRows;
                console.log(this.rows);
              }
            }
          }
          //console.log("new sim");
        }
        //console.log("new datas");
      }

    });
  }

  public getJSON(): Observable<any> {
    return this.http.get(this._jsonURL);
  }

}
