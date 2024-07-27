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
  ngOnInit(): void {
    
  }

}
