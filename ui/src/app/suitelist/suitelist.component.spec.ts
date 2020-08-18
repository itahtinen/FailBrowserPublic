import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { SuiteListComponent } from "./suitelist.component";

describe("SuitelistComponent", () => {
  let component: SuiteListComponent;
  let fixture: ComponentFixture<SuiteListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SuiteListComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuiteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
