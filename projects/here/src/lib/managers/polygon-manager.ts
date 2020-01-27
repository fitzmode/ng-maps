import { Injectable } from '@angular/core';
import { NgMapsPolygon, PolygonManager } from '@ng-maps/core';
import { EMPTY, Observable, Observer } from 'rxjs';

@Injectable()
export class HerePolygonManager extends PolygonManager<H.map.Polygon> {
  addPolygon(path: NgMapsPolygon) {
    const polygonPromise = this._mapsWrapper.createPolygon({
      clickable: path.clickable,
      draggable: path.draggable,
      editable: path.editable,
      fillColor: path.fillColor,
      fillOpacity: path.fillOpacity,
      geodesic: path.geodesic,
      paths: path.paths,
      strokeColor: path.strokeColor,
      strokeOpacity: path.strokeOpacity,
      strokeWeight: path.strokeWeight,
      visible: path.visible,
      zIndex: path.zIndex,
    });
    this._polygons.set(path, polygonPromise);
  }

  async updatePolygon(polygon: NgMapsPolygon): Promise<void> {
    const item = await this._polygons.get(polygon);
    const lineString = new H.geo.LineString();
    polygon.paths.forEach((path) => {
      lineString.pushPoint(path);
    });
    const newPolygon = new H.geo.Polygon(lineString);
    item.setGeometry(newPolygon);
  }

  async setPolygonOptions(
    path: NgMapsPolygon,
    options: { [propName: string]: any },
  ): Promise<void> {}

  async deletePolygon(polygon: NgMapsPolygon): Promise<void> {
    const p = await this._polygons.get(polygon);
    if (p == null) {
      return Promise.resolve();
    }
    this._zone.run(() => {
      p.dispose();
      this._polygons.delete(polygon);
    });
  }

  createEventObservable<T>(
    eventName: string,
    path: NgMapsPolygon,
  ): Observable<T> {
    // return new Observable((observer: Observer<T>) => {
    //   this._polygons.get(path).then((l: google.maps.Polygon) => {
    //     l.addListener(eventName, (e: T) =>
    //       this._zone.run(() => observer.next(e)),
    //     );
    //   });
    // });
    return EMPTY;
  }
}
