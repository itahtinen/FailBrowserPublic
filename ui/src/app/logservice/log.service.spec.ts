import { LogUtil } from "./log.util";
import { filterQueryId } from "@angular/core/src/view/util";
import { testG } from "./testGroups";
import { jsonpCallbackContext } from "@angular/common/http/src/module";
import { allResults } from "./allResults";
import { cResult } from "./codingRowResult";

describe("LogUtil", () => {
  it("should find parent: coding row, and 3 childs", () => {
    const x = LogUtil.filterSuiteGroups(testG, "coding row");
    expect(x).toEqual(cResult);
  });
  it("should find all suites", () => {
    const x = LogUtil.filterSuiteGroups(testG, "");
    expect(x).toEqual(allResults);
  });

  it("should not find any suites", () => {
    const x = LogUtil.filterSuiteGroups(testG, "abcdefghijklmnopqrstu");
    const definetlyEmptyResult = [
      {
        parentId: null,
        suites: [
          {
            id: "cfc0efb7ec0361a9db192dd2dfeab0df",
            name: "ia::BasicSearch",
            parentid: null
          },
          {
            id: "7e9a433e184029012554555df063ce29",
            name: "ia::CodingRows",
            parentid: null
          }
        ]
      }
    ];
    expect(x).toEqual(definetlyEmptyResult);
  });
});
