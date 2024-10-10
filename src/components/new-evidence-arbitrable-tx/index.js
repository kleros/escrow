import React from 'react'
import PropTypes from 'prop-types'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { ClipLoader } from 'react-spinners'

import Button from '../button'

import './new-evidence-arbitrable-tx.css'

const NewEvidenceArbitrableTx = ({ submitEvidence, arbitrable, id }) => (
  <div className="NewEvidenceArbitrableTx">
    <div className="NewEvidenceArbitrableTx-message">
      <p>Submit Evidence</p>
    </div>
    <Formik
      initialValues={{ name: '', description: '', file: '' }}
      // eslint-disable-next-line react/jsx-no-bind
      validate={values => {
        const errors = {}
        if (values.name.length > 55)
          errors.name =
            'The name is too long. The maximum length is 55 characters.'
        if (values.description.length > 255)
          errors.description =
            'The description is too long. The maximum length is 255 characters.'
        if (values.file.size > 1024 * 1024 * 4) {
          errors.file = 'The file is too big. The maximum size is 4MB.'
          alert('The file is too big. The maximum size is 4MB.')
        }
        return errors
      }}
      // eslint-disable-next-line react/jsx-no-bind
      onSubmit={evidence => submitEvidence(evidence, arbitrable, id)}
    >
      {({ isSubmitting, setFieldValue, errors, values }) => (
        <Form>
          <div className="NewEvidenceArbitrableTx-form">
            <Field
              className="NewEvidenceArbitrableTx-form-input"
              name="name"
              placeholder="Name"
            />
            <ErrorMessage name="name" component="div" className="error" />

            <Field
              className="NewEvidenceArbitrableTx-form-textarea"
              component="textarea"
              name="description"
              placeholder="Description."
            >
              Description
            </Field>
            <ErrorMessage
              name="description"
              component="div"
              className="error"
            />

            {/* hack Formik for file type */}
            {/* and store only the path on the file in the redux state */}
            <div className="NewEvidenceArbitrableTx-form-file FileInput">
              <input
                className="FileInput-input--noBorder"
                id="file"
                name="file"
                type="file"
                // eslint-disable-next-line react/jsx-no-bind
                onChange={e => {
                  const file = e.currentTarget.files[0]
                  return setFieldValue('file', {
                    dataURL: window.URL.createObjectURL(
                      e.currentTarget.files[0]
                    ),
                    name: file.name
                  })
                }}
              />
              <div className="FileInput-filename">
                {values.file ? values.file.name : '-- Upload --'}
              </div>
            </div>
            {errors.file && <div className="error">{errors.file}</div>}
          </div>
          <div className="NewEvidenceArbitrableTx-footer">
            <Button
              type="submit"
              disabled={
                isSubmitting ||
                values.name.length === 0 ||
                Object.entries(errors).length > 0
              }
            >
              {isSubmitting && (
                <span
                  style={{
                    position: 'relative',
                    top: '4px',
                    lineHeight: '40px',
                    paddingRight: '4px' // stylelint-disable-line declaration-block-trailing-semicolon
                  }}
                >
                  <ClipLoader size={20} color={'#fff'} />
                </span>
              )}{' '}
              Submit Evidence
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  </div>
)

NewEvidenceArbitrableTx.propTypes = {
  submitEvidence: PropTypes.func.isRequired,
  formArbitrabletx: PropTypes.shape({}),
  arbitrable: PropTypes.shape({}).isRequired,
  id: PropTypes.string.isRequired
}

NewEvidenceArbitrableTx.defaultProps = {
  // State
  formArbitrabletx: v => v
}

export default NewEvidenceArbitrableTx
