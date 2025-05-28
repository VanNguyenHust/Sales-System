import { MetafieldDefinitionOwnerResource, MetafieldDefinitionType, MetafieldDefinitionValidation } from "@/types/metafield";

export type MetafieldDefinitionSource = {
  title: string;
  icon: React.ReactNode;
  owner_resource: MetafieldDefinitionOwnerResource;
};

export enum TabType {
  DEFINITION = "definition",
  NOT_DEFINITION = "not_definition",
}

export enum BooleanValue {
  TRUE = "true",
  FALSE = "false",
}

export interface ConditionProps {
  type: MetafieldDefinitionType;
  value?: MetafieldDefinitionValidation[];
  onChange: (value: MetafieldDefinitionValidation[]) => void;
  disabled?: boolean;
  error?: string;
}