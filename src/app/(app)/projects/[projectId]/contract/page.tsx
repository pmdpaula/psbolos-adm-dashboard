"use client";

import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import PreviewIcon from "@mui/icons-material/Preview";
import { Button, Stack } from "@mui/material";
import { use, useEffect, useState } from "react";

import type { ProjectFullDataDto } from "@/data/dto/project-dto";

import { getProjectFullDataByIdAction } from "../../action";

const fetchFullProjectData = async (projectId: string) => {
  const projectFullDataInDb = await getProjectFullDataByIdAction(projectId);

  const data: ProjectFullDataDto = projectFullDataInDb;
  return data;
};

interface ProjectContractPageProps {
  params: Promise<{ projectId: string }>;
}

type _ContractData = {
  nomeCliente: string[];
  dadosContratada: string;
  qtdFatias: string;
  massaBolo: string;
  recheio1: string;
  recheio2: string;
  recheio3: string;
  observacoesBolo: string;
  modeloBolo: string;
  valorBolo: string;
  sinalBolo: string;
  saldoBolo: string;
  formaPagamentoBolo: string;
  localEntrega: string;
  dataEntrega: string;
  horaEntrega: string;
  telefoneCliente: string;
  telefoneAdicional: string;
  nomeContatoEvento: string;
  telefoneContatoEvento: string;
};

const ProjectContractPage = ({ params }: ProjectContractPageProps) => {
  const { projectId } = use(params);
  const [projectFull, setProjectFull] = useState<ProjectFullDataDto | null>(
    null,
  );

  useEffect(() => {
    const loadProjectFullData = async () => {
      const data = await fetchFullProjectData(projectId);
      setProjectFull(data);
    };

    loadProjectFullData();
  }, [projectId]);

  return (
    <>
      <Stack spacing={2}>
        <Button
          variant="contained"
          startIcon={<PictureAsPdfIcon />}
          // onClick={handleGeneratePdf}
        >
          Gerar PDF
        </Button>

        <Button
          variant="outlined"
          startIcon={<PreviewIcon />}
          // onClick={togglePreview}
        >
          Visualizar rascunho
        </Button>
      </Stack>

      {projectFull && <pre>{JSON.stringify(projectFull, null, 2)}</pre>}
    </>
  );
};

export default ProjectContractPage;
