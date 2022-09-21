import { ChannelResourceIdentifier } from '../channel/channel';
import { ProductSelectionSettingDraft } from '../product-selection/product-selection';

export interface Store {
  key: string;
  name: string;
  id?: string;
  distributionChannels?: ChannelResourceIdentifier[];
  supplyChannels?: ChannelResourceIdentifier[];
  productSelections?: ProductSelectionSettingDraft[];
}

export interface StoreKeyReference {
  key: string;
  typeId: 'store';
}
