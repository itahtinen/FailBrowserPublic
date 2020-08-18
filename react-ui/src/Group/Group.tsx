import React, { useContext, useState, useEffect } from "react";
import { toJS } from "mobx";
import { observer } from "mobx-react";
import { LogContext } from "../Stores/AppStore";
import { fetchSuitesByParentId } from "../Stores/Api";
import { Suite as SuiteInterface } from "../Stores/AppStore";
import { LogUtil } from "../Stores/Util";
import { RouteComponentProps } from "react-router-dom";

interface RouteParams {
  id: string;
}

interface Props extends RouteComponentProps<RouteParams> {}

export const Group: React.FC<Props> = observer(({ match }) => {
  const store = useContext(LogContext);
  const [suiteGroup, setSuiteGroup] = useState({} as SuiteInterface[]);

  useEffect(() => {
    if (!store._suiteGroups) {
      fetchSuitesByParentId(match.params.id).then(result =>
        setSuiteGroup(LogUtil.getFlattenedSuiteList(result as any))
      );
      return;
    }
    setSuiteGroup(
      toJS(store.suiteListAll).filter(
        suite =>
          match.params.id === suite.id || match.params.id === suite.parentid
      )
    );
  }, []);

  return (
    <div>
      <span>
        {suiteGroup.length ? suiteGroup.filter(f => !f.parentid)[0].name : null}
      </span>
      <ul>
        {suiteGroup.length
          ? suiteGroup
              .filter(s => s.parentid === match.params.id)
              .map(c => <li key={c.id}>{c.name}</li>)
          : null}
      </ul>
    </div>
  );
});
