import { Suite, Group } from "../suitelist/suitelist.component";
import * as _ from "lodash";

export class LogUtil {
  static filterSuiteGroups(all: Group[], filterString: string) {
    const parents: { [id: string]: string } = {};
    for (const s of all[0].suites) {
      parents[s.id] = s.name;
    }

    const groupsUnFiltered = all.slice(1).map(g => {
      return {
        parentId: g.parentId,
        suites: this.getSuiteArray(g.suites, filterString)
      };
    });

    const groupsFiltered = groupsUnFiltered.filter(g => {
      const parentMatched = parents[g.parentId];
      return (
        parentMatched.toLowerCase().indexOf(filterString) !== -1 ||
        !_.isEmpty(g.suites)
      );
    });
    return [all[0], ...groupsFiltered];
  }

  static getSuiteArray(arr: Suite[], filterString: string) {
    return arr.filter(s => s.name.toLowerCase().indexOf(filterString) !== -1);
  }
}
