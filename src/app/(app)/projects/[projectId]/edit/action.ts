"use server";

import { getProjectById } from "@/http/project/get-project-by-id";

export async function getProjectByIdAction(id: string) {
  const project = await getProjectById({ id });

  return project;
}
