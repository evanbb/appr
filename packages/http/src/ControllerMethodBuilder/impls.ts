import {
  registerMetadataSetter,
  type HandlerMetadata,
} from './index';

export const ProducesResponseType = registerMetadataSetter(
  'ProducesResponseType',
  (statusCode: number) => (metadata: HandlerMetadata) => {
    metadata.validResponseCodes =
      metadata.validResponseCodes || new Set<number>();
    metadata.validResponseCodes.add(statusCode);
  }
);
