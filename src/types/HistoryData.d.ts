export interface HistoryData {
  objectIdFieldName: string;
  uniqueIdField: UniqueIdField;
  globalIdFieldName: string;
  fields?: FieldsEntity[] | null;
  features?: FeaturesEntity[] | null;
}
export interface UniqueIdField {
  name: string;
  isSystemMaintained: boolean;
}
export interface FieldsEntity {
  name: string;
  type: string;
  alias: string;
  sqlType: string;
  domain?: null;
  defaultValue?: null;
  length?: number | null;
}
export interface FeaturesEntity {
  attributes: Attributes;
}
export interface Attributes {
  cases: number;
  IdLandkreis: string;
  MeldeDatum: number;
  Landkreis: string;
}

export interface FormattedHistoryData {
  [ags: string]: {
    ags: string;
    name: string;
    history: {
      cases: number;
      date: Date;
      incidence: number | null;
    }[];
  };
}
