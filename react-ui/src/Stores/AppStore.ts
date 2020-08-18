import { observable, action, computed } from "mobx";
import { fetchCasesById, fetchSampleById, fetchSuites } from "./Api";
import { computedFn, createTransformer } from "mobx-utils";
import * as _ from "lodash";
import { LogUtil } from "./Util";
import React from "react";


export interface Case {
  id: string;
  name: string;
}


export interface Sample {
  id: string;
  name: string;
  suiteid: string;
  status: string;
}

export interface Group {
  parentId: null | string;
  suites: Suite[];
}

export interface Suite {
  id: string;
  name: string;
  parentid: null | string;
}


export class LogStore {
  @observable _suiteGroups: Group[] | undefined = undefined;
  @observable cases = new Map<string, Case[]>();
  @observable samples = new Map<string, Sample[]>();
  @observable filterString = "";

  @action
  setSuiteList(suites: Group[]): void {
    this._suiteGroups = suites;
  }

  @action
  setFilterString(inputString: string): void {
    this.filterString = inputString.toLowerCase();
  }

  @action
  setCaseList(suiteId: string, cases: Case[]): void {
    this.cases.set(suiteId, cases);
  }

  @action
  setSampleList(caseId: string, samples: Sample[]): void {
    this.samples.set(caseId, samples);
  }

  @computed
  get suiteListAll(): Suite[] {
    const nested = this.suiteListFiltered;
    if (!nested.length) {
      return [];
    }

    const flattened = LogUtil.getFlattenedSuiteList(nested);

    return flattened;
  }

  @computed
  get suiteListFiltered(): Group[] {
    const all = this.suiteGroups;

    if (!all) {
      return [];
    }

    const filtered = LogUtil.filterSuiteGroups(all, this.filterString);
    return filtered;
  }

  getSuiteArray(arr: Suite[]): Suite[] {
    return arr.filter(
      s => s.name.toLowerCase().indexOf(this.filterString) !== -1
    );
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
      .get(suiteId)!
      .filter(
        cases => cases.name.toLowerCase().indexOf(this.filterString) !== -1
      );
  });

  getSamplesByCaseId = createTransformer((caseId: string) => {
    const samples = this.getSampleList(caseId);
    if (!samples) {
      return [];
    }

    if (this.filterString == "") {
      return samples;
    }

    return this.samples
      .get(caseId)!
      .filter(
        samples => samples.name.toLowerCase().indexOf(this.filterString) !== -1
      );
  });

  get suiteGroups(): Group[] | undefined {
    if (this._suiteGroups) {
      return this._suiteGroups;
    }

    this.populateSuites();
    return undefined;
  }

  getCaseList(suiteId: string): Case[] | undefined {
    const caseList = this.cases.get(suiteId);

    if (!caseList) {
      this.populateCases(suiteId);
    }
    return caseList;
  }

  getSampleList(caseId: string): Sample[] | undefined {
    const sampleList = this.samples.get(caseId);

    if (!sampleList) {
      this.populateSample(caseId);
    }
    return sampleList;
  }

  populateSuites(): void {
    fetchSuites().then(result => this.setSuiteList(result));
  }

  populateCases(suiteId: string): void {
    fetchCasesById(suiteId).then(result => this.setCaseList(suiteId, result));
  }

  populateSample(caseId: string): void {
    fetchSampleById(caseId).then(result => this.setSampleList(caseId, result));
  }
}

export const LogContext = React.createContext(new LogStore());
