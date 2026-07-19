import { Component, Input } from '@angular/core';
import { DataState } from '../services/data-state';
import { ImportService } from '../services/import-services/import-service';

@Component({
  selector: 'app-file-selector',
  templateUrl: './file-selector.component.html',
  styleUrls: ['./file-selector.component.scss'],
})
export class FileSelectorComponent {
  @Input() public big: boolean = false;
  private readonly maxFileNameLength = 26;

  constructor(
    private importService: ImportService,
    protected dataState: DataState
  ) {}

  get storedFiles(): Array<{ fileName: string; content: string; uploadedAt: string }> {
    return this.importService.getFilesFromLocalStorage();
  }

  get inputId(): string {
    return this.big ? 'file-upload-big' : 'file-upload-small';
  }

  async fileChanged(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const files = input.files;

    if (!files || files.length === 0) {
      return;
    }

    try {
      for (const file of Array.from(files)) {
        await this.importService.addOrReplaceFile(file);
      }
      input.value = '';
    } catch (error) {
      console.error('Error loading file:', error);
      alert('Fehler beim Laden der Datei. Bitte überprüfen Sie das Dateiformat.');
    }
  }

  removeFile(fileName: string): void {
    this.importService.removeFile(fileName);
  }

  clearFiles(): void {
    if (confirm('Möchten Sie wirklich alle Dateien löschen?')) {
      this.importService.clearFiles();
    }
  }

  truncateFileName(fileName: string): string {
    if (fileName.length <= this.maxFileNameLength) {
      return fileName;
    }

    return `${fileName.substring(0, this.maxFileNameLength - 1)}...`;
  }

}
