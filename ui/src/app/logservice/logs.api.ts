import { Injectable } from "@angular/core";
import { Suite, Group } from "../suitelist/suitelist.component";
import { Case } from "../case/case.component";
import { Sample } from "../sample/sample.component";

@Injectable({
  providedIn: "root"
})
export class LogApi {
  async fetchSuites() {
    const response = await fetch("/api/suites");
    const result: Group[] = await response.json();
    return result;
  }

  async fetchSuiteById(id) {
    const response = await fetch(`/api/suites/${id}`);
    const result: Suite = await response.json();
    return result;
  }

  async fetchCases(id) {
    const response = await fetch(`/api/cases/${id}`);
    const result: Case[] = await response.json();
    return result;
  }

  async fetchSample(id) {
    const response = await fetch(`/api/samples/${id}`);
    const result: Sample[] = await response.json();
    return result;
  }
}
