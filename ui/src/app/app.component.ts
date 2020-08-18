//"rootcomponent"
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Component } from "@angular/core";
import { LogService } from "./logservice/log.service";
import { ActivatedRoute, Router } from "@angular/router";
import { toJS, autorun } from "mobx";
import { lstop, ldisposer } from "./lifestyles";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  title = "FailBrowser";
  searchInputString: string;

  constructor(
    private http: HttpClient,
    private log: LogService,
    private router: Router
  ) {}

  ngOnInit() {
    this.router.events.subscribe(() => {
      this.log.setFilterString("");
    });
    ldisposer(
      this,
      autorun(() => {
        this.searchInputString = toJS(this.log.filterString);
      })
    );
  }

  searchChange(event: any) {
    this.log.setFilterString(event.target.value);
  }

  ngOnDestroy() {
    lstop(this);
  }
}
