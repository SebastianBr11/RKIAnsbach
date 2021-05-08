export interface CovidData {
  objectIdFieldName: string;
  uniqueIdField: UniqueIdField;
  globalIdFieldName: string;
  geometryType: string;
  spatialReference: SpatialReference;
  fields?: FieldsEntity[] | null;
  features?: FeaturesEntity[] | null;
}
export interface UniqueIdField {
  name: string;
  isSystemMaintained: boolean;
}
export interface SpatialReference {
  wkid: number;
  latestWkid: number;
}
export interface FieldsEntity {
  name: string;
  type: string;
  alias: string;
  sqlType: string;
  length?: number | null;
  domain?: null;
  defaultValue?: null;
}
export interface FeaturesEntity {
  attributes: Attributes;
}
export interface Attributes {
  RS: string;
  GEN: string;
  EWZ: number;
  cases: number;
  deaths: number;
  county: string;
  last_update: string;
  cases7_lk: number;
  death7_lk: number;
  BL: string;
}

export interface CovidCountyData {
  lastUpdated: Date;
  ags: Attributes['RS'];
  name: Attributes['GEN'];
  county: Attributes['county'];
  state: Attributes['BL'];
  population: Attributes['EWZ'];
  cases: Attributes['cases'];
  deaths: Attributes['deaths'];
  casesPerWeek: Attributes['cases7_lk'];
  deathsPerWeek: Attributes['death7_lk'];
  weekIncidence: number;
  casesPer100k: number;
}
