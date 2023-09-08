/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { getNewRule } from '../../objects/rule';
import { EXCEPTION_CARD_ITEM_NAME } from '../../screens/exceptions';
import {
  disableAutoRefresh,
  selectAllRules,
  expectManagementTableRules,
  goToTheRuleDetailsOf,
} from '../../tasks/alerts_detection_rules';
import { createRuleExceptionItem } from '../../tasks/api_calls/exceptions';
import { createRule } from '../../tasks/api_calls/rules';
import { cleanKibana, resetRulesTableState, deleteAlertsAndRules } from '../../tasks/common';
import {
  assertExceptionItemsExists,
  assertNumberOfExceptionItemsExists,
} from '../../tasks/exceptions';
import { login, visitSecurityDetectionRulesPage } from '../../tasks/login';
import { goToExceptionsTab, viewExpiredExceptionItems } from '../../tasks/rule_details';
import {
  duplicateSelectedRulesWithExceptions,
  duplicateSelectedRulesWithNonExpiredExceptions,
  duplicateSelectedRulesWithoutExceptions,
} from '../../tasks/rules_bulk_edit';
import { esArchiverResetKibana } from '../../tasks/es_archiver';

const RULE_NAME = 'Custom rule for bulk actions';

const prePopulatedIndexPatterns = ['index-1-*', 'index-2-*'];
const prePopulatedTags = ['test-default-tag-1', 'test-default-tag-2'];

const defaultRuleData = {
  index: prePopulatedIndexPatterns,
  tags: prePopulatedTags,
};

const expiredDate = new Date(Date.now() - 1000000).toISOString();
const futureDate = new Date(Date.now() + 1000000).toISOString();

const EXPIRED_EXCEPTION_ITEM_NAME = 'Sample exception item';

const NON_EXPIRED_EXCEPTION_ITEM_NAME = 'Sample exception item with future expiration';

describe('Detection rules, bulk duplicate', () => {
  before(() => {
    cleanKibana();
  });

  beforeEach(() => {
    login();
    // Make sure persisted rules table state is cleared
    resetRulesTableState();
    deleteAlertsAndRules();
    esArchiverResetKibana();
    createRule(
      getNewRule({ name: RULE_NAME, ...defaultRuleData, rule_id: '1', enabled: false })
    ).then((response) => {
      createRuleExceptionItem(response.body.id, [
        {
          description: 'Exception item for rule default exception list',
          entries: [
            {
              field: 'user.name',
              operator: 'included',
              type: 'match',
              value: 'some value',
            },
          ],
          name: EXPIRED_EXCEPTION_ITEM_NAME,
          type: 'simple',
          expire_time: expiredDate,
        },
        {
          description: 'Exception item for rule default exception list',
          entries: [
            {
              field: 'user.name',
              operator: 'included',
              type: 'match',
              value: 'some value',
            },
          ],
          name: NON_EXPIRED_EXCEPTION_ITEM_NAME,
          type: 'simple',
          expire_time: futureDate,
        },
      ]);
    });

    visitSecurityDetectionRulesPage();
    disableAutoRefresh();
  });

  it('Duplicates rules', () => {
    selectAllRules();
    duplicateSelectedRulesWithoutExceptions();
    expectManagementTableRules([`${RULE_NAME} [Duplicate]`]);
  });

  describe('With exceptions', () => {
    it('Duplicates rules with expired exceptions', () => {
      selectAllRules();
      duplicateSelectedRulesWithExceptions();
      expectManagementTableRules([`${RULE_NAME} [Duplicate]`]);
      goToTheRuleDetailsOf(`${RULE_NAME} [Duplicate]`);
      goToExceptionsTab();
      assertExceptionItemsExists(EXCEPTION_CARD_ITEM_NAME, [NON_EXPIRED_EXCEPTION_ITEM_NAME]);
      viewExpiredExceptionItems();
      assertExceptionItemsExists(EXCEPTION_CARD_ITEM_NAME, [EXPIRED_EXCEPTION_ITEM_NAME]);
    });

    it('Duplicates rules with exceptions, excluding expired exceptions', () => {
      selectAllRules();
      duplicateSelectedRulesWithNonExpiredExceptions();
      expectManagementTableRules([`${RULE_NAME} [Duplicate]`]);
      goToTheRuleDetailsOf(`${RULE_NAME} [Duplicate]`);
      goToExceptionsTab();
      assertExceptionItemsExists(EXCEPTION_CARD_ITEM_NAME, [NON_EXPIRED_EXCEPTION_ITEM_NAME]);
      viewExpiredExceptionItems();
      assertNumberOfExceptionItemsExists(0);
    });
  });
});
