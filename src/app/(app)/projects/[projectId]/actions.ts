import { getProjectById } from "@/http/project/get-project-by-id";
import { getProjectByName } from "@/http/project/get-project-by-name";

export async function getProjectByIdAction(id: string) {
  const project = await getProjectById({ id });

  return project;
}

export async function getProjectByNameAction(name: string) {
  const project = await getProjectByName({ name });

  return project;
}
