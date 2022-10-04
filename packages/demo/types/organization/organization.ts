import { BusinessUnit } from '../business-unit/business-unit';
import { ChannelResourceIdentifier } from '../channel/channel';
import { Store } from '../store/store';

export interface Organization {
  businessUnit: BusinessUnit;
  distributionChannel: ChannelResourceIdentifier;
  store: Store;
}
