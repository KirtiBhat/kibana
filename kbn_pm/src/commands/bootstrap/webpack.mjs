/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import { run } from '../../lib/spawn.mjs';
import { REPO_ROOT } from '../../lib/paths.mjs';
import path from 'path';

export async function buildWebpackBundles(log, { quiet }) {
  const packageNames = ['kbn-ui-shared-deps-npm', 'kbn-ui-shared-deps-src', 'kbn-monaco'];
  for (const packageName of packageNames) {
    await buildPackage(packageName, log, { quiet });
  }
}

async function buildPackage(packageName, { quiet }) {
  await run('yarn', ['build'], {
    cwd: path.resolve(REPO_ROOT, 'packages', packageName),
    pipe: !quiet,
  });
}
