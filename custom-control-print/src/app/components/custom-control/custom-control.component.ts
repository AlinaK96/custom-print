import { Component, ElementRef, Injectable, Input, Renderer2,Output, EventEmitter } from '@angular/core';
import { BaseFormControlWebComponent, WebComponentDatasource } from 'custom-control-common';
import { MapService } from '../../services/MapService';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';


interface IItemsDatasourceSetting {
  ItemsDataSourceName: string;
}

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'inka-ui-custom-print',
  templateUrl: './custom-control.component.html',
  styleUrls: ['./custom-control.component.css'],
})

export class MapCustomControl extends BaseFormControlWebComponent<string> {

  PageForm = new FormControl('1')
  selectedVariant = new FormControl('1')
  selectedSide: number = 1
  wayList: number = 4

  itemsWayList: WebComponentDatasource<unknown>;

  httpClient:HttpClient

  constructor(elementRef: ElementRef, renderer: Renderer2, mapService: MapService, private http: HttpClient, private cdr: ChangeDetectorRef) {
    super(elementRef, renderer);
    this.httpClient = http
    this.itemsWayList = new WebComponentDatasource<unknown>(elementRef.nativeElement, renderer);

  }

  ngOnInit(): void {

    this.cdr.detectChanges();
    this.itemsWayList.data$.subscribe((value) => {
      if (value && value.Items ) {
        console.log((value.Items[0] as { wayList: number }).wayList)
        this.wayList = (value.Items[0] as { wayList: number }).wayList;
      }
    });
  }

  @Input() set ItemsWayList(itemsSetting: IItemsDatasourceSetting) {
    this.itemsWayList.subscribe(itemsSetting.ItemsDataSourceName);
}

  onPageChange(event: any) {
    this.PageForm.setValue(event.value);
    this.selectedSide = event.value
    console.log(this.selectedSide)
    this.cdr.detectChanges();
  }

  printPart(divId: string) {
    const printContents = document.getElementById(divId).innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    this.emit('OutOfPrint', null);
    window.location.reload();
  }



  onVariantChange(event: any) {
    
  }

}
