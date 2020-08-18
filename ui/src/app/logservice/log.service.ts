import { Injectable } from "@angular/core";
import { observable, action, computed, toJS } from "mobx";
import { Suite, Group } from "../suitelist/suitelist.component";
import { LogApi } from "./logs.api";
import { Case } from "../case/case.component";
import { computedFn } from "mobx-utils";
import { Sample } from "../sample/sample.component";
import * as _ from "lodash";
import { LogUtil } from "./log.util";

@Injectable({
  providedIn: "root"
})
export class LogService {
  @observable _suiteGroups: Group[];
  @observable cases = new Map<string, Case[]>();
  @observable samples = new Map<string, Sample[]>();
  @observable filterString = "";
  @observable parentId: string | undefined;

  constructor(private logsApi: LogApi) {}

  @action
  setSuiteList(suites: Group[]) {
    this._suiteGroups = suites;
  }
  @action
  setFilterString(inputString: string) {
    this.filterString = inputString.toLowerCase();
  }

  @action
  setCaseList(suiteId: string, cases: Case[]) {
    this.cases.set(suiteId, cases);
  }
  @action
  setSampleList(caseId: string, samples: Sample[]) {
    this.samples.set(caseId, samples);
  }
  @action
  setParentId(parentId: string | undefined) {
    this.parentId = parentId;
    return;
  }

  @computed
  get suiteListAll(): Suite[] {
    const nested = this.suiteListFiltered;
    if (!nested.length) {
      return undefined;
    }

    const parents = toJS(nested[0].suites);
    const flattened = _.flatMap(
      nested.slice().filter(g => g.parentId != null),
      e => {
        return [parents.find(s => s.id === e.parentId), ...e.suites];
      }
    );

    return flattened;
  }

  @computed
  get suiteListFiltered(): Group[] {
    const all = this.suiteGroups;

    if (!all) {
      return [];
    }
    return LogUtil.filterSuiteGroups(all, this.filterString);
  }

  getCasesBySuiteId = computedFn((suiteId: string) => {
    const cases = this.getCaseList(suiteId);
    if (!cases) {
      return [];
    }

    if (this.filterString == "") {
      return cases;
    }

    return this.cases
      .get(suiteId)
      .filter(
        cases => cases.name.toLowerCase().indexOf(this.filterString) !== -1
      );
  });

  getSamplesByCaseId = computedFn((caseId: string) => {
    const samples = this.getSampleList(caseId);
    if (!samples) {
      return [];
    }

    if (this.filterString == "") {
      return samples;
    }

    return this.samples
      .get(caseId)
      .filter(
        samples => samples.name.toLowerCase().indexOf(this.filterString) !== -1
      );
  });

  get suiteGroups() {
    if (this._suiteGroups) {
      return this._suiteGroups;
    }

    this.populateSuites();
    return undefined;
  }

  getCaseList(suiteId: string) {
    const caseList = this.cases.get(suiteId);

    if (!caseList) {
      this.populateCases(suiteId);
    }
    return caseList;
  }

  getSampleList(caseId: string) {
    const sampleList = this.samples.get(caseId);

    if (!sampleList) {
      this.populateSample(caseId);
    }
    return sampleList;
  }

  populateSuites() {
    this.logsApi.fetchSuites().then(result => this.setSuiteList(result));
  }

  populateCases(suiteId: string) {
    this.logsApi
      .fetchCases(suiteId)
      .then(result => this.setCaseList(suiteId, result));
  }

  populateSample(caseId: string) {
    this.logsApi
      .fetchSample(caseId)
      .then(result => this.setSampleList(caseId, result));
  }
}
