import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {
  @Input() listado;
  @Output() onBorre = new EventEmitter();
  error = '';
  
  constructor(private http: HttpClient) { }

  ngOnInit() {

  }

  async borrar(id) {
    try {
//      let respuesta = await this.http.delete('http://3.80.30.175/api/diario/' + unaComida._id, {withCredentials: true}).toPromise();
      let respuesta = await this.http.delete('http://localhost:3000/api/diario/' + id, {withCredentials: true}).toPromise();
      this.onBorre.emit(id); 
    }
    catch (err) {
      this.error = "error al borrar";
      console.log(this.error);
    }
  }

  
}
