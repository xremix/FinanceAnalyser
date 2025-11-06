import { Component, Input, OnInit } from '@angular/core';
import { DataState } from '../services/data-state';
import { ImportService } from '../services/import-services/import-service';

@Component({
  selector: 'app-file-selector',
  templateUrl: './file-selector.component.html',
  styleUrls: ['./file-selector.component.scss'],
})
export class FileSelectorComponent implements OnInit {
  @Input() public big: boolean = false;
  constructor(
    private importService: ImportService,
    protected dataState: DataState
  ) {}
  file: any;
  
  async fileChanged(e: any) {
    this.file = e.target.files[0];
    let fileContent = await this.importService.getFileContent(this.file);
    localStorage.setItem('fileContent', fileContent);
    this.importService.loadFileFromLocalStorage();
  }

  async additionalFileChanged(e: any) {
    const additionalFile = e.target.files[0];
    if (additionalFile) {
      try {
        const fileContent = await this.importService.getFileContent(additionalFile);
        await this.importService.loadAdditionalFile(fileContent, additionalFile.name);
        
        // Reset file input
        e.target.value = '';
      } catch (error) {
        console.error('Error loading additional file:', error);
        alert('Fehler beim Laden der zusätzlichen Datei. Bitte überprüfen Sie das Dateiformat.');
      }
    }
  }

  clearAdditionalFiles() {
    if (confirm('Möchten Sie wirklich alle zusätzlichen Dateien löschen?')) {
      this.importService.clearAdditionalFilesFromLocalStorage();
      // Reload only main file to remove additional transactions
      this.importService.loadFileFromLocalStorage();
    }
  }
  
  ngOnInit(): void {
    
  }

}
