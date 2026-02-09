import { Container, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import Typography, { type TypographyProps } from "@mui/material/Typography";
import Image from "next/image";

import logoPSB from "@/assets/psb-banner_bglight.svg";
import { companyData } from "@/data/companyData";

import type { ContractData } from "./page";

interface TextProps extends TypographyProps {
  children: React.ReactNode;
}

interface FieldProps extends TypographyProps {
  title: string;
  value: string;
}

type PreviewContractFromProjectProps = {
  contractData: ContractData;
};

const PreviewContractFromProject = ({
  contractData,
}: PreviewContractFromProjectProps) => {
  const Title = (props: TextProps) => {
    return (
      <Typography
        variant="body1"
        sx={{ color: "black", mt: 1.5, mb: 0.5, fontWeight: "500" }}
      >
        {props.children}
      </Typography>
    );
  };

  const Field = (props: FieldProps) => {
    return (
      <Stack
        direction="row"
        my={0.3}
      >
        <Typography
          variant="caption"
          sx={{ color: "black", fontWeight: "bold" }}
        >
          {props.title}
        </Typography>
        <Typography
          variant="caption"
          sx={{ color: "blue", ml: 1 }}
        >
          {props.value}
        </Typography>
      </Stack>
    );
  };

  return (
    <Container maxWidth="lg">
      <Box
        bgcolor="white"
        p={0.5}
      >
        <Typography
          variant="caption"
          color="gray"
        >
          página 1
        </Typography>

        <Box
          p={1}
          pb={12}
          sx={{ border: "2px solid black", borderRadius: 1 }}
        >
          <Image
            src={logoPSB}
            alt="logotipo com um bolo estilizado rosa e marrom a esquerda e a direita o nome Patricia Siqueira"
            width={300}
          />
          <Title>1. Identificação das Partes</Title>

          <Field
            title="Contratante:"
            value={contractData.contractorName}
          />
          <Field
            title="Contratada:"
            value={contractData.companyData}
          />

          <Typography
            variant="caption"
            sx={{ color: "black", my: 1 }}
          >
            As partes acima têm entre si acertado o seguinte Contrato de
            Prestação de Serviços, que se regerá pelas seguintes clausulas e
            pelas condições de preço, forma e termo de pagamento descritas no
            presente.
          </Typography>

          <Title>2. Do Objeto do Contrato</Title>

          <Typography
            variant="caption"
            sx={{ color: "black", my: 1 }}
          >
            Clausula 1ª: É objeto do presente contrato a confecção do bolo de
            acordo com a descrição que segue no formulário abaixo:
          </Typography>

          <Field
            title="Quantidade de bolos:"
            value={String(contractData.cakes.length)}
          />
          {contractData.cakes.map((cake, index) => {
            return (
              <Box
                key={index}
                bgcolor="grey.100"
                sx={{ borderRadius: 1, py: 0, px: 0.4, my: 0.1 }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  // my={1}
                  spacing={4}
                >
                  <Field
                    title="Nº fatias:"
                    value={String(cake.slices || "")}
                  />

                  {/* <Field
                    title="Andares:"
                    value={String(cake.tiers)}
                  /> */}

                  <Field
                    title="Massa do bolo:"
                    value={cake.batterName}
                  />
                </Stack>

                <Field
                  title="Recheios:"
                  value={`${cake.filling1Name}, ${cake.filling2Name} e ${cake.filling3Name}`}
                />

                <Field
                  title="Descrição:"
                  value={cake.description}
                />
              </Box>
            );
          })}

          <Stack
            direction="row"
            my={1}
            spacing={4}
            justifyContent="space-between"
          >
            <Field
              title="Valor:"
              value={contractData.fullPrice.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            />
            <Field
              title="Sinal:"
              value={contractData.allPaymentsMade.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            />
            {/* <Field
              title="Saldo:"
              value={(
                contractData.fullPrice - contractData.allPaymentsMade
              ).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            /> */}
          </Stack>

          <Field
            title="Forma de pagamento:"
            value={contractData.paymentMethod || "a definir"}
          />

          <Stack
            direction="row"
            my={1}
            spacing={4}
            justifyContent="space-between"
          >
            <Field
              title="Dados bancários:"
              value={`${companyData.bankData.bankName} (${companyData.bankData.bankNumber}), ag. ${companyData.bankData.agency}, cc. ${companyData.bankData.account}.`}
            />

            <Field
              title="Pix:"
              value={`${companyData.bankData.pixType} ${companyData.bankData.pix}`}
            />
          </Stack>

          <Title>3. Obrigações da Contratante</Title>

          <Typography
            variant="caption"
            sx={{ color: "black", my: 1 }}
          >
            Clausula 2ª: A CONTRATANTE deverá fornecer a CONTRATADA as
            informações do formulário seguinte a fim de que a entrega seja feita
            sem contratempos para ambas as partes.
          </Typography>

          <Field
            title="Local da entrega:"
            value={contractData.locaName}
          />
          <Field
            title="Data da entrega:"
            value={new Date(contractData.eventDate).toLocaleDateString(
              "pt-BR",
              {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric",
              },
            )}
          />
          {/* <Field title="Hora da entrega:" value={data.horaEntrega} /> */}

          <Stack
            direction="row"
            my={1}
            spacing={2}
            justifyContent="normal"
          >
            <Field
              title="Telefone cliente:"
              value={contractData.contractorContact1}
            />
            <Field
              title="Telefone adicional:"
              value={contractData.contractorContact2 || ""}
            />
          </Stack>

          <Stack
            direction="row"
            my={1}
            spacing={10}
            justifyContent="normal"
          >
            <Field
              title="Contato do evento:"
              value={contractData.plannerName || ""}
            />
            <Field
              title="Telefone contato do evento:"
              value={contractData.plannerContact || ""}
            />
          </Stack>
        </Box>
      </Box>

      <Box
        bgcolor="white"
        p={0.5}
        mt={1.5}
      >
        <Typography
          variant="caption"
          color="gray"
        >
          página 2
        </Typography>

        <Box
          p={1}
          pb={24}
          sx={{ border: "2px solid black", borderRadius: 1 }}
        >
          <Image
            src={logoPSB}
            alt="logotipo com um bolo estilizado rosa e marrom a esquerda e a direita o nome Patricia Siqueira"
            width={300}
          />
          <Title>4. Políticas de Cancelamento ou Adiamento</Title>

          <Typography
            variant="caption"
            sx={{ color: "black", my: 1 }}
          >
            <p>Clausula 3ª: Casos de desistência por parte do contratante:</p>
            <p>
              • Em até 60 dias antes da data evento ocorre-se a devolução de 30%
              do valor pago.
            </p>
            <p>
              • Em até 30 dias antes da data evento ocorre-se a devolução de 20%
              do valor pago.
            </p>
            <p>
              • Em até 11 dias antes da data evento ocorre-se a devolução de 10%
              do valor pago.
            </p>
            <p>
              • Do décimo dia anterior a data do evento em diante, não haverá
              devolução de valor.
            </p>
            <p>
              Clausula 4ª: Para adiamento de data, o valor do produto poderá
              sofrer reajuste da seguinte forma:
            </p>
            <p>• Até 6 meses de adiamento – ajuste de acordo com o IPCA;</p>
            <p>
              • Acima de 6 meses, conforme valores de tabela vigente na nova
              data do evento.
            </p>
          </Typography>

          <Title>5. Da Validação do Contrato</Title>

          <Stack spacing={0}>
            <Typography
              variant="caption"
              sx={{ color: "black", my: 0.5 }}
            >
              Clausula 5ª: A data somente será reservada mediante pagamento de
              sinal.
            </Typography>

            <Typography
              variant="caption"
              sx={{ color: "black", my: 0.5 }}
            >
              Clausula 6ª: O valor total deverá estar quitado até 7 dias antes
              da data do evento sob pena de perder a reserva da data.
            </Typography>

            <Typography
              variant="caption"
              sx={{ color: "black", my: 0.5 }}
            >
              Clausula final: Se por efeito de força maior, o bolo não puder ser
              feito pela Patricia Siqueira, será feito a devolução total do
              valor.
            </Typography>
          </Stack>

          <Stack
            direction="row"
            mt={6}
            justifyContent="space-around"
          >
            <Typography
              variant="body2"
              sx={{ color: "black", my: 0.5 }}
            >
              ____________________________
            </Typography>

            <Typography
              variant="body2"
              sx={{ color: "black", my: 0.5 }}
            >
              ____________________________
            </Typography>
          </Stack>

          <Stack
            direction="row"
            justifyContent="space-around"
            mb={5}
          >
            <Typography
              variant="caption"
              sx={{ color: "black", fontSize: 10 }}
            >
              Assinatura da(o) Contratante
            </Typography>

            <Typography
              variant="caption"
              sx={{ color: "black", fontSize: 10 }}
            >
              Assinatura da Contratada
            </Typography>
          </Stack>

          <Field
            title="Data:"
            value={new Date().toLocaleDateString("pt-BR", {
              weekday: "long",
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          />
        </Box>
      </Box>
    </Container>
  );
};

export default PreviewContractFromProject;
