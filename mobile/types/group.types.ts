import {
  ProjectsGroupId,
  ScopeGroupId,
  TodayGroupId,
  UpcomingGroupId,
} from "@/types/scope.types";

export type GroupConfig = {
  id: ScopeGroupId;
  order_key: number;
  isOpen: boolean;
};

export type ResolvedGroupConfig<TItem> = GroupConfig & {
  title: string;
  data: TItem[];
};

export type GroupData = {
  title: string;
  data: any[];
};

export type SelectDataReturn<T extends string> = {
  groupsById: GroupByIdType<T>;
  list: any[];
  total: number;
};

export type TodayGroupsById = Record<TodayGroupId, GroupData>;

export type UpcomingGroupsById = Record<UpcomingGroupId, GroupData>;

export type ProjectsGroupsById = Record<ProjectsGroupId, GroupData>;

export type GroupByIdType<T extends string> = Record<T, GroupData>;
