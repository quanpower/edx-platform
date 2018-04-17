/* globals gettext */
/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, InputText, StatusAlert } from '@edx/paragon/static';
import StringUtils from 'edx-ui-toolkit/js/utils/string-utils';

class StudentAccountDeletionConfirmationModal extends React.Component {
  constructor(props) {
    super(props);

    this.deleteAccount = this.deleteAccount.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.passwordFieldValidation = this.passwordFieldValidation.bind(this);
    this.state = { password: '' };
  }

  deleteAccount() {
    const { password } = this.state;
    console.log(`deleteAccount with password: ${password}`);
  }

  handleChange(value) {
    this.setState({ password: value });
  }

  passwordFieldValidation(value) {
    let feedback = { isValid: true };

    if (value.length < 1) {
      feedback = {
        isValid: false,
        validationMessage: gettext('A Password is required'),
        dangerIconDescription: 'Error',
      };
    // TODO: Add email validation
    } else if (value.length > 0) {
      feedback = {
        isValid: false,
        validationMessage: gettext('Password is incorrect'),
        dangerIconDescription: 'Error',
      };
    }

    return feedback;
  }

  render() {
    const { onClose } = this.props;
    const loseAccessText = StringUtils.interpolate(
      gettext('You may also lose access to verified certificates and other program credentials like MicroMasters certificates. If you want to make a copy of these for your records before proceeding with deletion, follow the instructions for {htmlStart}printing or downloading a certificate{htmlEnd}.'),
      {
        htmlStart: '<a href="http://edx.readthedocs.io/projects/edx-guide-for-students/en/latest/SFD_certificates.html#printing-a-certificate" target="_blank">',
        htmlEnd: '</a>',
      },
    );

    return (
      <Modal
        title={gettext('Are you sure?')}
        onClose={onClose}
        open
        body={(
          <div>
            <StatusAlert
              alertType="info"
              dialog={(
                <div>
                  <h2>{ gettext('You have selected “Delete my account.” Deletion of your account and personal data is permanent and cannot be undone. EdX will not be able to recover your account or the data that is deleted.') }</h2>
                  <p>{ gettext('If you proceed, you will be unable to use this account to take courses on the edX app, edx.org, or any other site hosted by edX. This includes access to edx.org from your employer’s or university’s system and access to private sites offered by MIT Open Learning, Wharton Online, and Harvard Medical School.') }</p>
                  <p dangerouslySetInnerHTML={{ __html: loseAccessText }} />
                </div>
              )}
              dismissible={false}
              open
            />
            <p>{ gettext('If you still wish to continue and delete your account, please enter your account password:') }</p>
            <InputText
              name="password"
              label="Password"
              description="User password for edX.org"
              validator={this.passwordFieldValidation}
              onChange={this.handleChange}
              autoComplete="new-password"
              themes={['danger']}
            />
          </div>
        )}
        closeText={gettext('Cancel')}
        buttons={[
          <Button
            label={gettext('Yes, Delete')}
            onClick={this.deleteAccount}
          />,
        ]}
      />
    );
  }
}

StudentAccountDeletionConfirmationModal.propTypes = {
  onClose: PropTypes.func,
};

StudentAccountDeletionConfirmationModal.defaultProps = {
  onClose: () => {},
};

export default StudentAccountDeletionConfirmationModal;
