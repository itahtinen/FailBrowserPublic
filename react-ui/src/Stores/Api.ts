import { Group, Suite, Case, Sample } from "./AppStore";

export async function fetchSuites(): Promise<Group[]> {
  const response = await fetch("/api/suites");
  const result: Group[] = await response.json();
  return result;
}

export async function fetchSuiteById(id: string): Promise<Suite> {
  const response = await fetch(`/api/suites/${id}`);
  const result: Suite = await response.json();
  return result;
}

export async function fetchCasesById(id: string): Promise<Case[]> {
  const response = await fetch(`/api/cases/${id}`);
  const result: Case[] = await response.json();
  return result;
}

export async function fetchSampleById(id: string): Promise<Sample[]> {
  const response = await fetch(`/api/samples/${id}`);
  const result: Sample[] = await response.json();
  return result;
}

export async function fetchSuitesByParentId(
  parentId: string
): Promise<Suite[]> {
  const response = await fetch(`/api/suites/group/${parentId}`);
  const result: Suite[] = await response.json();
  return result;
}
