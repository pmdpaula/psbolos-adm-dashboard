"use client";

import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  useMediaQuery,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { use, useEffect, useState } from "react";

import { companyData } from "@/data/companyData";
import type { ProjectFullDataDto } from "@/data/dto/project-dto";
import { getCakeBatters } from "@/http/data-types/get-cake-batters";
import { getCakeFillings } from "@/http/data-types/get-cake-fillings";
import { getProjectFullDataById } from "@/http/project/get-project-full-data-by-id";

import { ProjectHeader } from "../../components/ProjectHeader";
import { generatePdfFromProject } from "./actions";
import PreviewContractFromProject from "./PreviewContractFromProject";

// const fetchFullProjectData = async (projectId: string) => {
//   const projectFullDataInDb = await getProjectFullDataByIdAction(projectId);

//   const data: ProjectFullDataDto = projectFullDataInDb;
//   return data;
// };

interface ProjectContractPageProps {
  params: Promise<{ projectId: string }>;
}

export type ContractData = {
  contractorName: string;
  companyData: string;
  cakes: {
    description: string;
    slices: number;
    tiers: number;
    price: number;
    batterName: string;
    filling1Name: string;
    filling2Name: string;
    filling3Name: string;
  }[];
  // cakes: CakeDto[];
  // cakes: ProjectFullDataDto["cakes"];
  // qtdFatias: string;
  // massaBolo: string;
  // recheio1: string;
  // recheio2: string;
  // recheio3: string;
  // observacoesBolo: string;
  // modeloBolo: string;
  // valorBolo: string;
  // sinalBolo: string;
  // saldoBolo: string;
  // formaPagamentoBolo: string;
  locaName: string;
  eventDate: string;
  eventHour?: string;
  contractorContact1: string;
  contractorContact2?: string;
  plannerName?: string;
  plannerContact?: string;
  fullPrice: number;
  allPaymentsMade: number;
  paymentMethod?: string;
};

