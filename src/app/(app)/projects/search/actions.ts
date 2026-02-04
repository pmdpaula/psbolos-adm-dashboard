import { HTTPError } from "ky";

import { searchProjects } from "@/http/project/search-projects";

export async function searchProjectsAction(query: string) {
  try {
    const { projects } = await searchProjects(query);

    return { success: true, projects, message: null, errors: null };
  } catch (error) {
    console.error("🚀 ~ searchProjectsAction:", error);
    if (error instanceof HTTPError) {
      const { message } = await error.response.json();

      return {
        success: false,
        projects: [],
        message,
        errors: error.response.status,
      };
    }

    return {
      success: false,
      projects: [],
      message: "Algo deu errado. Por favor, tente novamente mais tarde.",
      errors: null,
    };
  }
}
