import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SuiteListComponent } from "./suitelist/suitelist.component";
import { AboutComponent } from "./about/about.component";
import { HomeComponent } from "./home/home.component";
import { SuiteComponent } from "./suite/suite.component";
import { CaseComponent } from "./case/case.component";
import { SampleComponent } from "./sample/sample.component";

const routes: Routes = [
  { path: "suites", component: SuiteListComponent },
  { path: "about", component: AboutComponent },
  { path: "", component: HomeComponent },
  { path: "suite/:id", component: SuiteComponent },
  { path: "suite/:parentid", component: SuiteComponent },
  { path: "cases/:id", component: CaseComponent },
  { path: "samples/:id", component: SampleComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
