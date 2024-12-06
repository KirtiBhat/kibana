/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { EuiButton, EuiToolTip } from '@elastic/eui';
import React, { memo } from 'react';
import { FormattedMessage } from '@kbn/i18n-react';
import type { ResponseActionAgentType } from '../../../../../../common/endpoint/service/response_actions/constants';
import { useResponderActionData } from './use_responder_action_data';
import { useUserPrivileges } from '../../../user_privileges';

export const ResponderActionButton = memo<{ agentId: string; agentType: ResponseActionAgentType }>(
  ({ agentType, agentId }) => {
    const { handleResponseActionsClick, isDisabled, tooltip } = useResponderActionData({
      agentType,
      agentId,
    });
    const endpointPrivileges = useUserPrivileges().endpointPrivileges;

    if (!endpointPrivileges.canAccessResponseConsole) {
      return null;
    }

    const actionButtonKey = 'endpointResponseActions-action-button';

    return (
      <EuiToolTip position="top" content={tooltip}>
        <EuiButton
          fill
          key={actionButtonKey}
          data-test-subj={actionButtonKey}
          disabled={isDisabled}
          onClick={handleResponseActionsClick}
        >
          <FormattedMessage
            id="xpack.securitySolution.endpoint.detections.takeAction.responseActionConsole.buttonLabel"
            defaultMessage="Respond"
          />
        </EuiButton>
      </EuiToolTip>
    );
  }
);
ResponderActionButton.displayName = 'ResponderActionButton';
