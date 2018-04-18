/* globals gettext */
/* eslint-disable react/no-danger */
import React from 'react';
import 'whatwg-fetch';
import PropTypes from 'prop-types';
import { Button, Modal, Icon, InputText, StatusAlert } from '@edx/paragon/static';
import StringUtils from 'edx-ui-toolkit/js/utils/string-utils';

class StudentAccountDeletionConfirmationModal extends React.Component {
  constructor(props) {
    super(props);

    this.deleteAccount = this.deleteAccount.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.passwordFieldValidation = this.passwordFieldValidation.bind(this);
    this.state = {
      password: '',
      passwordSubmitted: false,
      accountQueuedForDeletion: false,
    };
  }

  deleteAccount() {
    const { password } = this.state;

    fetch('/accounts/verify_password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
      }).then(function(response) {
        console.log('response: ', response);
        return response.json()
      }).then(function(json) {
        console.log('parsed json', json)
      }).catch(function(ex) {
        console.log('parsing failed', ex)
      })
    // console.log(`deleteAccount with password: ${password}`);
    // fetch.('/accounts/verify_password', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(data)
    // }).then(response => {
    //   if (response.ok) {
    //     return dispatch(formSubmissionSuccess(response.json()));
    //   } else {
    //     const error = new Error(response.statusText);
    //     error.response = response;
    //     return dispatch(formSubmissionError(error));
    //   }
    // }).catch((error) => dispatch(formSubmissionError(error)));
    this.setState({ accountQueuedForDeletion: true });
  }

  // TODO: hook into field validation somehow
  failedSubmission() {
    return {
      isValid: false,
      validationMessage: gettext('Password is incorrect'),
      dangerIconDescription: 'Error',
    };
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
    }

    return feedback;
  }

  renderConfirmationModal() {
    const { onClose } = this.props;
    const { password } = this.state;
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
        aria-live="polite"
        open
        body={(
          <div>
            <StatusAlert
              dialog={(
                <div className="modal-alert">
                  <div className="icon-wrapper">
                    <Icon className={['fa', 'fa-exclamation-triangle', 'fa-2x']} />
                  </div>
                  <div className="alert-content">
                    <h3 className="alert-title">{ gettext('You have selected “Delete my account.” Deletion of your account and personal data is permanent and cannot be undone. EdX will not be able to recover your account or the data that is deleted.') }</h3>
                    <p>{ gettext('If you proceed, you will be unable to use this account to take courses on the edX app, edx.org, or any other site hosted by edX. This includes access to edx.org from your employer’s or university’s system and access to private sites offered by MIT Open Learning, Wharton Online, and Harvard Medical School.') }</p>
                    <p dangerouslySetInnerHTML={{ __html: loseAccessText }} />
                  </div>
                </div>
              )}
              dismissible={false}
              open
            />
            <p className="next-steps">{ gettext('If you still wish to continue and delete your account, please enter your account password:') }</p>
            <InputText
              name="confirm-password"
              label="Password"
              type="password"
              className={['confirm-password-input']}
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
            disabled={password.length === 0}
          />,
        ]}
      />
    );
  }

  renderSuccessModal() {
    const { onClose } = this.props;

    return (
      <Modal
        title={gettext('We\'re sorry to see you go!')}
        body={gettext('Your account will be deleted in the next XX[hours/days/weeks].')}
        onClose={onClose}
        aria-live="polite"
        open
      />
    );
  }

  render() {
    const { accountQueuedForDeletion } = this.state;

    return accountQueuedForDeletion ? this.renderSuccessModal() : this.renderConfirmationModal();
  }
}

StudentAccountDeletionConfirmationModal.propTypes = {
  onClose: PropTypes.func,
};

StudentAccountDeletionConfirmationModal.defaultProps = {
  onClose: () => {},
};

export default StudentAccountDeletionConfirmationModal;
