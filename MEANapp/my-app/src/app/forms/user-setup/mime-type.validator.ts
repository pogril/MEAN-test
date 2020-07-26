import { Observable, Observer } from 'rxjs';
import { AbstractControl } from '@angular/forms';

export const mimetypeValidator = (control: AbstractControl):
Observable<null | {[key: string]: any}> | Promise<null | {[key: string]: any}> => {

  const file: File = control.value;
  const fileReader = new FileReader();
  const fileObs = Observable.create((observer: Observer<{[key: string]: any}>) => {
    fileReader.addEventListener('loadend', () => {
      const bytes = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0,4);
      let header = '';
      let isValid = false;

      for(let i = 0; i < bytes.length; i++){
        header += bytes[i].toString(16);
      }
      console.log(header);
      switch(header){
        case "89504e47":
          isValid = true;
          break;
        case "ffd8ffe0":
        case "ffd8ffe1":
        case "ffd8ffe2":
        case "ffd8ffe3":
        case "ffd8ffe8":
        case "ffd8ffdb":
          isValid = true;
          break;
        default:
          isValid = false;
          break;
      }
      if(isValid){
        observer.next(null);
      } else {
        observer.next({InvalidFileType: true});
      }
      observer.complete();
    });

    if(file){
      fileReader.readAsArrayBuffer(file);
    }

  });

  return fileObs;
}


// export function uniqueIDValidator(name: string, http: HttpClient) {

// }
