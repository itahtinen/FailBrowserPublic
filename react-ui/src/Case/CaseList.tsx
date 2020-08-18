import React, { useContext, useEffect } from "react";
import { LogContext } from "../Stores/AppStore";
import { observer } from "mobx-react-lite";
import { RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";

interface CaseProp {
  id: string;
}

interface Props extends RouteComponentProps<CaseProp> {}

function logLink(id: string, name: string) {
  return <Link
    to= { "/logs/" + id}>
      {name}
    </Link>
}

function singleSample(s) {
  return (
    <tr>
      <td>{s.name}</td>
      <td>{s.status}</td>
      
      <td>
        {logLink(s.log.id, s.log.name)}
      
      </td>
    </tr>
  );
}

export const CaseList: React.FC<Props> = observer(({ match }) => {
  const ctx = useContext(LogContext);
  const id = match.params.id;
  const samples = ctx.getSamplesByCaseId(id);
  return <table>{samples.map(s => singleSample(s))};</table>;
});
