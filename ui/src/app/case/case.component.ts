import { Component, OnInit, Input } from "@angular/core";

export interface Case {
  id: string;
  name: string;
}

@Component({
  selector: "app-case",
  templateUrl: "./case.component.html",
  styleUrls: ["./case.component.css"]
})
export class CaseComponent implements OnInit {
  samples: [];

  @Input() case: Case;

  ngOnInit() {}
}
