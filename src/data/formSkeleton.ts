type FieldType = {
  name: string;
  label: string;
  type: string;
  disabled?: boolean;
  required?: boolean;
};

type FormSkeleton = {
  step: number;
  label: string;
  description: string;
  optional: boolean;
  fields: FieldType[];
}[];

export const BatterOptions = [
  "branca (genoise)",
  "red velvet",
  "chocolate",
  "laranja",
];

export const FillingOptions = [
  "brigadeiro branco",
  "brigadeiro de cream cheese",
  "brigadeiro de limão siciliano",
  "brigadeiro de pistache",
  "brigadeiro de baunilha",
  "brigadeiro ao leite",
  "brigadeiro de amarena",
  "brigadeiro de nozes",
  "cocada fresca",
  "caramelo salgado",
  "creme de maracujá",
  "doce de leite",
  "geléia de abacaxi",
  "geléia de morango",
  "geléia de ameixa",
  "geléia de damasco",
  "geléia de frutas amarelas",
  "ganache meio amargo",
];

export const formSkeleton: FormSkeleton = [
  {
    step: 1,
    label: "Identificação das Partes",
    description: "Identificação das partes envolvidas no contrato",
    optional: false,
    fields: [
      {
        name: "nomeCliente",
        label: "Nome do Cliente",
        type: "text",
        disabled: false,
        required: true,
      },
      {
        name: "dadosContratada",
        label: "Dados da Contratada",
        type: "text",
        disabled: true,
        required: true,
      },
    ],
  },
  {
    step: 2,
    label: "Do Objeto do Contrato",
    description: "Descrição do objeto do contrato",
    optional: false,
    fields: [
      {
        name: "qtdFatias",
        label: "Quantidade de Fatias",
        type: "number",
        disabled: false,
        required: true,
      },
      {
        name: "massaBolo",
        label: "Massa do Bolo",
        type: "selection",
        disabled: false,
        required: true,
      },
      {
        name: "recheio1",
        label: "Recheio 1",
        type: "selection",
        disabled: false,
        required: true,
      },
      {
        name: "recheio2",
        label: "Recheio 2",
        type: "selection",
        disabled: false,
        required: true,
      },
      {
        name: "recheio3",
        label: "Recheio 3",
        type: "selection",
        disabled: false,
        required: true,
      },
      {
        name: "observacoesBolo",
        label: "Observações do Bolo",
        type: "text",
        disabled: false,
        required: true,
      },
      {
        name: "modeloBolo",
        label: "Modelo do Bolo",
        type: "text",
        disabled: false,
        required: true,
      },
      {
        name: "valorBolo",
        label: "Valor do Bolo",
        type: "number",
        disabled: false,
        required: true,
      },
      {
        name: "sinalBolo",
        label: "Sinal do Bolo",
        type: "number",
        disabled: false,
        required: true,
      },
      {
        name: "saldoBolo",
        label: "Saldo do Bolo",
        type: "number",
        disabled: false,
        required: true,
      },
      {
        name: "formaPagamentoBolo",
        label: "Forma de Pagamento do Bolo",
        type: "text",
        disabled: false,
      },
    ],
  },
  {
    step: 3,
    label: "Obrigações da Contratante",
    description: "Obrigações da contratante",
    optional: false,
    fields: [
      {
        name: "localEntrega",
        label: "Local de Entrega",
        type: "text",
        disabled: false,
        required: true,
      },
      {
        name: "dataEntrega",
        label: "Data de Entrega",
        type: "date",
        disabled: false,
        required: true,
      },
      {
        name: "horaEntrega",
        label: "Hora de Entrega",
        type: "time",
        disabled: false,
        required: true,
      },
      {
        name: "telefoneCliente",
        label: "Telefone do Cliente",
        type: "text",
        disabled: false,
        required: true,
      },
      {
        name: "telefoneAdicional",
        label: "Telefone Adicional",
        type: "text",
        disabled: false,
        required: false,
      },
      {
        name: "nomeContatoEvento",
        label: "Nome do Contato do Evento",
        type: "text",
        disabled: false,
      },
      {
        name: "telefoneContatoEvento",
        label: "Telefone do Contato do Evento",
        type: "text",
        disabled: false,
      },
    ],
  },
  // {
  //   step: 4,
  //   label: "Da Validação do Contrato",
  //   description: "Validação do contrato",
  //   optional: false,
  //   fields: [
  //     // No fields for this step as per current requirements
  //   ],
  // },
];
