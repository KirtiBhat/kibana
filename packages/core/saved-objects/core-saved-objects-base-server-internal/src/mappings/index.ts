/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

export { getTypes, getProperty, getRootProperties, getRootPropertiesObjects } from './lib';
export type {
  SavedObjectsTypeMappingDefinitions,
  V2AlgoIndexMappingMeta,
  ZdtAlgoIndexMappingMeta,
  IndexMappingMeta,
  IndexMapping,
  IndexTypesMap,
  IndexMappingMigrationStateMeta,
} from './types';
