import { ClusterDataField } from "../models/cluster-data-field.type";

export const pieChartColors: Record<ClusterDataField, string> = {
  e_waste: "#277DA1",
  glass: "#90BE6D",
  metal: "#F94144",
  paper: "#F9C74F",
  plastic: "#F3722C",
} as const;
