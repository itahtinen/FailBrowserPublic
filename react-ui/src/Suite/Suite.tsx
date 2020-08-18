import React, { useContext, useState, useEffect } from "react";
import { toJS } from "mobx";
import { observer } from "mobx-react";
import { LogContext } from "../Stores/AppStore";
import { fetchSuiteById } from "../Stores/Api";
import { Suite as SuiteInterface } from "../Stores/AppStore";
import { RouteComponentProps, Link } from "react-router-dom";

interface RouteParams {
  id: string;
}

interface Props extends RouteComponentProps<RouteParams> {}

function caseLink(id: string, name: string) {
  const l = (
    <p>
      <Link to={`/cases/${id}`}>{name}</Link>
    </p>
  );
  return l;

  // return <a key={id} href="http://google.com">{name}</a>;
}

export const Suite: React.FC<Props> = observer(({ match }) => {
  const store = useContext(LogContext);
  const [suite, setSuite] = useState({} as SuiteInterface);
  const cases = store.getCasesBySuiteId(match.params.id);

  useEffect(() => {
    if (!store._suiteGroups) {
      fetchSuiteById(match.params.id).then(result => setSuite(result));
      return;
    }
    setSuite(
      toJS(store.suiteListAll).filter(suite => match.params.id === suite.id)[0]
    );
  }, []);

  return (
    <div>
      <span>{suite ? suite.name : null}</span>
      <ul>{cases.map(c => caseLink(c.id, c.name))}</ul>
    </div>
  );
});
