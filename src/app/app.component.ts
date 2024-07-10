import { Component } from '@angular/core';
import { ImportService } from './services/import-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'FinanceAnalyser';

  constructor(private importService: ImportService) {}
  file: any;
  async fileChanged(e: any) {

    this.file = e.target.files[0];
let fileContent = await this.importService.getFileContent(this.file);
let transactions = this.importService.parseCsvToTransactions(fileContent);
console.log(transactions);
    
  }

}
