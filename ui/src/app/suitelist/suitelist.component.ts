import { Component, OnInit, OnDestroy } from "@angular/core";
import { LogService } from "../logservice/log.service";
import { autorun, toJS } from "mobx";
import { ldisposer, lstop, lunsub } from "../lifestyles";
import { ActivatedRoute } from "@angular/router";

export interface Group {
  parentId: null | string;
  suites: Suite[];
}

export interface Suite {
  id: string;
  name: string;
  parentid: null | string;
}

@Component({
  selector: "app-suite",
  templateUrl: "./suitelist.component.html",
  styleUrls: ["./suitelist.component.css"]
})
export class SuiteListComponent implements OnInit, OnDestroy {
  suites: any = [];

  constructor(private logService: LogService, private route: ActivatedRoute) {}

  ngOnInit() {
    lunsub(this, this.route.queryParamMap.subscribe(p => {}));

    ldisposer(
      this,
      autorun(() => {
        this.suites = toJS(this.logService.suiteListAll);
      })
    );
  }

  ngOnDestroy() {
    lstop(this);
  }
}
