// import { Pipe, PipeTransform } from '@angular/core';

// @Pipe({
//   name: 'decodebase64',
//   standalone: true,
// })
// export class Decodebase64Pipe implements PipeTransform {
//   transform(imagenBase64: string | undefined, tipo: string = 'png'): string {
//     // Retorna una cadena vacía si la imagen es indefinida
//     if (!imagenBase64) {
//       return ''; // O puedes retornar una URL por defecto
//     }
//     if (!imagenBase64.startsWith('data:image/')) {
//       return `data:image/${tipo};base64,${imagenBase64}`;
//     }
//     return imagenBase64;
//   }
// }

// decodebase64.pipe.ts
// src/app/pipes/decodebase64.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'decodebase64',
  standalone: true
})
export class Decodebase64Pipe implements PipeTransform {
  transform(base64Data: string, mime: string): string {
    if (!base64Data) return '';
    try {
      const blob = this.base64ToBlob(base64Data, mime);
      const url = URL.createObjectURL(blob);
      return url;
    } catch (e) {
      console.error('decodebase64 pipe error', e);
      return '';
    }
  }

  private base64ToBlob(base64: string, mime: string): Blob {
    const clean = base64.replace(/^data:image\/[a-z]+;base64,/, '');
    const byteCharacters = atob(clean);
    const byteArrays: Uint8Array[] = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array<number>(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: mime });
  }
}