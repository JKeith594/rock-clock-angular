import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { GpioRequest } from '../models/gpio-request';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GpioWebsocketsService {
  constructor(private socket: Socket) { }

  getSocketButtonOutput(): Observable<string> {
    return this.socket.fromEvent("button");
  }

  setLedPinValue(pin: number, value: number) {
    this.socket.emit("setOutput", new GpioRequest(pin, value));
  }

  setLedPinArrayValue(pins: number[], value: number, secondLayer: boolean) {
    let requests = [];
    pins.forEach(pin => {
      requests.push(new GpioRequest(pin, value));
    });

    if(secondLayer) {
      this.socket.emit("setOutputArraySecondLayer", requests);
    } else {
      this.socket.emit("setOutputArray", requests);
    }
    
  }

  setLedPulsePinValueSpeed(pin: number, value: number, speed: number) {
    let request = new GpioRequest(pin, value);
    request.speed = speed;
    this.socket.emit("setPulse", request);
  }

  setLedPulsePinArrayValueSpeed(pins: number[], value: number, speed: number) {
    let requests = [];
    pins.forEach(pin => {
      let request = new GpioRequest(pin, value);
      request.speed = speed;
      requests.push(request);
    });
    this.socket.emit("setPulseArray", requests);
  }
  
  clearAllLeds(secondLayer: boolean) {
    if(secondLayer) {
      this.socket.emit("clearAllOutputsSecondLayer", null);
    } else {
      this.socket.emit("clearAllOutputs", null);
    }
  }
}
