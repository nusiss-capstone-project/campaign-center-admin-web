/* Hand-maintained for admin participant APIs (campaign-center-api). */
export type data_AdminParticipantCampaignVO = {
  id?: number;
  name?: string;
  project_id?: number;
  task_group_id?: number;
};

export type data_AdminParticipantVO = {
  user_id?: number;
  risk_level?: string;
  joined_at?: number;
};

export type data_AdminParticipantListData = {
  campaign?: data_AdminParticipantCampaignVO;
  participants?: data_AdminParticipantVO[];
};
