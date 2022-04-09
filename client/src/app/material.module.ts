import { NgModule } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';




@NgModule({
    exports: [
        MatExpansionModule,
        CdkAccordionModule,
        MatTableModule,
        MatTabsModule,
        MatPaginatorModule,
        MatCardModule
    ],
    providers: [],

  })
  export class MaterialExampleModule {}