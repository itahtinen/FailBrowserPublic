import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { autorun, toJS } from "mobx";
import { LogService } from "../logservice/log.service";
import { ldisposer, lstop } from "../lifestyles";

export interface Sample {
  id: string;
  name: string;
  suiteid: string;
  status: string;
}

@Component({
  selector: "app-sample",
  templateUrl: "./sample.component.html",
  styleUrls: ["./sample.component.css"]
})
export class SampleComponent implements OnInit, OnDestroy {
  samples: Sample[];
  displayedColumns: string[] = ["name", "status", "source", "time"];

  constructor(private logService: LogService, private route: ActivatedRoute) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get("id");
    ldisposer(
      this,
      autorun(() => {
        this.samples = toJS(this.logService.getSamplesByCaseId(id));
      })
    );
  }
  ngOnDestroy() {
    lstop(this);
  }
}
