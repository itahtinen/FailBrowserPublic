import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Suite } from "../suitelist/suitelist.component";
import { Case } from "../case/case.component";
import { LogService } from "../logservice/log.service";
import { autorun, toJS } from "mobx";
import { LogApi } from "../logservice/logs.api";
import { ldisposer, lstop } from "../lifestyles";

@Component({
  selector: "app-suite",
  templateUrl: "./suite.component.html",
  styleUrls: ["./suite.component.css"]
})
export class SuiteComponent implements OnInit, OnDestroy {
  suite: Suite;
  cases: Case[];
  constructor(
    private logService: LogService,
    private route: ActivatedRoute,
    private logsApi: LogApi
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get("id");
    ldisposer(
      this,
      autorun(() => {
        this.cases = toJS(this.logService.getCasesBySuiteId(id));
      })
    );

    this.getSuite(id);
  }

  ngOnDestroy() {
    lstop(this);
  }

  getSuite(id: string): void {
    if (!this.logService._suiteGroups) {
      this.logsApi.fetchSuiteById(id).then(result => (this.suite = result));
      return;
    }

    this.suite = toJS(this.logService.suiteListAll).filter(
      suite => id === suite.id
    )[0];
  }
}