const ProjectContractPage = ({ params }: ProjectContractPageProps) => {
  const { projectId } = use(params);
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const [contractData, setContractData] = useState<ContractData | null>(null);
  const [contractorData, setContractorData] = useState<
    ProjectFullDataDto["collaboratorsInProject"][0] | null
  >(null);
  const [plannerData, setPlannerData] = useState<
    ProjectFullDataDto["collaboratorsInProject"][0] | null
  >(null);
  const [isReadingData, setIsReadingData] = useState(true);

  const { data: projectFull } = useQuery({
    queryKey: [`projects/${projectId}/full-data`],
    queryFn: async () => await getProjectFullDataById({ id: projectId }),
  });

  const { data: cakeBattersData, isLoading: isLoadingCakeBatters } = useQuery({
    queryKey: ["cake-batters"],
    queryFn: async () => await getCakeBatters(),
  });

  const { data: cakeFillingsData, isLoading: isLoadingCakeFillings } = useQuery(
    {
      queryKey: ["cake-fillings"],
      queryFn: async () => await getCakeFillings(),
    },
  );

  function getContractorData(projectData: ProjectFullDataDto) {
    return (
      projectData.collaboratorsInProject.find(
        (collab) => collab.collaboratorType.code === "CONTRACTOR",
      ) || null
    );
  }

  function getPlannerData(projectData: ProjectFullDataDto) {
    return (
      projectData.collaboratorsInProject.find(
        (collab) => collab.role === "PLANNER",
      ) || null
    );
  }

  function transformProjectDataToContractData(
    projectData: ProjectFullDataDto,
    contractor: ProjectFullDataDto["collaboratorsInProject"][0],
    planner: ProjectFullDataDto["collaboratorsInProject"][0] | null,
  ): ContractData {
    const transformedCakes = projectData.cakes.map((cake) => {
      const batterName = cakeBattersData!.cakeBatters.find(
        (batter) => batter.code === cake.batterCode,
      )!.name;

      const filling1Name = cakeFillingsData!.cakeFillings.find(
        (filling) => filling.code === cake.fillingCode1,
      )!.name;

      const filling2Name = cakeFillingsData!.cakeFillings.find(
        (filling) => filling.code === cake.fillingCode2,
      )!.name;
      const filling3Name = cakeFillingsData!.cakeFillings.find(
        (filling) => filling.code === cake.fillingCode3,
      )!.name;

      return {
        description: cake.description,
        slices: cake.slices,
        tiers: cake.tiers,
        price: cake.price,
        batterName,
        filling1Name,
        filling2Name,
        filling3Name,
      };
    });

    return {
      contractorName: contractor.collaborator.name,
      companyData: `${companyData.representativeName}, ${companyData.representativeRole}, representante da ${companyData.name}, localizada na ${companyData.address} , inscrita no ${companyData.companyIdType}: ${companyData.companyIdNumber}`,
      cakes: transformedCakes,
      // qtdFatias: projectData.cake.slices.toString(),
      // massaBolo: projectData.cake.batter,
      // recheio1: projectData.cake.filling1,
      // recheio2: projectData.cake.filling2 || "",
      // recheio3: projectData.cake.filling3 || "",
      // observacoesBolo: projectData.cake.notes || "",
      // modeloBolo: projectData.cake.model,
      // valorBolo: projectData.payment.totalValue.toString(),
      // sinalBolo: projectData.payment.downPayment.toString(),
      // saldoBolo: (
      //   projectData.payment.totalValue - projectData.payment.downPayment
      // ).toString(),
      // formaPagamentoBolo: projectData.payment.paymentMethod,
      locaName: projectData.localName || "",
      eventDate: projectData.eventDate,
      eventHour: "a definir",
      contractorContact1: contractor.collaborator.contact1 || "",
      contractorContact2: contractor.collaborator.contact2 || "",
      plannerName: plannerData?.collaborator.name || "",
      plannerContact:
        planner?.collaborator.contact1 ||
        planner?.collaborator.contact2 ||
        planner?.collaborator.contact2 ||
        "",
      fullPrice: projectData.cakes.reduce((total, price) => {
        return total + price.price;
      }, projectData.shippingCost),
      allPaymentsMade: projectData.payments.reduce((total, payment) => {
        return total + payment.amount;
      }, 0),
      paymentMethod: projectData.paymentMethod || "",
    };
  }

  function handleGeneratePdf() {
    generatePdfFromProject(contractData!);
  }

  useEffect(() => {
    if (projectFull && !isLoadingCakeBatters && !isLoadingCakeFillings) {
      const contractor = getContractorData(projectFull);
      const planner = getPlannerData(projectFull);

      setContractorData(contractor);
      setPlannerData(planner);

      if (contractor) {
        const transformedData = transformProjectDataToContractData(
          projectFull,
          contractor,
          planner,
        );

        setContractData(transformedData);
      } else {
        setContractData(null);
      }

      setIsReadingData(false);
    }
  }, [projectFull, cakeBattersData, cakeFillingsData]);

  return (
    <>
      {isReadingData ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <>
          {projectFull && (
            <>
              <ProjectHeader
                projectId={projectId}
                name={projectFull.name || ""}
                description={projectFull.description || ""}
              />

              <Stack spacing={2}>
                <Button
                  variant="contained"
                  startIcon={<PictureAsPdfIcon />}
                  fullWidth
                  disabled={!contractData}
                  onClick={handleGeneratePdf}
                >
                  Gerar PDF
                </Button>

                {contractorData && contractData ? (
                  <PreviewContractFromProject data={contractData!} />
                ) : (
                  <Stack
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    sx={{ mt: 4 }}
                  >
                    <Alert
                      severity="warning"
                      sx={{ width: "90%" }}
                    >
                      O projeto não possui um contratante definido. Não é
                      possível gerar um contrato.
                    </Alert>
                  </Stack>
                )}
              </Stack>
            </>
          )}
        </>
      )}

      {/* {projectFull && <pre>{JSON.stringify(projectFull, null, 2)}</pre>} */}
    </>
  );
};

export default ProjectContractPage;
