export interface PetitionItemResponse {
  links: PetitionLinks;
  data: PetitionItem;
}

export interface PetitionListResponse {
  links: PetitionLinks;
  data: PetitionItem[];
}

export interface PetitionLinks {
  self: string;
  first: string;
  last: string;
  next: string | null;
  prev: string | null;
}

export interface PetitionItem {
  type: "petition";
  id: number;
  links: { self: string };
  attributes: PetitionAttributes;
}

export interface PetitionAttributes {
  action: string;
  background: string;
  additional_details: string;
  committee_note: string;
  state: string;
  signature_count: number;
  created_at: string;
  updated_at: string;
  rejected_at: string | null;
  opened_at: string | null;
  closed_at: string | null;
  moderation_threshold_reached_at: string | null;
  response_threshold_reached_at: string | null;
  government_response_at: string | null;
  debate_threshold_reached_at: string | null;
  scheduled_debate_date: string | null;
  debate_outcome_at: string | null;
  creator_name: string;
  rejection: unknown;
  government_response: unknown;
  debate: unknown;
  departments: PetitionDepartment[];
  topics: string[];
}

export interface PetitionDepartment {
  acronym: string;
  name: string;
  url: string;
}
