import { Box } from "@mui/material";

import {
  ColoredDataText,
  SimpleDataText,
} from "@/components/text/DataTextPresenter";
import type { ProjectFullDataDto } from "@/data/dto/project-dto";

interface ProjectDetailsProps {
  projectFullData: ProjectFullDataDto;
}

export const ProjectDetails = ({ projectFullData }: ProjectDetailsProps) => {
  const contractorCollaborator = projectFullData.collaboratorsInProject.find(
    (cip) => cip.collaboratorType.code === "CONTRACTOR",
  )?.collaborator;

  const plannerCollaborator = projectFullData.collaboratorsInProject.find(
    (cip) => cip.collaboratorType.code === "PLANNER",
  )?.collaborator;

  return (
    <>
      <Box mt={1}>
        <SimpleDataText
          description="Descrição: "
          value={projectFullData.description || "Sem descrição."}
        />

        <SimpleDataText
          description="Data do evento: "
          value={projectFullData.eventDate.split("T")[0]}
        />

        <SimpleDataText
          description="Tipo de evento: "
          value={projectFullData.eventType.name}
        />

        <SimpleDataText
          description="Status do projeto: "
          value={projectFullData.status.name}
        />

        <SimpleDataText
          description="Bolos: "
          value={projectFullData.cakes.length}
        />

        <ColoredDataText
          description="Pagamentos: "
          value={
            projectFullData.payments.length > 0
              ? `Já houve ${projectFullData.payments.length} pagamento(s).`
              : "Nenhum pagamento registrado."
          }
          textColor={projectFullData.payments.length > 0 ? "warning" : "text"}
        />

        {contractorCollaborator && (
          <SimpleDataText
            description="Contratante: "
            value={
              contractorCollaborator
                ? contractorCollaborator.name
                : "Não há contratante cadastrado."
            }
          />
        )}

        {plannerCollaborator && (
          <SimpleDataText
            description="Cerimonialista: "
            value={
              plannerCollaborator
                ? plannerCollaborator.name
                : "Não há cerimonialista cadastrado."
            }
          />
        )}
      </Box>
    </>
  );
};
