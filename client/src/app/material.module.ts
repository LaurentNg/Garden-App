import { NgModule } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
// import { CdkAccordionModule } from '@angular/cdk/accordion';


@NgModule({
    imports: [
        MatExpansionModule,
    ],

    exports: [
        MatExpansionModule,
    ],
    providers: [],

  })
  export class MaterialExampleModule {}